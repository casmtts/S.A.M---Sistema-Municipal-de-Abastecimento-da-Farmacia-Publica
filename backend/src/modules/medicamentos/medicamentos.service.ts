import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Injectable()
export class MedicamentosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.medicamento.findMany({
      include: {
        fornecedor: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const medicamento = await this.prisma.medicamento.findUnique({
      where: { id },
      include: {
        fornecedor: true,
        movimentacoes: {
          orderBy: { data: 'desc' },
          take: 10,
        },
      },
    });

    if (!medicamento) {
      throw new NotFoundException(`Medicamento com ID ${id} não encontrado`);
    }

    return medicamento;
  }

  async create(createMedicamentoDto: CreateMedicamentoDto) {
    return this.prisma.medicamento.create({
      data: createMedicamentoDto,
      include: { fornecedor: true },
    });
  }

  async update(id: string, updateMedicamentoDto: UpdateMedicamentoDto) {
    await this.findOne(id);
    return this.prisma.medicamento.update({
      where: { id },
      data: updateMedicamentoDto,
      include: { fornecedor: true },
    });
  }

  async updateEstoque(
    id: string,
    quantidade: number,
    tipo: 'ENTRADA' | 'SAIDA',
  ) {
    const medicamento = await this.findOne(id);

    let novaQuantidade = medicamento.quantidadeAtual;
    if (tipo === 'ENTRADA') {
      novaQuantidade += quantidade;
    } else {
      if (quantidade > medicamento.quantidadeAtual) {
        throw new Error(
          `Estoque insuficiente. Disponível: ${medicamento.quantidadeAtual}`,
        );
      }
      novaQuantidade -= quantidade;
    }

    return this.prisma.medicamento.update({
      where: { id },
      data: { quantidadeAtual: novaQuantidade },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.medicamento.delete({ where: { id } });
  }

  async getAlertasEstoque() {
    const medicamentos = await this.prisma.medicamento.findMany();

    const criticos = medicamentos.filter(
      (m) => m.quantidadeAtual <= m.quantidadeMinima * 0.5,
    );

    const baixos = medicamentos.filter(
      (m) =>
        m.quantidadeAtual <= m.quantidadeMinima &&
        m.quantidadeAtual > m.quantidadeMinima * 0.5,
    );

    return { criticos, baixos };
  }

  async getProximosVencer(dias: number = 30) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + dias);

    return this.prisma.medicamento.findMany({
      where: {
        validade: {
          lte: dataLimite,
          gt: new Date(),
        },
      },
      orderBy: { validade: 'asc' },
    });
  }

  async getResumo() {
    const medicamentos = await this.prisma.medicamento.findMany();

    const total = medicamentos.length;
    const valorTotal = medicamentos.reduce(
      (sum, m) => sum + m.quantidadeAtual * m.precoUnitario,
      0,
    );
    const unidadesTotal = medicamentos.reduce(
      (sum, m) => sum + m.quantidadeAtual,
      0,
    );
    const criticos = medicamentos.filter(
      (m) => m.quantidadeAtual <= m.quantidadeMinima * 0.5,
    ).length;

    return { total, valorTotal, unidadesTotal, criticos };
  }
}
