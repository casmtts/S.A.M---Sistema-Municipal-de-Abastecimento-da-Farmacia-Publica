import React, { useState } from 'react';
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
    Snackbar,
    Tooltip,
    Typography,
    Collapse,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useUsuarios } from '../../hooks/useUsuarios';
import { FormUsuario } from './FormUsuario';
import { UsuarioType, roleLabels, roleColors } from '../../types';

const styles = {
    header: {
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
        gap: 2,
    },
    searchField: {
        width: 300,
    },
    tableHeader: {
        bgcolor: '#f5f5f5',
    },
    alertContainer: {
        mb: 2,
    },
    alertMessage: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};

export const ListaUsuarios: React.FC = () => {
    const { usuarios, loading, deletarUsuario, atualizarUsuario, recarregar } = useUsuarios();
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<UsuarioType | null>(null);
    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const filteredUsuarios = usuarios.filter(u =>
        u.nome.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase()) ||
        u.cpf.includes(searchText)
    );

    const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setAlert({ open: true, message, severity });
        // Auto fechar após 5 segundos
        setTimeout(() => {
            setAlert(prev => ({ ...prev, open: false }));
        }, 5000);
    };

    const handleDelete = async (id: string, nome: string) => {
        try {
            await deletarUsuario(id);
            showAlert(`✅ Usuário ${nome} excluído com sucesso!`, 'success');
            recarregar();
        } catch {
            showAlert('❌ Erro ao excluir usuário', 'error');
        }
    };

    const handleToggleStatus = async (usuario: UsuarioType) => {
        try {
            await atualizarUsuario(usuario.id, { ativo: !usuario.ativo });
            showAlert(
                `✅ Usuário ${usuario.nome} ${!usuario.ativo ? 'ativado' : 'desativado'} com sucesso!`,
                'success'
            );
            recarregar();
        } catch {
            showAlert('❌ Erro ao alterar status do usuário', 'error');
        }
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    return (
        <Box>
            {/* ALERTA NA PARTE SUPERIOR */}
            <Collapse in={alert.open}>
                <Alert
                    severity={alert.severity}
                    sx={styles.alertContainer}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleCloseAlert}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {alert.message}
                </Alert>
            </Collapse>

            <Box sx={styles.header}>
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
                    sx={styles.searchField}
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
                        <TableRow sx={styles.tableHeader}>
                            <TableCell>Usuário</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>CPF</TableCell>
                            <TableCell>Cargo</TableCell>
                            <TableCell>Perfil</TableCell>
                            <TableCell>Último Acesso</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Box sx={{ py: 3 }}>
                                        <Typography>Carregando usuários...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsuarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Box sx={{ py: 3 }}>
                                        <Typography color="textSecondary">Nenhum usuário encontrado</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsuarios.map((usuario) => (
                                <TableRow key={usuario.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {usuario.nome}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>{usuario.cpf}</TableCell>
                                    <TableCell>{usuario.cargo || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={roleLabels[usuario.role]}
                                            color={roleColors[usuario.role]}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {usuario.ultimoAcesso
                                            ? new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')
                                            : 'Nunca acessou'}
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
                <DialogTitle>{selectedUsuario ? '✏️ Editar Usuário' : '➕ Novo Usuário'}</DialogTitle>
                <DialogContent>
                    <FormUsuario
                        usuario={selectedUsuario}
                        onSuccess={() => {
                            setModalVisible(false);
                            recarregar();
                            showAlert('✅ Usuário salvo com sucesso!', 'success');
                        }}
                        onCancel={() => setModalVisible(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};