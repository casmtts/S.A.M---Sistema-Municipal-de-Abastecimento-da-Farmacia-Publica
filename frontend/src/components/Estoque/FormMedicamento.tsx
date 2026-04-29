import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { MedicamentoType } from '../../types';
import api from '../../services/api';

const tiposUnidade = [
  { value: 'Comprimido', label: 'Comprimido' },
  { value: 'Cápsula', label: 'Cápsula' },
  { value: 'Solução', label: 'Solução' },
  { value: 'Suspensão', label: 'Suspensão' },
  { value: 'Pomada', label: 'Pomada' },
  { value: 'Injetável', label: 'Injetável' },
];

interface FormMedicamentoProps {
  medicamento?: MedicamentoType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormMedicamento: React.FC<FormMedicamentoProps> = ({ medicamento, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: medicamento?.nome || '',
    principioAtivo: medicamento?.principioAtivo || '',
    concentracao: medicamento?.concentracao || '',
    formaFarmaceutica: medicamento?.formaFarmaceutica || '',
    codigoBarras: medicamento?.codigoBarras || '',
    lote: medicamento?.lote || '',
    validade: medicamento?.validade ? new Date(medicamento.validade).toISOString().split('T')[0] : '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        validade: new Date(formData.validade),
        quantidadeAtual: Number(formData.quantidadeAtual),
        quantidadeMinima: Number(formData.quantidadeMinima),
        quantidadeMaxima: Number(formData.quantidadeMaxima),
        precoUnitario: Number(formData.precoUnitario),
      };

      if (medicamento) {
        await api.patch(`/medicamentos/${medicamento.id}`, dataToSend);
      } else {
        await api.post('/medicamentos', dataToSend);
      }
      onSuccess();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao salvar medicamento';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Nome do Medicamento" name="nome" value={formData.nome} onChange={handleChange} required size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Princípio Ativo" name="principioAtivo" value={formData.principioAtivo} onChange={handleChange} required size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Concentração" name="concentracao" value={formData.concentracao} onChange={handleChange} placeholder="Ex: 500mg" size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth select label="Forma Farmacêutica" name="formaFarmaceutica" value={formData.formaFarmaceutica} onChange={handleChange} size="small">
            {tiposUnidade.map(t => (<MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Código de Barras" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Lote" name="lote" value={formData.lote} onChange={handleChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="date" label="Data de Validade" name="validade" value={formData.validade} onChange={handleChange} InputLabelProps={{ shrink: true }} required size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="number" label="Quantidade Inicial" name="quantidadeAtual" value={formData.quantidadeAtual} onChange={handleChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="number" label="Quantidade Mínima" name="quantidadeMinima" value={formData.quantidadeMinima} onChange={handleChange} required size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="number" label="Quantidade Máxima" name="quantidadeMaxima" value={formData.quantidadeMaxima} onChange={handleChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="number" label="Preço Unitário" name="precoUnitario" value={formData.precoUnitario} onChange={handleChange} required inputProps={{ step: 0.01, min: 0 }} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="ID do Fornecedor" name="fornecedorId" value={formData.fornecedorId} onChange={handleChange} size="small" />
        </Grid>
      </Grid>
      <DialogActions sx={{ mt: 3, px: 0 }}>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (medicamento ? 'Atualizar' : 'Cadastrar')}
        </Button>
      </DialogActions>
    </Box>
  );
};