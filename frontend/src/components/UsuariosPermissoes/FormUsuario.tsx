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
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useUsuarios } from '../../hooks/useUsuarios';
import { useUnidadesSaude } from '../../hooks/useUnidadesSaude';
import { UsuarioType, CreateUsuarioDTO, UserRole, roleLabels } from '../../types';

const roles: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'GESTOR', label: 'Gestor' },
  { value: 'FARMACEUTICO', label: 'Farmacêutico' },
  { value: 'ATENDENTE', label: 'Atendente' },
  { value: 'CONSULTOR', label: 'Consultor' },
];

interface FormUsuarioProps {
  usuario?: UsuarioType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormUsuario: React.FC<FormUsuarioProps> = ({ usuario, onSuccess, onCancel }) => {
  const { criarUsuario, atualizarUsuario } = useUsuarios();
  const { unidades } = useUnidadesSaude();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateUsuarioDTO>({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    cpf: usuario?.cpf || '',
    role: usuario?.role || 'ATENDENTE',
    senha: '',
    telefone: usuario?.telefone || '',
    cargo: usuario?.cargo || '',
    unidadeId: usuario?.unidadeId || '',
    ativo: usuario?.ativo ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Correção: Tipagem correta para Select
  const handleRoleChange = (e: SelectChangeEvent<UserRole>) => {
    setFormData(prev => ({ ...prev, role: e.target.value as UserRole }));
  };

  // ✅ Correção: Tipagem correta para Select de unidade
  const handleUnidadeChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, unidadeId: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar senha apenas para novo usuário
    if (!usuario && !formData.senha) {
      setError('Senha é obrigatória para novo usuário');
      setLoading(false);
      return;
    }

    if (!usuario && formData.senha.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      if (usuario) {
        await atualizarUsuario(usuario.id, formData);
      } else {
        await criarUsuario(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nome Completo"
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cargo/Função"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Perfil de Acesso</InputLabel>
            <Select
              value={formData.role}
              onChange={handleRoleChange}
              label="Perfil de Acesso"
              required
            >
              {roles.map(role => (
                <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Unidade de Saúde</InputLabel>
            <Select
              value={formData.unidadeId}
              onChange={handleUnidadeChange}
              label="Unidade de Saúde"
            >
              <MenuItem value="">Selecione uma unidade</MenuItem>
              {unidades.map(unidade => (
                <MenuItem key={unidade.id} value={unidade.id}>{unidade.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {!usuario && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="password"
              label="Senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              size="small"
              helperText="Mínimo 6 caracteres"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
              />
            }
            label="Usuário Ativo"
          />
        </Grid>
      </Grid>

      <DialogActions sx={{ mt: 3, px: 0 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (usuario ? 'Atualizar' : 'Cadastrar')}
        </Button>
      </DialogActions>
    </Box>
  );
};