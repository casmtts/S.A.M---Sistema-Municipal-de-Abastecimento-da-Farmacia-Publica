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

const styles = {
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
    <Box>
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

      <ToggleButtonGroup value={tipo} exclusive onChange={handleTipoChange} sx={styles.toggleGroup}>
        <ToggleButton value="ENTRADA" sx={styles.toggleButtonEntrada}>
          <AddIcon sx={{ mr: 1 }} />
          Entrada
        </ToggleButton>
        <ToggleButton value="SAIDA" sx={styles.toggleButtonSaida}>
          <RemoveIcon sx={{ mr: 1 }} />
          Saída
        </ToggleButton>
      </ToggleButtonGroup>

      {error && <Alert severity="error" sx={styles.alert}>{error}</Alert>}

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
        helperText={tipo === 'SAIDA' ? `Máximo: ${medicamento.quantidadeAtual} unidades` : ''}
        sx={styles.textField}
      />

      <Button onClick={handleSubmit} variant="contained" color={tipo === 'ENTRADA' ? 'success' : 'warning'} fullWidth size="large" sx={styles.button}>
        Confirmar {tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
      </Button>
    </Box>
  );
};