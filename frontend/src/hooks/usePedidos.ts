import { useState, useEffect, useCallback } from 'react';
import { PedidoController } from '../controllers/PedidoController';
import { StatusPedidoValues } from '../models/PedidoModel';
import { PedidoType } from '../types';

const pedidoController = new PedidoController();

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pedidoController.listarPedidos();
      setPedidos(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const criarPedido = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const novoPedido = await pedidoController.criarPedido(data);
      await carregarPedidos();
      return novoPedido;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [carregarPedidos]);

  const aprovarPedido = useCallback(async (id: string, aprovadorId: string) => {
    try {
      setLoading(true);
      const aprovado = await pedidoController.aprovarPedido(id, aprovadorId);
      await carregarPedidos();
      return aprovado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aprovar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [carregarPedidos]);

  const pedidosAtrasados = pedidos.filter((p) => {
    if (p.status === StatusPedidoValues.ENTREGUE || p.status === StatusPedidoValues.CANCELADO) {
      return false;
    }
    return new Date() > new Date(p.dataPrevistaEntrega);
  });
  const pedidosPendentes = pedidos.filter(p => p.status === 'PENDENTE');

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  return {
    pedidos,
    pedidosAtrasados,
    pedidosPendentes,
    loading,
    error,
    criarPedido,
    aprovarPedido,
    recarregar: carregarPedidos
  };
};