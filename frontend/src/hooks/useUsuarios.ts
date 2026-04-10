// src/hooks/useUsuarios.ts
import { useState, useEffect, useCallback } from 'react';
import { UsuarioType, CreateUsuarioDTO, UserRole } from '../types';

// Mock data
const mockUsuarios: UsuarioType[] = [
  {
    id: '1',
    nome: 'Admin Sistema',
    email: 'admin@saude.gov.br',
    cpf: '111.111.111-11',
    role: 'ADMIN',
    ativo: true,
    telefone: '(11) 99999-9999',
    cargo: 'Administrador',
    unidadeId: '1',
    ultimoAcesso: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    nome: 'João Silva',
    email: 'joao@saude.gov.br',
    cpf: '222.222.222-22',
    role: 'GESTOR',
    ativo: true,
    telefone: '(11) 98888-8888',
    cargo: 'Gestor de Estoque',
    unidadeId: '1',
    ultimoAcesso: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    nome: 'Maria Santos',
    email: 'maria@saude.gov.br',
    cpf: '333.333.333-33',
    role: 'FARMACEUTICO',
    ativo: true,
    telefone: '(11) 97777-7777',
    cargo: 'Farmacêutica',
    unidadeId: '2',
    ultimoAcesso: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UsuarioType | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsuarios(mockUsuarios);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const criarUsuario = useCallback(async (data: CreateUsuarioDTO): Promise<UsuarioType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novoUsuario: UsuarioType = {
          id: crypto.randomUUID(),
          nome: data.nome,
          email: data.email,
          cpf: data.cpf,
          role: data.role,
          ativo: data.ativo,
          telefone: data.telefone,
          cargo: data.cargo,
          unidadeId: data.unidadeId,
          ultimoAcesso: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUsuarios(prev => [...prev, novoUsuario]);
        resolve(novoUsuario);
      }, 500);
    });
  }, []);

  const atualizarUsuario = useCallback(async (id: string, data: Partial<CreateUsuarioDTO>): Promise<UsuarioType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsuarios(prev => prev.map(u => {
          if (u.id !== id) return u;
          const updated = { ...u, ...data, updatedAt: new Date() };
          resolve(updated);
          return updated;
        }));
      }, 500);
    });
  }, []);

  const deletarUsuario = useCallback(async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsuarios(prev => prev.filter(u => u.id !== id));
        resolve();
      }, 500);
    });
  }, []);

  const login = useCallback(async (email: string, senha: string): Promise<UsuarioType | null> => {
    // Simular login (apenas para demonstração)
    const user = mockUsuarios.find(u => u.email === email);
    if (user && senha === '123456') {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  }, []);

  const getCurrentUser = useCallback((): UsuarioType | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }, []);

  return {
    usuarios,
    loading,
    currentUser,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    login,
    logout,
    getCurrentUser,
    recarregar: () => setUsuarios(mockUsuarios),
  };
};