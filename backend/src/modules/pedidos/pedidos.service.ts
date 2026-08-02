// src/modules/pedidos/pedidos.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto, StatusPedido } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        medicamento: true,
        solicitante: {
          select: { id: true, nome: true, email: true },
        },
        aprovador: {
          select: { id: true, nome: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        medicamento: true,
        solicitante: true,
        aprovador: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return pedido;
  }

  async create(createPedidoDto: CreatePedidoDto, solicitanteId: string) {
    const medicamento = await this.prisma.medicamento.findUnique({
      where: { id: createPedidoDto.medicamentoId },
    });

    if (!medicamento) {
      throw new NotFoundException('Medicamento não encontrado');
    }

    const valorTotal =
      medicamento.precoUnitario * createPedidoDto.quantidadeSolicitada;

    return this.prisma.pedido.create({
      data: {
        medicamentoId: createPedidoDto.medicamentoId,
        medicamentoNome: medicamento.nome,
        quantidadeSolicitada: createPedidoDto.quantidadeSolicitada,
        quantidadeEntregue: 0,
        dataPrevistaEntrega: createPedidoDto.dataPrevistaEntrega,
        valorUnitario: medicamento.precoUnitario,
        valorTotal,
        justificativa: createPedidoDto.justificativa,
        observacoes: createPedidoDto.observacoes,
        solicitanteId,
        status: StatusPedido.PENDENTE,
      },
      include: {
        medicamento: true,
        solicitante: true,
      },
    });
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id);
    return this.prisma.pedido.update({
      where: { id },
      data: updatePedidoDto,
      include: {
        medicamento: true,
        solicitante: true,
        aprovador: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pedido.delete({ where: { id } });
  }

  async aprovar(id: string, aprovadorId: string) {
    const pedido = await this.findOne(id);

    if (pedido.status !== StatusPedido.PENDENTE) {
      throw new BadRequestException(
        `Pedido não pode ser aprovado. Status atual: ${pedido.status}`,
      );
    }

    return this.prisma.pedido.update({
      where: { id },
      data: {
        status: StatusPedido.APROVADO,
        aprovadorId,
      },
      include: {
        medicamento: true,
        solicitante: true,
        aprovador: true,
      },
    });
  }

  async registrarEntrega(id: string, quantidade: number) {
    const pedido = await this.findOne(id);

    if (
      pedido.status !== StatusPedido.APROVADO &&
      pedido.status !== StatusPedido.ENVIADO
    ) {
      throw new BadRequestException(
        `Pedido não pode receber entrega. Status: ${pedido.status}`,
      );
    }

    const novaQuantidadeEntregue = pedido.quantidadeEntregue + quantidade;

    if (novaQuantidadeEntregue > pedido.quantidadeSolicitada) {
      throw new BadRequestException('Quantidade entregue excede a solicitada');
    }

    // Atualizar estoque do medicamento
    await this.prisma.medicamento.update({
      where: { id: pedido.medicamentoId },
      data: {
        quantidadeAtual: {
          increment: quantidade,
        },
      },
    });

    // Se for entrega completa
    if (novaQuantidadeEntregue === pedido.quantidadeSolicitada) {
      return this.prisma.pedido.update({
        where: { id },
        data: {
          quantidadeEntregue: novaQuantidadeEntregue,
          status: StatusPedido.ENTREGUE,
          dataEntregaReal: new Date(),
        },
      });
    }

    // Entrega parcial
    return this.prisma.pedido.update({
      where: { id },
      data: {
        quantidadeEntregue: novaQuantidadeEntregue,
      },
    });
  }

  async cancelar(id: string, motivo: string) {
    const pedido = await this.findOne(id);

    if (pedido.status === StatusPedido.ENTREGUE) {
      throw new BadRequestException(
        'Pedido já entregue não pode ser cancelado',
      );
    }

    if (pedido.status === StatusPedido.CANCELADO) {
      throw new BadRequestException('Pedido já está cancelado');
    }

    return this.prisma.pedido.update({
      where: { id },
      data: {
        status: StatusPedido.CANCELADO,
        observacoes: `${pedido.observacoes || ''}\nCancelado: ${motivo}`,
      },
    });
  }

  async getPedidosPendentes() {
    return this.prisma.pedido.findMany({
      where: { status: StatusPedido.PENDENTE },
      include: {
        medicamento: true,
        solicitante: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getPedidosAprovados() {
    return this.prisma.pedido.findMany({
      where: { status: StatusPedido.APROVADO },
      include: {
        medicamento: true,
        solicitante: true,
      },
      orderBy: { dataPrevistaEntrega: 'asc' },
    });
  }

  async getPedidosAtrasados() {
    const hoje = new Date();
    return this.prisma.pedido.findMany({
      where: {
        status: { in: [StatusPedido.APROVADO, StatusPedido.ENVIADO] },
        dataPrevistaEntrega: { lt: hoje },
      },
      include: {
        medicamento: true,
        solicitante: true,
      },
      orderBy: { dataPrevistaEntrega: 'asc' },
    });
  }

  async getPedidosEntregues() {
    return this.prisma.pedido.findMany({
      where: { status: StatusPedido.ENTREGUE },
      include: {
        medicamento: true,
        solicitante: true,
        aprovador: true,
      },
      orderBy: { dataEntregaReal: 'desc' },
    });
  }

  async getResumo() {
    const pedidos = await this.prisma.pedido.findMany();

    const total = pedidos.length;
    const pendentes = pedidos.filter(
      (p) => p.status === StatusPedido.PENDENTE,
    ).length;
    const aprovados = pedidos.filter(
      (p) => p.status === StatusPedido.APROVADO,
    ).length;
    const entregues = pedidos.filter(
      (p) => p.status === StatusPedido.ENTREGUE,
    ).length;
    const cancelados = pedidos.filter(
      (p) => p.status === StatusPedido.CANCELADO,
    ).length;
    const valorTotal = pedidos.reduce((sum, p) => sum + p.valorTotal, 0);

    return {
      total,
      pendentes,
      aprovados,
      entregues,
      cancelados,
      valorTotal,
      taxaEntrega: total > 0 ? (entregues / total) * 100 : 0,
    };
  }
}
