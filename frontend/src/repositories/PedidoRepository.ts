import { PedidoType } from '../types';

const mockPedidos: PedidoType[] = [
  {
    id: '1',
    medicamentoId: '2',
    medicamentoNome: 'Amoxicilina',
    quantidadeSolicitada: 200,
    quantidadeEntregue: 0,
    dataSolicitacao: new Date(),
    dataPrevistaEntrega: new Date(Date.now() + 7 * 86400000),
    dataEntregaReal: null,
    status: 'PENDENTE',
    valorUnitario: 1.20,
    justificativa: 'Estoque baixo - reposição urgente',
    solicitanteId: 'USER001',
    aprovadorId: null
  },
  {
    id: '2',
    medicamentoId: '1',
    medicamentoNome: 'Paracetamol',
    quantidadeSolicitada: 300,
    quantidadeEntregue: 300,
    dataSolicitacao: new Date(Date.now() - 15 * 86400000),
    dataPrevistaEntrega: new Date(Date.now() - 5 * 86400000),
    dataEntregaReal: new Date(Date.now() - 3 * 86400000),
    status: 'ENTREGUE',
    valorUnitario: 0.50,
    justificativa: 'Reposição trimestral',
    solicitanteId: 'USER001',
    aprovadorId: 'ADMIN001'
  }
];

export class PedidoRepository {
  async findAll(): Promise<PedidoType[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPedidos];
  }

  async findById(id: string): Promise<PedidoType | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPedidos.find(p => p.id === id) || null;
  }

  async save(pedido: PedidoType): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockPedidos.push(pedido);
  }

  async update(pedido: PedidoType): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPedidos.findIndex(p => p.id === pedido.id);
    if (index !== -1) {
      mockPedidos[index] = pedido;
    }
  }
}