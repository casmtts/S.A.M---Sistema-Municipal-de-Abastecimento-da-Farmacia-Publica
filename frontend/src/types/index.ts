export interface MedicamentoType {
  id: string;
  nome: string;
  principioAtivo: string;
  concentracao: string;
  formaFarmaceutica: string;
  codigoBarras: string;
  lote: string;
  validade: Date;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  precoUnitario: number;
  fornecedorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicamentoDTO {
  nome: string;
  principioAtivo: string;
  concentracao: string;
  formaFarmaceutica: string;
  codigoBarras: string;
  lote: string;
  validade: Date;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  precoUnitario: number;
  fornecedorId: string;
}

export interface PedidoType {
  id: string;
  medicamentoId: string;
  medicamentoNome: string;
  quantidadeSolicitada: number;
  quantidadeEntregue: number;
  dataSolicitacao: Date;
  dataPrevistaEntrega: Date;
  dataEntregaReal: Date | null;
  status: 'PENDENTE' | 'APROVADO' | 'EM_ANALISE' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
  valorUnitario: number;
  justificativa: string;
  solicitanteId: string;
  aprovadorId: string | null;
}

export interface FornecedorType {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  telefone: string;
  email: string;
  ativo: boolean;
}