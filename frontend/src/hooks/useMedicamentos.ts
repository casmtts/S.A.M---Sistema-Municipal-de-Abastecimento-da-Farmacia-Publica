import { useState, useEffect, useCallback } from 'react';
import { MedicamentoController } from '../controllers/MedicamentoController';
import { MedicamentoType } from '../types';

const medicamentoController = new MedicamentoController();

export const useMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState<MedicamentoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarMedicamentos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await medicamentoController.listarTodos();
      setMedicamentos(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar medicamentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const criarMedicamento = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const novoMedicamento = await medicamentoController.criarMedicamento(data);
      await carregarMedicamentos();
      return novoMedicamento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar medicamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [carregarMedicamentos]);

  const atualizarEstoque = useCallback(async (id: string, quantidade: number, tipo: 'ENTRADA' | 'SAIDA') => {
    try {
      setLoading(true);
      const atualizado = await medicamentoController.atualizarEstoque(id, quantidade, tipo);
      await carregarMedicamentos();
      return atualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar estoque');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [carregarMedicamentos]);

  const getAlertas = useCallback(async () => {
    try {
      return await medicamentoController.getAlertasEstoque();
    } catch (err) {
      console.error('Erro ao buscar alertas:', err);
      return { criticos: [], baixos: [] };
    }
  }, []);

  useEffect(() => {
    carregarMedicamentos();
  }, [carregarMedicamentos]);

  return {
    medicamentos,
    loading,
    error,
    criarMedicamento,
    atualizarEstoque,
    getAlertas,
    recarregar: carregarMedicamentos
  };
};