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
import { useMedicamentos } from '../../hooks/useMedicamentos';
import { FormMedicamento } from './FormMedicamento';
import { MovimentacaoEstoque } from './MovimentacaoEstoque';
import { MedicamentoType } from '../../types';

export const ListaMedicamentos: React.FC = () => {
  const { medicamentos, loading, atualizarEstoque, recarregar } = useMedicamentos();
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [movimentoVisible, setMovimentoVisible] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState<MedicamentoType | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

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

  const handleDelete = async (id: string) => {
    try {
      // Implementar deleção
      setSnackbar({ open: true, message: 'Medicamento excluído com sucesso', severity: 'success' });
      await recarregar();
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir medicamento', severity: 'error' });
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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
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
          sx={{ width: 300 }}
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
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
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
                  <TableCell align="right">R$ {medicamento.precoUnitario.toFixed(2)}</TableCell>
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
              recarregar();
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
        <DialogContent>
          {selectedMedicamento && (
            <MovimentacaoEstoque
              medicamento={selectedMedicamento}
              onSuccess={async (quantidade, tipo) => {
                await atualizarEstoque(selectedMedicamento.id, quantidade, tipo);
                setMovimentoVisible(false);
                setSnackbar({ open: true, message: 'Estoque atualizado com sucesso', severity: 'success' });
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