// src/hooks/useFornecedores.ts
import { useState, useEffect, useCallback } from 'react';
import { FornecedorType, CreateFornecedorDTO } from '../types';

// Mock data
const mockFornecedores: FornecedorType[] = [
  {
    id: '1',
    nome: 'Medicorp',
    razaoSocial: 'Medicorp Distribuidora Ltda',
    cnpj: '12.345.678/0001-90',
    inscricaoEstadual: '123.456.789',
    endereco: 'Av. Paulista',
    numero: '1000',
    complemento: 'Conj 101',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01310-100',
    telefone: '(11) 3456-7890',
    email: 'contato@medicorp.com.br',
    contato: 'João Silva',
    prazoEntrega: 7,
    condicoesPagamento: '30 dias',
    ativo: true,
    observacoes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    nome: 'Farmadist',
    razaoSocial: 'Farmadist Distribuidora S/A',
    cnpj: '98.765.432/0001-10',
    inscricaoEstadual: '987.654.321',
    endereco: 'Rua Augusta',
    numero: '500',
    complemento: '',
    bairro: 'Consolação',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01305-000',
    telefone: '(11) 9876-5432',
    email: 'vendas@farmadist.com.br',
    contato: 'Maria Santos',
    prazoEntrega: 5,
    condicoesPagamento: '14 dias',
    ativo: true,
    observacoes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useFornecedores = () => {
  const [fornecedores, setFornecedores] = useState<FornecedorType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFornecedores(mockFornecedores);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const criarFornecedor = async (data: CreateFornecedorDTO): Promise<FornecedorType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novoFornecedor: FornecedorType = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setFornecedores(prev => [...prev, novoFornecedor]);
        resolve(novoFornecedor);
      }, 500);
    });
  };

  const atualizarFornecedor = async (id: string, data: Partial<CreateFornecedorDTO>): Promise<FornecedorType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setFornecedores(prev => prev.map(f => {
          if (f.id !== id) return f;
          const updated = { ...f, ...data, updatedAt: new Date() };
          resolve(updated);
          return updated;
        }));
      }, 500);
    });
  };

  const deletarFornecedor = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setFornecedores(prev => prev.filter(f => f.id !== id));
        resolve();
      }, 500);
    });
  };

  return {
    fornecedores,
    loading,
    criarFornecedor,
    atualizarFornecedor,
    deletarFornecedor,
    recarregar: () => setFornecedores(mockFornecedores),
  };
};