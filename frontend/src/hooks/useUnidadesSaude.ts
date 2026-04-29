import { useState, useEffect } from 'react';
import api from '../services/api';
import { UnidadeSaudeType } from '../types';

export const useUnidadesSaude = () => {
  const [unidades, setUnidades] = useState<UnidadeSaudeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUnidades = async () => {
      try {
        const response = await api.get('/unidades-saude');
        setUnidades(response.data);
      } catch (error) {
        console.error('Erro ao carregar unidades:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarUnidades();
  }, []);

  const criarUnidade = async (data: any) => {
    const response = await api.post('/unidades-saude', data);
    setUnidades(prev => [...prev, response.data]);
    return response.data;
  };

  const atualizarUnidade = async (id: string, data: any) => {
    const response = await api.patch(`/unidades-saude/${id}`, data);
    setUnidades(prev => prev.map(u => u.id === id ? response.data : u));
    return response.data;
  };

  const deletarUnidade = async (id: string) => {
    await api.delete(`/unidades-saude/${id}`);
    setUnidades(prev => prev.filter(u => u.id !== id));
  };

  return {
    unidades,
    loading,
    criarUnidade,
    atualizarUnidade,
    deletarUnidade,
    recarregar: () => window.location.reload(),
  };
};