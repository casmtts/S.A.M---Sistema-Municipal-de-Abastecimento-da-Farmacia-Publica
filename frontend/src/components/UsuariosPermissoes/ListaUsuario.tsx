import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { FormUsuario } from './FormUsuario';
import { UserRole } from '../../types';

// Mapeamento de labels e cores para os perfis
const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  FARMACEUTICO: 'Farmacêutico',
  ATENDENTE: 'Atendente',
  CONSULTOR: 'Consultor',
};

const roleColors: Record<UserRole, 'error' | 'warning' | 'info' | 'success' | 'default'> = {
  ADMIN: 'error',
  GESTOR: 'warning',
  FARMACEUTICO: 'info',
  ATENDENTE: 'success',
  CONSULTOR: 'default',
};

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  role: UserRole;
  ativo: boolean;
  telefone?: string;
  cargo?: string;
  unidadeId?: string;
  ultimoAcesso?: string;
}

export const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);

  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.role === 'ADMIN';

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar usuários', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      carregarUsuarios();
    }
  }, [isAdmin]);

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    u.email.toLowerCase().includes(searchText.toLowerCase()) ||
    u.cpf.includes(searchText)
  );

  const handleDelete = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${nome}?`)) return;
    
    try {
      await api.delete(`/usuarios/${id}`);
      setSnackbar({ open: true, message: `Usuário ${nome} excluído com sucesso`, severity: 'success' });
      carregarUsuarios();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir usuário';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  const handleToggleStatus = async (usuario: Usuario) => {
    try {
      await api.patch(`/usuarios/${usuario.id}/toggle`, { ativo: !usuario.ativo });
      setSnackbar({ open: true, message: `Usuário ${usuario.nome} ${!usuario.ativo ? 'ativado' : 'desativado'} com sucesso`, severity: 'success' });
      carregarUsuarios();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao alterar status';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const getRoleIcon = (role: UserRole) => {
    if (role === 'ADMIN') return <AdminIcon fontSize="small" />;
    return <PersonIcon fontSize="small" />;
  };

  if (!isAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Alert severity="warning">
          Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar usuários.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {snackbar && (
        <Alert 
          severity={snackbar.severity} 
          onClose={handleCloseSnackbar}
          sx={{ mb: 2 }}
        >
          {snackbar.message}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar por nome, email ou CPF..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedUsuario(null);
            setModalVisible(true);
          }}
        >
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Usuário</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Perfil</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : filteredUsuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRoleIcon(usuario.role)}
                      <Typography variant="body2" fontWeight="bold">
                        {usuario.nome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.cpf}</TableCell>
                  <TableCell>{usuario.cargo || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getRoleIcon(usuario.role)}
                      label={roleLabels[usuario.role]}
                      color={roleColors[usuario.role]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={usuario.ativo ? 'Ativo' : 'Inativo'}
                      color={usuario.ativo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedUsuario(usuario);
                          setModalVisible(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={usuario.ativo ? 'Desativar' : 'Ativar'}>
                      <IconButton
                        size="small"
                        color={usuario.ativo ? 'warning' : 'success'}
                        onClick={() => handleToggleStatus(usuario)}
                      >
                        {usuario.ativo ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(usuario.id, usuario.nome)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalVisible} onClose={() => setModalVisible(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedUsuario ? '✏️ Editar Usuário' : '➕ Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <FormUsuario
            usuario={selectedUsuario}
            onSuccess={() => {
              setModalVisible(false);
              carregarUsuarios();
              setSnackbar({ open: true, message: 'Usuário salvo com sucesso!', severity: 'success' });
            }}
            onCancel={() => setModalVisible(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ListaUsuarios;