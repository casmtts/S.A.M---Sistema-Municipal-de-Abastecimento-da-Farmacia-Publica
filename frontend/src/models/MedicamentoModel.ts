export class MedicamentoModel {
  public id: string;
  public nome: string;
  public principioAtivo: string;
  public concentracao: string;
  public formaFarmaceutica: string;
  public codigoBarras: string;
  public lote: string;
  public validade: Date;
  public quantidadeAtual: number;
  public quantidadeMinima: number;
  public quantidadeMaxima: number;
  public precoUnitario: number;
  public fornecedorId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    nome: string,
    principioAtivo: string,
    concentracao: string,
    formaFarmaceutica: string,
    codigoBarras: string,
    lote: string,
    validade: Date,
    quantidadeAtual: number,
    quantidadeMinima: number,
    quantidadeMaxima: number,
    precoUnitario: number,
    fornecedorId: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.nome = nome;
    this.principioAtivo = principioAtivo;
    this.concentracao = concentracao;
    this.formaFarmaceutica = formaFarmaceutica;
    this.codigoBarras = codigoBarras;
    this.lote = lote;
    this.validade = validade;
    this.quantidadeAtual = quantidadeAtual;
    this.quantidadeMinima = quantidadeMinima;
    this.quantidadeMaxima = quantidadeMaxima;
    this.precoUnitario = precoUnitario;
    this.fornecedorId = fornecedorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isEstoqueBaixo(): boolean {
    return this.quantidadeAtual <= this.quantidadeMinima;
  }

  isEstoqueCritico(): boolean {
    return this.quantidadeAtual <= this.quantidadeMinima * 0.5;
  }

  isVencido(): boolean {
    return new Date() > this.validade;
  }

  isProximoVencer(dias: number = 30): boolean {
    const hoje = new Date();
    const diffDias = Math.ceil((this.validade.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diffDias <= dias && diffDias > 0;
  }

  getStatusEstoque(): 'CRITICO' | 'BAIXO' | 'NORMAL' | 'EXCEDENTE' {
    if (this.isEstoqueCritico()) return 'CRITICO';
    if (this.isEstoqueBaixo()) return 'BAIXO';
    if (this.quantidadeAtual >= this.quantidadeMaxima) return 'EXCEDENTE';
    return 'NORMAL';
  }

  baixarEstoque(quantidade: number): void {
    if (quantidade <= 0) throw new Error('Quantidade deve ser maior que zero');
    if (quantidade > this.quantidadeAtual) throw new Error(`Estoque insuficiente. Disponível: ${this.quantidadeAtual}`);
    
    this.quantidadeAtual -= quantidade;
    this.updatedAt = new Date();
  }

  reporEstoque(quantidade: number): void {
    if (quantidade <= 0) throw new Error('Quantidade deve ser maior que zero');
    
    this.quantidadeAtual += quantidade;
    this.updatedAt = new Date();
  }
}