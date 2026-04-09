import { MedicamentoType, CreateMedicamentoDTO } from '../types';
import { MedicamentoRepository } from '../repositories/MedicamentoRepository';

export class MedicamentoController {
  private repository: MedicamentoRepository;

  constructor() {
    this.repository = new MedicamentoRepository();
  }

  async listarTodos(): Promise<MedicamentoType[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error('Erro ao listar medicamentos:', error);
      throw new Error('Não foi possível carregar os medicamentos');
    }
  }

  async buscarPorId(id: string): Promise<MedicamentoType | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error('Erro ao buscar medicamento:', error);
      throw new Error('Medicamento não encontrado');
    }
  }

  async criarMedicamento(data: CreateMedicamentoDTO): Promise<MedicamentoType> {
    try {
      this.validarDados(data);
      
      const novoMedicamento: MedicamentoType = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await this.repository.save(novoMedicamento);
      return novoMedicamento;
    } catch (error) {
      console.error('Erro ao criar medicamento:', error);
      throw error;
    }
  }

  async atualizarEstoque(id: string, quantidade: number, tipo: 'ENTRADA' | 'SAIDA'): Promise<MedicamentoType> {
    const medicamento = await this.repository.findById(id);
    if (!medicamento) throw new Error('Medicamento não encontrado');
    
    if (tipo === 'ENTRADA') {
      medicamento.quantidadeAtual += quantidade;
    } else {
      if (quantidade > medicamento.quantidadeAtual) {
        throw new Error(`Estoque insuficiente. Disponível: ${medicamento.quantidadeAtual}`);
      }
      medicamento.quantidadeAtual -= quantidade;
    }
    
    medicamento.updatedAt = new Date();
    await this.repository.update(medicamento);
    return medicamento;
  }

  async getAlertasEstoque(): Promise<{ criticos: MedicamentoType[]; baixos: MedicamentoType[] }> {
    const medicamentos = await this.repository.findAll();
    return {
      criticos: medicamentos.filter(m => m.quantidadeAtual <= m.quantidadeMinima * 0.5),
      baixos: medicamentos.filter(m => m.quantidadeAtual <= m.quantidadeMinima && m.quantidadeAtual > m.quantidadeMinima * 0.5)
    };
  }

  private validarDados(data: CreateMedicamentoDTO): void {
    if (!data.nome) throw new Error('Nome é obrigatório');
    if (!data.principioAtivo) throw new Error('Princípio ativo é obrigatório');
    if (data.precoUnitario <= 0) throw new Error('Preço deve ser maior que zero');
    if (data.quantidadeMinima < 0) throw new Error('Quantidade mínima inválida');
  }
}