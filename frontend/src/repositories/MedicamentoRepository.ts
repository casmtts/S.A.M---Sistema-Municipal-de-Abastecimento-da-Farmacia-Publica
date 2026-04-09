import { MedicamentoType } from '../types';

const mockMedicamentos: MedicamentoType[] = [
  {
    id: '1',
    nome: 'Paracetamol',
    principioAtivo: 'Paracetamol',
    concentracao: '500mg',
    formaFarmaceutica: 'Comprimido',
    codigoBarras: '7891234567890',
    lote: 'LOT001',
    validade: new Date('2025-12-31'),
    quantidadeAtual: 150,
    quantidadeMinima: 50,
    quantidadeMaxima: 500,
    precoUnitario: 0.50,
    fornecedorId: 'FOR001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    nome: 'Amoxicilina',
    principioAtivo: 'Amoxicilina',
    concentracao: '500mg',
    formaFarmaceutica: 'Cápsula',
    codigoBarras: '7891234567891',
    lote: 'LOT002',
    validade: new Date('2024-06-30'),
    quantidadeAtual: 30,
    quantidadeMinima: 100,
    quantidadeMaxima: 1000,
    precoUnitario: 1.20,
    fornecedorId: 'FOR002',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    nome: 'Ibuprofeno',
    principioAtivo: 'Ibuprofeno',
    concentracao: '400mg',
    formaFarmaceutica: 'Comprimido',
    codigoBarras: '7891234567892',
    lote: 'LOT003',
    validade: new Date('2025-03-15'),
    quantidadeAtual: 200,
    quantidadeMinima: 80,
    quantidadeMaxima: 600,
    precoUnitario: 0.80,
    fornecedorId: 'FOR001',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class MedicamentoRepository {
  async findAll(): Promise<MedicamentoType[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockMedicamentos];
  }

  async findById(id: string): Promise<MedicamentoType | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMedicamentos.find(m => m.id === id) || null;
  }

  async save(medicamento: MedicamentoType): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockMedicamentos.push(medicamento);
  }

  async update(medicamento: MedicamentoType): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMedicamentos.findIndex(m => m.id === medicamento.id);
    if (index !== -1) {
      mockMedicamentos[index] = medicamento;
    }
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMedicamentos.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMedicamentos.splice(index, 1);
    }
  }
}