import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateMovimentacaoDto,
  TipoMovimentacao,
} from './dto/create-movimentacoes.dto';

@Injectable()
export class MovimentacoesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Listar todas as movimentações
   */
  async findAll() {
    return this.prisma.movimentacao.findMany({
      include: {
        medicamento: {
          select: {
            id: true,
            nome: true,
            principioAtivo: true,
            concentracao: true,
            formaFarmaceutica: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cargo: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  /**
   * Buscar movimentação por ID
   */
  async findOne(id: string) {
    const movimentacao = await this.prisma.movimentacao.findUnique({
      where: { id },
      include: {
        medicamento: {
          select: {
            id: true,
            nome: true,
            principioAtivo: true,
            concentracao: true,
            formaFarmaceutica: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cargo: true,
          },
        },
      },
    });

    if (!movimentacao) {
      throw new NotFoundException(`Movimentação com ID ${id} não encontrada`);
    }

    return movimentacao;
  }

  /**
   * Criar nova movimentação
   */
  async create(
    createMovimentacaoDto: CreateMovimentacaoDto,
    responsavelId: string,
    responsavelNome: string,
  ) {
    const medicamento = await this.prisma.medicamento.findUnique({
      where: { id: createMovimentacaoDto.medicamentoId },
      select: {
        id: true,
        nome: true,
        quantidadeAtual: true,
        precoUnitario: true,
      },
    });

    if (!medicamento) {
      throw new NotFoundException('Medicamento não encontrado');
    }

    // Validar estoque para saídas
    if (createMovimentacaoDto.tipo !== TipoMovimentacao.ENTRADA) {
      if (createMovimentacaoDto.quantidade > medicamento.quantidadeAtual) {
        throw new BadRequestException(
          `Estoque insuficiente. Disponível: ${medicamento.quantidadeAtual} unidades`,
        );
      }
    }

    // Atualizar estoque
    let novaQuantidade = medicamento.quantidadeAtual;
    if (createMovimentacaoDto.tipo === TipoMovimentacao.ENTRADA) {
      novaQuantidade += createMovimentacaoDto.quantidade;
    } else {
      novaQuantidade -= createMovimentacaoDto.quantidade;
    }

    await this.prisma.medicamento.update({
      where: { id: createMovimentacaoDto.medicamentoId },
      data: { quantidadeAtual: novaQuantidade },
    });

    // Registrar movimentação
    return this.prisma.movimentacao.create({
      data: {
        medicamentoId: createMovimentacaoDto.medicamentoId,
        medicamentoNome: medicamento.nome,
        tipo: createMovimentacaoDto.tipo,
        quantidade: createMovimentacaoDto.quantidade,
        responsavelId,
        responsavelNome,
        documentoReferencia: createMovimentacaoDto.documentoReferencia,
        observacao: createMovimentacaoDto.observacao,
        unidadeOrigemId: createMovimentacaoDto.unidadeOrigemId,
        unidadeDestinoId: createMovimentacaoDto.unidadeDestinoId,
      },
      include: {
        medicamento: {
          select: {
            id: true,
            nome: true,
            principioAtivo: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Buscar movimentações por medicamento
   */
  async getByMedicamento(medicamentoId: string) {
    const medicamento = await this.prisma.medicamento.findUnique({
      where: { id: medicamentoId },
      select: { id: true, nome: true },
    });

    if (!medicamento) {
      throw new NotFoundException(
        `Medicamento com ID ${medicamentoId} não encontrado`,
      );
    }

    return this.prisma.movimentacao.findMany({
      where: { medicamentoId },
      include: {
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  /**
   * Buscar apenas entradas
   */
  async getEntradas() {
    return this.prisma.movimentacao.findMany({
      where: { tipo: TipoMovimentacao.ENTRADA },
      include: {
        medicamento: {
          select: {
            id: true,
            nome: true,
            principioAtivo: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  /**
   * Buscar apenas saídas
   */
  async getSaidas() {
    return this.prisma.movimentacao.findMany({
      where: { tipo: TipoMovimentacao.SAIDA },
      include: {
        medicamento: {
          select: {
            id: true,
            nome: true,
            principioAtivo: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  /**
   * Buscar apenas dispensas
   */
  async getDispensas() {
    return this.prisma.movimentacao.findMany({
      where: { tipo: TipoMovimentacao.DISPENSA },
      include: {
        medicamento: {
          select: {
            id: true,
            nome: true,
            principioAtivo: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  /**
   * Buscar movimentações por período
   */
  async getByPeriodo(dataInicio: Date, dataFim: Date) {
    return this.prisma.movimentacao.findMany({
      where: {
        data: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        medicamento: {
          select: {
            id: true,
            nome: true,
            principioAtivo: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  /**
   * Resumo estatístico das movimentações
   */
  async getResumo() {
    const movimentacoes = await this.prisma.movimentacao.findMany();

    const totalEntradas = movimentacoes
      .filter((m) => m.tipo === TipoMovimentacao.ENTRADA)
      .reduce((sum, m) => sum + m.quantidade, 0);

    const totalSaidas = movimentacoes
      .filter((m) => m.tipo === TipoMovimentacao.SAIDA)
      .reduce((sum, m) => sum + m.quantidade, 0);

    const totalDispensas = movimentacoes
      .filter((m) => m.tipo === TipoMovimentacao.DISPENSA)
      .reduce((sum, m) => sum + m.quantidade, 0);

    const totalMovimentacoes = movimentacoes.length;
    const entradasCount = movimentacoes.filter(
      (m) => m.tipo === TipoMovimentacao.ENTRADA,
    ).length;
    const saidasCount = movimentacoes.filter(
      (m) => m.tipo === TipoMovimentacao.SAIDA,
    ).length;
    const dispensasCount = movimentacoes.filter(
      (m) => m.tipo === TipoMovimentacao.DISPENSA,
    ).length;

    return {
      totalMovimentacoes,
      entradas: {
        quantidade: totalEntradas,
        registros: entradasCount,
      },
      saidas: {
        quantidade: totalSaidas,
        registros: saidasCount,
      },
      dispensas: {
        quantidade: totalDispensas,
        registros: dispensasCount,
      },
    };
  }

  /**
   * Remover movimentação
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.movimentacao.delete({ where: { id } });
  }
}
