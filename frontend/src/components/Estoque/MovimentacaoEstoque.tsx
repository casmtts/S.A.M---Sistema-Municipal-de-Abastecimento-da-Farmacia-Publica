import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { MedicamentoType } from '../../types';

// Estilos em objeto (não inline)
const styles = {
  container: {
    width: '100%',
  },
  infoPaper: {
    p: 2,
    mb: 3,
    bgcolor: '#f5f5f5',
    borderRadius: 2,
  },
  toggleGroup: {
    mb: 3,
    width: '100%',
  },
  toggleButtonEntrada: {
    flex: 1,
    py: 1,
    '&.Mui-selected': {
      bgcolor: '#2e7d32',
      color: 'white',
      '&:hover': {
        bgcolor: '#1b5e20',
      },
    },
  },
  toggleButtonSaida: {
    flex: 1,
    py: 1,
    '&.Mui-selected': {
      bgcolor: '#d32f2f',
      color: 'white',
      '&:hover': {
        bgcolor: '#c62828',
      },
    },
  },
  alert: {
    mb: 3,
  },
  textField: {
    mb: 3,
  },
  button: {
    py: 1.5,
    fontWeight: 'bold',
  },
};

interface MovimentacaoEstoqueProps {
  medicamento: MedicamentoType;
  onSuccess: (quantidade: number, tipo: 'ENTRADA' | 'SAIDA') => void;
}

export const MovimentacaoEstoque: React.FC<MovimentacaoEstoqueProps> = ({ medicamento, onSuccess }) => {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleTipoChange = (_event: React.MouseEvent<HTMLElement>, newTipo: 'ENTRADA' | 'SAIDA' | null) => {
    if (newTipo !== null) {
      setTipo(newTipo);
      setError('');
    }
  };

  const handleSubmit = () => {
    if (quantidade <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    if (tipo === 'SAIDA' && quantidade > medicamento.quantidadeAtual) {
      setError(`Estoque insuficiente. Disponível: ${medicamento.quantidadeAtual} unidades`);
      return;
    }

    setError('');
    onSuccess(quantidade, tipo);
  };

  return (
    <Box sx={styles.container}>
      {/* Informações do medicamento */}
      <Paper sx={styles.infoPaper} elevation={0}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Medicamento
        </Typography>
        <Typography variant="h6" gutterBottom>
          {medicamento.nome}
        </Typography>
        <Typography variant="body2">
          <strong>Estoque atual:</strong> {medicamento.quantidadeAtual} unidades
        </Typography>
        <Typography variant="body2">
          <strong>Estoque mínimo:</strong> {medicamento.quantidadeMinima} unidades
        </Typography>
      </Paper>

      {/* Toggle buttons para Entrada/Saída */}
      <ToggleButtonGroup
        value={tipo}
        exclusive
        onChange={handleTipoChange}
        aria-label="tipo de movimentação"
        sx={styles.toggleGroup}
      >
        <ToggleButton value="ENTRADA" aria-label="entrada" sx={styles.toggleButtonEntrada}>
          <AddIcon sx={{ mr: 1 }} />
          Entrada
        </ToggleButton>
        <ToggleButton value="SAIDA" aria-label="saída" sx={styles.toggleButtonSaida}>
          <RemoveIcon sx={{ mr: 1 }} />
          Saída
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={styles.alert}>
          {error}
        </Alert>
      )}

      {/* Campo de quantidade */}
      <TextField
        fullWidth
        type="number"
        label="Quantidade"
        value={quantidade}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          setQuantidade(isNaN(value) ? 1 : Math.max(1, value));
          setError('');
        }}
        inputProps={{ min: 1 }}
        helperText={
          tipo === 'SAIDA'
            ? `Máximo disponível: ${medicamento.quantidadeAtual} unidades`
            : 'Digite a quantidade que deseja adicionar'
        }
        sx={styles.textField}
      />

      {/* Botão de confirmação */}
      <Button
        onClick={handleSubmit}
        variant="contained"
        color={tipo === 'ENTRADA' ? 'success' : 'warning'}
        fullWidth
        size="large"
        sx={styles.button}
      >
        Confirmar {tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
      </Button>
    </Box>
  );
};