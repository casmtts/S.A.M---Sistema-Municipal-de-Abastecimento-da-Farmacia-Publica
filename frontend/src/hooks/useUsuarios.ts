import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { UsuarioType, CreateUsuarioDTO } from '../types';

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const carregarUsuarios = useCallback(async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarUsuarios();
    }, [carregarUsuarios]);

    const criarUsuario = async (data: CreateUsuarioDTO) => {
        const response = await api.post('/usuarios', data);
        await carregarUsuarios();
        return response.data;
    };

    const atualizarUsuario = async (id: string, data: Partial<CreateUsuarioDTO>) => {
        const response = await api.patch(`/usuarios/${id}`, data);
        await carregarUsuarios();
        return response.data;
    };

    const deletarUsuario = async (id: string) => {
        await api.delete(`/usuarios/${id}`);
        await carregarUsuarios();
    };

    return {
        usuarios,
        loading,
        criarUsuario,
        atualizarUsuario,
        deletarUsuario,
        recarregar: carregarUsuarios,
    };
};