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
  DialogActions,
  Alert,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { FormMedicamento } from './FormMedicamento';
import { MovimentacaoEstoque } from './MovimentacaoEstoque';
import { MedicamentoType } from '../../types';
import api from '../../services/api';

// Estilos em objeto (não inline)
const styles = {
  header: {
    mb: 2,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    flexWrap: 'wrap' as const,
  },
  searchField: {
    width: 300,
  },
  tableHeader: {
    bgcolor: '#f5f5f5',
  },
  dialogContent: {
    mt: 2,
  },
};

export const ListaMedicamentos: React.FC = () => {
  const [medicamentos, setMedicamentos] = useState<MedicamentoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [movimentoVisible, setMovimentoVisible] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState<MedicamentoType | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Carregar medicamentos da API
  const carregarMedicamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/medicamentos');
      setMedicamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar medicamentos', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const getStatusColor = (medicamento: MedicamentoType): 'error' | 'warning' | 'success' | 'info' => {
    const isCritico = medicamento.quantidadeAtual <= medicamento.quantidadeMinima * 0.5;
    const isBaixo = medicamento.quantidadeAtual <= medicamento.quantidadeMinima;
    const isExcedente = medicamento.quantidadeAtual >= medicamento.quantidadeMaxima;

    if (isCritico) return 'error';
    if (isBaixo) return 'warning';
    if (isExcedente) return 'info';
    return 'success';
  };

  const getStatusLabel = (medicamento: MedicamentoType): string => {
    const isCritico = medicamento.quantidadeAtual <= medicamento.quantidadeMinima * 0.5;
    const isBaixo = medicamento.quantidadeAtual <= medicamento.quantidadeMinima;
    const isExcedente = medicamento.quantidadeAtual >= medicamento.quantidadeMaxima;

    if (isCritico) return 'Crítico';
    if (isBaixo) return 'Baixo';
    if (isExcedente) return 'Excedente';
    return 'Normal';
  };

  const formatarPreco = (preco: number): string => {
    return preco.toFixed(2).replace('.', ',');
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/medicamentos/${id}`);
      setSnackbar({ open: true, message: 'Medicamento excluído com sucesso', severity: 'success' });
      await carregarMedicamentos();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir medicamento';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  const handleUpdateEstoque = async (id: string, quantidade: number, tipo: 'ENTRADA' | 'SAIDA') => {
    try {
      await api.patch(`/medicamentos/${id}/estoque`, { quantidade, tipo });
      setSnackbar({ open: true, message: 'Estoque atualizado com sucesso', severity: 'success' });
      await carregarMedicamentos();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar estoque';
      setSnackbar({ open: true, message, severity: 'error' });
      throw error;
    }
  };

  const filteredMedicamentos = medicamentos.filter((m) =>
    m.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    m.principioAtivo.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Header com busca e botão novo */}
      <Box sx={styles.header}>
        <TextField
          size="small"
          placeholder="Buscar por nome ou princípio ativo"
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
            setSelectedMedicamento(null);
            setModalVisible(true);
          }}
        >
          Novo Medicamento
        </Button>
      </Box>

      {/* Tabela de medicamentos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={styles.tableHeader}>
              <TableCell>Medicamento</TableCell>
              <TableCell>Princípio Ativo</TableCell>
              <TableCell align="right">Estoque</TableCell>
              <TableCell align="right">Mínimo</TableCell>
              <TableCell align="right">Preço Unit.</TableCell>
              <TableCell>Validade</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredMedicamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Nenhum medicamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicamentos.map((medicamento) => (
                <TableRow key={medicamento.id} hover>
                  <TableCell>{medicamento.nome}</TableCell>
                  <TableCell>{medicamento.principioAtivo}</TableCell>
                  <TableCell align="right">
                    <Typography component="span" fontWeight="bold">
                      {medicamento.quantidadeAtual}
                    </Typography> un.
                  </TableCell>
                  <TableCell align="right">{medicamento.quantidadeMinima} un.</TableCell>
                  <TableCell align="right">R$ {formatarPreco(medicamento.precoUnitario)}</TableCell>
                  <TableCell>{new Date(medicamento.validade).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getStatusLabel(medicamento)}
                      color={getStatusColor(medicamento)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSelectedMedicamento(medicamento);
                        setModalVisible(true);
                      }}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="default"
                      onClick={() => {
                        setSelectedMedicamento(medicamento);
                        setMovimentoVisible(true);
                      }}
                      title="Movimentar"
                    >
                      <InventoryIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(medicamento.id)}
                      title="Excluir"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Formulário */}
      <Dialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedMedicamento ? 'Editar Medicamento' : 'Novo Medicamento'}
        </DialogTitle>
        <DialogContent>
          <FormMedicamento
            medicamento={selectedMedicamento}
            onSuccess={() => {
              setModalVisible(false);
              carregarMedicamentos();
            }}
            onCancel={() => setModalVisible(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Movimentação */}
      <Dialog
        open={movimentoVisible}
        onClose={() => setMovimentoVisible(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Movimentar Estoque</DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          {selectedMedicamento && (
            <MovimentacaoEstoque
              medicamento={selectedMedicamento}
              onSuccess={async (quantidade, tipo) => {
                await handleUpdateEstoque(selectedMedicamento.id, quantidade, tipo);
                setMovimentoVisible(false);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMovimentoVisible(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};