import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  DialogActions,
} from '@mui/material';
import { MedicamentoType, CreateMedicamentoDTO } from '../../types';
import { useMedicamentos } from '../../hooks/useMedicamentos';

const styles = {
  form: {
    mt: 2,
  },
  alert: {
    mb: 2,
  },
  dialogActions: {
    mt: 3,
    px: 0,
  },
};

interface FormMedicamentoProps {
  medicamento?: MedicamentoType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormMedicamento: React.FC<FormMedicamentoProps> = ({ medicamento, onSuccess, onCancel }) => {
  const { criarMedicamento } = useMedicamentos();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateMedicamentoDTO>({
    nome: medicamento?.nome || '',
    principioAtivo: medicamento?.principioAtivo || '',
    concentracao: medicamento?.concentracao || '',
    formaFarmaceutica: medicamento?.formaFarmaceutica || '',
    codigoBarras: medicamento?.codigoBarras || '',
    lote: medicamento?.lote || '',
    validade: medicamento?.validade || new Date(),
    quantidadeAtual: medicamento?.quantidadeAtual || 0,
    quantidadeMinima: medicamento?.quantidadeMinima || 0,
    quantidadeMaxima: medicamento?.quantidadeMaxima || 1000,
    precoUnitario: medicamento?.precoUnitario || 0,
    fornecedorId: medicamento?.fornecedorId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await criarMedicamento(formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar medicamento');
    } finally {
      setLoading(false);
    }
  };

  // Formatar data para o input date (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
      {error && (
        <Alert severity="error" sx={styles.alert}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nome do Medicamento"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Princípio Ativo"
            name="principioAtivo"
            value={formData.principioAtivo}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Concentração"
            name="concentracao"
            value={formData.concentracao}
            onChange={handleChange}
            placeholder="Ex: 500mg"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Forma Farmacêutica"
            name="formaFarmaceutica"
            value={formData.formaFarmaceutica}
            onChange={handleChange}
            placeholder="Ex: Comprimido"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Código de Barras"
            name="codigoBarras"
            value={formData.codigoBarras}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Lote"
            name="lote"
            value={formData.lote}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Data de Validade"
            name="validade"
            value={formatDateForInput(formData.validade)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setFormData(prev => ({ ...prev, validade: newDate }));
            }}
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Quantidade Inicial"
            value={formData.quantidadeAtual}
            onChange={(e) => handleNumberChange('quantidadeAtual', e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Quantidade Mínima"
            value={formData.quantidadeMinima}
            onChange={(e) => handleNumberChange('quantidadeMinima', e.target.value)}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Quantidade Máxima"
            value={formData.quantidadeMaxima}
            onChange={(e) => handleNumberChange('quantidadeMaxima', e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Preço Unitário"
            value={formData.precoUnitario}
            onChange={(e) => handleNumberChange('precoUnitario', e.target.value)}
            required
            inputProps={{ step: 0.01, min: 0 }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="ID do Fornecedor"
            name="fornecedorId"
            value={formData.fornecedorId}
            onChange={handleChange}
            size="small"
          />
        </Grid>
      </Grid>

      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (medicamento ? 'Atualizar' : 'Cadastrar')}
        </Button>
      </DialogActions>
    </Box>
  );
};