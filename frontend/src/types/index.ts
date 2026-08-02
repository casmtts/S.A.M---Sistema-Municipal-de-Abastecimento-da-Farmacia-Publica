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

export type UserRole = 'ADMIN' | 'GESTOR' | 'FARMACEUTICO' | 'ATENDENTE' | 'CONSULTOR';

export interface Permissao {
  id: string;
  nome: string;
  descricao: string;
  modulo: 'DASHBOARD' | 'ESTOQUE' | 'PEDIDOS' | 'CADASTROS' | 'RELATORIOS' | 'USUARIOS' | 'VALIDADE';
  acao: 'CRIAR' | 'LER' | 'ATUALIZAR' | 'DELETAR' | 'APROVAR';
}

export interface UsuarioType {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  role: UserRole;
  ativo: boolean;
  telefone: string;
  cargo: string;
  unidadeId: string;
  ultimoAcesso: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  cpf: string;
  role: UserRole;
  senha: string;
  telefone: string;
  cargo: string;
  unidadeId: string;
  ativo: boolean;
}

export interface UpdateUsuarioDTO extends Partial<CreateUsuarioDTO> {
  id: string;
}

export const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: [
    'DASHBOARD_CRIAR', 'DASHBOARD_LER', 'DASHBOARD_ATUALIZAR', 'DASHBOARD_DELETAR',
    'ESTOQUE_CRIAR', 'ESTOQUE_LER', 'ESTOQUE_ATUALIZAR', 'ESTOQUE_DELETAR',
    'PEDIDOS_CRIAR', 'PEDIDOS_LER', 'PEDIDOS_ATUALIZAR', 'PEDIDOS_DELETAR', 'PEDIDOS_APROVAR',
    'CADASTROS_CRIAR', 'CADASTROS_LER', 'CADASTROS_ATUALIZAR', 'CADASTROS_DELETAR',
    'RELATORIOS_CRIAR', 'RELATORIOS_LER', 'RELATORIOS_ATUALIZAR', 'RELATORIOS_DELETAR',
    'USUARIOS_CRIAR', 'USUARIOS_LER', 'USUARIOS_ATUALIZAR', 'USUARIOS_DELETAR',
    'VALIDADE_CRIAR', 'VALIDADE_LER', 'VALIDADE_ATUALIZAR', 'VALIDADE_DELETAR'
  ],
  GESTOR: [
    'DASHBOARD_LER',
    'ESTOQUE_LER', 'ESTOQUE_ATUALIZAR',
    'PEDIDOS_LER', 'PEDIDOS_ATUALIZAR', 'PEDIDOS_APROVAR',
    'CADASTROS_LER',
    'RELATORIOS_LER',
    'VALIDADE_LER'
  ],
  FARMACEUTICO: [
    'DASHBOARD_LER',
    'ESTOQUE_CRIAR', 'ESTOQUE_LER', 'ESTOQUE_ATUALIZAR',
    'PEDIDOS_CRIAR', 'PEDIDOS_LER',
    'CADASTROS_LER',
    'RELATORIOS_LER',
    'VALIDADE_CRIAR', 'VALIDADE_LER', 'VALIDADE_ATUALIZAR'
  ],
  ATENDENTE: [
    'DASHBOARD_LER',
    'ESTOQUE_LER',
    'PEDIDOS_CRIAR',
    'RELATORIOS_LER',
    'VALIDADE_LER'
  ],
  CONSULTOR: [
    'DASHBOARD_LER',
    'RELATORIOS_LER'
  ]
};

export const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  FARMACEUTICO: 'Farmacêutico',
  ATENDENTE: 'Atendente',
  CONSULTOR: 'Consultor'
};

export const roleColors: Record<UserRole, 'error' | 'warning' | 'info' | 'success' | 'default'> = {
  ADMIN: 'error',
  GESTOR: 'warning',
  FARMACEUTICO: 'info',
  ATENDENTE: 'success',
  CONSULTOR: 'default'
};