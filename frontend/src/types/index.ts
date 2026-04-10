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

export interface FornecedorType {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  contato: string;
  prazoEntrega: number; // dias
  condicoesPagamento: string;
  ativo: boolean;
  observacoes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnidadeSaudeType {
  id: string;
  nome: string;
  tipo: 'UBS' | 'UPA' | 'HOSPITAL' | 'CENTRO_ESPECIALIZADO' | 'FARMACIA';
  codigo: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  responsavel: string;
  horarioFuncionamento: string;
  ativo: boolean;
  observacoes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFornecedorDTO {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  contato: string;
  prazoEntrega: number;
  condicoesPagamento: string;
  ativo: boolean;
  observacoes: string;
}

export interface CreateUnidadeSaudeDTO {
  nome: string;
  tipo: 'UBS' | 'UPA' | 'HOSPITAL' | 'CENTRO_ESPECIALIZADO' | 'FARMACIA';
  codigo: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  responsavel: string;
  horarioFuncionamento: string;
  ativo: boolean;
  observacoes: string;
}