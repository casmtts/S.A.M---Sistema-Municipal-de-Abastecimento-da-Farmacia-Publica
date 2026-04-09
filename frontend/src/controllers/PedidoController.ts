import { PedidoType } from '../types';
import { StatusPedidoValues } from '../models/PedidoModel';
import { PedidoRepository } from '../repositories/PedidoRepository';
import { MedicamentoController } from './MedicamentoController';

export class PedidoController {
  private repository: PedidoRepository;
  private medicamentoController: MedicamentoController;

  constructor() {
    this.repository = new PedidoRepository();
    this.medicamentoController = new MedicamentoController();
  }

  async criarPedido(data: any): Promise<PedidoType> {
    const medicamento = await this.medicamentoController.buscarPorId(data.medicamentoId);
    if (!medicamento) throw new Error('Medicamento não encontrado');
    
    if (data.quantidade <= 0) throw new Error('Quantidade deve ser maior que zero');
    
    const pedido: PedidoType = {
      id: crypto.randomUUID(),
      medicamentoId: data.medicamentoId,
      medicamentoNome: medicamento.nome,
      quantidadeSolicitada: data.quantidade,
      quantidadeEntregue: 0,
      dataSolicitacao: new Date(),
      dataPrevistaEntrega: new Date(data.dataPrevistaEntrega),
      dataEntregaReal: null,
      status: StatusPedidoValues.PENDENTE,
      valorUnitario: medicamento.precoUnitario,
      justificativa: data.justificativa || '',
      solicitanteId: data.solicitanteId,
      aprovadorId: null,
    };
    
    await this.repository.save(pedido);
    return pedido;
  }

  async listarPedidos(): Promise<PedidoType[]> {
    return await this.repository.findAll();
  }

  async aprovarPedido(id: string, aprovadorId: string): Promise<PedidoType> {
    const pedido = await this.repository.findById(id);
    if (!pedido) throw new Error('Pedido não encontrado');
    
    if (pedido.status !== StatusPedidoValues.PENDENTE) {
      throw new Error('Pedido não pode ser aprovado');
    }
    pedido.status = StatusPedidoValues.APROVADO;
    pedido.aprovadorId = aprovadorId;
    await this.repository.update(pedido);
    return pedido;
  }

  async getPedidosAtrasados(): Promise<PedidoType[]> {
    const pedidos = await this.repository.findAll();
    return pedidos.filter((p) => {
      if (p.status === StatusPedidoValues.ENTREGUE || p.status === StatusPedidoValues.CANCELADO) {
        return false;
      }
      return new Date() > new Date(p.dataPrevistaEntrega);
    });
  }
}