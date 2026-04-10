import { useState, useEffect } from 'react';
import { UnidadeSaudeType, CreateUnidadeSaudeDTO } from '../types';

// Mock data
const mockUnidades: UnidadeSaudeType[] = [
  {
    id: '1',
    nome: 'UBS Jardim Paulista',
    tipo: 'UBS',
    codigo: 'UBS001',
    endereco: 'Rua dos Jardins',
    numero: '100',
    complemento: '',
    bairro: 'Jardim Paulista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01400-000',
    telefone: '(11) 3456-7890',
    email: 'ubs.jardins@saude.gov.br',
    responsavel: 'Dra. Ana Paula',
    horarioFuncionamento: '07:00 - 19:00',
    ativo: true,
    observacoes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    nome: 'UPA Vila Mariana',
    tipo: 'UPA',
    codigo: 'UPA002',
    endereco: 'Av. Domingos de Morais',
    numero: '2000',
    complemento: '',
    bairro: 'Vila Mariana',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04000-000',
    telefone: '(11) 9876-5432',
    email: 'upa.vmariana@saude.gov.br',
    responsavel: 'Dr. Carlos Alberto',
    horarioFuncionamento: '24 horas',
    ativo: true,
    observacoes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useUnidadesSaude = () => {
  const [unidades, setUnidades] = useState<UnidadeSaudeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUnidades(mockUnidades);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const criarUnidade = async (data: CreateUnidadeSaudeDTO): Promise<UnidadeSaudeType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novaUnidade: UnidadeSaudeType = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUnidades(prev => [...prev, novaUnidade]);
        resolve(novaUnidade);
      }, 500);
    });
  };

  const atualizarUnidade = async (id: string, data: Partial<CreateUnidadeSaudeDTO>): Promise<UnidadeSaudeType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUnidades(prev => prev.map(u => {
          if (u.id !== id) return u;
          const updated = { ...u, ...data, updatedAt: new Date() };
          resolve(updated);
          return updated;
        }));
      }, 500);
    });
  };

  const deletarUnidade = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUnidades(prev => prev.filter(u => u.id !== id));
        resolve();
      }, 500);
    });
  };

  return {
    unidades,
    loading,
    criarUnidade,
    atualizarUnidade,
    deletarUnidade,
    recarregar: () => setUnidades(mockUnidades),
  };
};