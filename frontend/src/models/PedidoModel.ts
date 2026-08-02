export type StatusPedido = 'PENDENTE' | 'APROVADO' | 'EM_ANALISE' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';

export const StatusPedidoValues = {
  PENDENTE: 'PENDENTE' as StatusPedido,
  APROVADO: 'APROVADO' as StatusPedido,
  EM_ANALISE: 'EM_ANALISE' as StatusPedido,
  ENVIADO: 'ENVIADO' as StatusPedido,
  ENTREGUE: 'ENTREGUE' as StatusPedido,
  CANCELADO: 'CANCELADO' as StatusPedido
};

export class PedidoModel {
  public id: string;
  public medicamentoId: string;
  public medicamentoNome: string;
  public quantidadeSolicitada: number;
  public quantidadeEntregue: number;
  public dataSolicitacao: Date;
  public dataPrevistaEntrega: Date;
  public dataEntregaReal: Date | null;
  public status: StatusPedido;
  public valorUnitario: number;
  public justificativa: string;
  public solicitanteId: string;
  public aprovadorId: string | null;

  constructor(
    id: string,
    medicamentoId: string,
    medicamentoNome: string,
    quantidadeSolicitada: number,
    quantidadeEntregue: number,
    dataSolicitacao: Date,
    dataPrevistaEntrega: Date,
    dataEntregaReal: Date | null,
    status: StatusPedido,
    valorUnitario: number,
    justificativa: string,
    solicitanteId: string,
    aprovadorId: string | null
  ) {
    this.id = id;
    this.medicamentoId = medicamentoId;
    this.medicamentoNome = medicamentoNome;
    this.quantidadeSolicitada = quantidadeSolicitada;
    this.quantidadeEntregue = quantidadeEntregue;
    this.dataSolicitacao = dataSolicitacao;
    this.dataPrevistaEntrega = dataPrevistaEntrega;
    this.dataEntregaReal = dataEntregaReal;
    this.status = status;
    this.valorUnitario = valorUnitario;
    this.justificativa = justificativa;
    this.solicitanteId = solicitanteId;
    this.aprovadorId = aprovadorId;
  }

  getQuantidadePendente(): number {
    return this.quantidadeSolicitada - this.quantidadeEntregue;
  }

  isAtrasado(): boolean {
    if (this.status === StatusPedidoValues.ENTREGUE || this.status === StatusPedidoValues.CANCELADO) {
      return false;
    }
    return new Date() > this.dataPrevistaEntrega;
  }

  getDiasAtraso(): number {
    if (!this.isAtrasado()) return 0;
    const hoje = new Date();
    return Math.ceil((hoje.getTime() - this.dataPrevistaEntrega.getTime()) / (1000 * 3600 * 24));
  }

  podeAprovar(): boolean {
    return this.status === StatusPedidoValues.PENDENTE;
  }

  aprovar(aprovadorId: string): void {
    if (!this.podeAprovar()) throw new Error('Pedido não pode ser aprovado');
    this.status = StatusPedidoValues.APROVADO;
    this.aprovadorId = aprovadorId;
  }
}