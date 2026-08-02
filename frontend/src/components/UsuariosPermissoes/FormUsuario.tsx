import React, { useState, useEffect } from 'react';
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
import api from '../../services/api';
import { UserRole } from '../../types';

const roles: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'GESTOR', label: 'Gestor' },
  { value: 'FARMACEUTICO', label: 'Farmacêutico' },
  { value: 'ATENDENTE', label: 'Atendente' },
  { value: 'CONSULTOR', label: 'Consultor' },
];

// ✅ Máscara de CPF: 000.000.000-00
const aplicarMascaraCPF = (valor: string): string => {
  if (!valor) return '';
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
  if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
};

// ✅ Máscara de Telefone: (00) 00000-0000
const aplicarMascaraTelefone = (valor: string): string => {
  if (!valor) return '';
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length === 0) return '';
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
};

// ✅ Remover máscara (enviar apenas números para API)
const removerMascara = (valor: string): string => {
  return valor.replace(/\D/g, '');
};

// Validações
const validarCPF = (cpf: string): boolean => {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(numeros.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;
  if (digito1 !== parseInt(numeros.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(numeros.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;
  return digito2 === parseInt(numeros.charAt(10));
};

const validarEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

interface FormUsuarioProps {
  usuario?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormUsuario: React.FC<FormUsuarioProps> = ({ usuario, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [unidades, setUnidades] = useState<any[]>([]);
  
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.role === 'ADMIN';
  
  // ✅ Formata CPF e Telefone com máscara quando carregar o usuário para edição
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    cpf: usuario?.cpf ? aplicarMascaraCPF(usuario.cpf) : '',
    role: usuario?.role || 'ATENDENTE',
    senha: '',
    telefone: usuario?.telefone ? aplicarMascaraTelefone(usuario.telefone) : '',
    cargo: usuario?.cargo || '',
    unidadeId: usuario?.unidadeId || '',
    ativo: usuario?.ativo ?? true,
  });

  useEffect(() => {
    const carregarUnidades = async () => {
      try {
        const response = await api.get('/unidades-saude');
        setUnidades(response.data);
      } catch (error) {
        console.error('Erro ao carregar unidades:', error);
      }
    };
    carregarUnidades();
  }, []);

  // ✅ Quando o usuário mudar (edição), atualizar o formulário com máscara
  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        cpf: usuario.cpf ? aplicarMascaraCPF(usuario.cpf) : '',
        role: usuario.role || 'ATENDENTE',
        senha: '',
        telefone: usuario.telefone ? aplicarMascaraTelefone(usuario.telefone) : '',
        cargo: usuario.cargo || '',
        unidadeId: usuario.unidadeId || '',
        ativo: usuario.ativo ?? true,
      });
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') setEmailError('');
  };

  // ✅ Manipulador do CPF com máscara
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mascara = aplicarMascaraCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: mascara }));
    
    const numeros = removerMascara(mascara);
    if (numeros.length === 11) {
      if (!validarCPF(mascara)) {
        setCpfError('CPF inválido');
      } else {
        setCpfError('');
      }
    } else if (numeros.length > 0 && numeros.length < 11) {
      setCpfError('CPF deve ter 11 dígitos');
    } else {
      setCpfError('');
    }
  };

  // ✅ Manipulador do Telefone com máscara
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mascara = aplicarMascaraTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: mascara }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    setEmailError(email && !validarEmail(email) ? 'E-mail inválido' : '');
  };

  const handleRoleChange = (e: SelectChangeEvent<UserRole>) => {
    setFormData(prev => ({ ...prev, role: e.target.value as UserRole }));
  };

  const handleUnidadeChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, unidadeId: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ✅ Validação do CPF
    const numerosCPF = removerMascara(formData.cpf);
    if (formData.cpf && numerosCPF.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      setLoading(false);
      return;
    }
    if (formData.cpf && !validarCPF(formData.cpf)) {
      setError('CPF inválido');
      setLoading(false);
      return;
    }

    try {
      const dadosParaEnviar: any = {
        nome: formData.nome,
        email: formData.email,
        cpf: removerMascara(formData.cpf), // ✅ Envia apenas números
        cargo: formData.cargo || null,
        unidadeId: formData.unidadeId || null,
        ativo: formData.ativo,
      };
      
      // ✅ Apenas ADMIN pode alterar o perfil
      if (isAdmin) {
        dadosParaEnviar.role = formData.role;
      }
      
      // ✅ Envia telefone sem máscara
      if (formData.telefone) {
        const numerosTelefone = removerMascara(formData.telefone);
        if (numerosTelefone) {
          dadosParaEnviar.telefone = numerosTelefone;
        }
      }
      
      if (usuario) {
        if (formData.senha && formData.senha.trim() !== '') {
          dadosParaEnviar.senha = formData.senha;
        }
        await api.patch(`/usuarios/${usuario.id}`, dadosParaEnviar);
      } else {
        if (!formData.senha) {
          setError('Senha é obrigatória');
          setLoading(false);
          return;
        }
        dadosParaEnviar.senha = formData.senha;
        if (isAdmin) {
          dadosParaEnviar.role = formData.role;
        } else {
          dadosParaEnviar.role = 'ATENDENTE';
        }
        await api.post('/usuarios', dadosParaEnviar);
      }
      
      onSuccess();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao salvar usuário';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {!isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Acesso limitado:</strong> Você não tem permissão para alterar perfis de acesso.
        </Alert>
      )}

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
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
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
            onChange={handleCpfChange}
            error={!!cpfError}
            helperText={cpfError || '11 dígitos'}
            placeholder="000.000.000-00"
            inputProps={{ maxLength: 18 }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleTelefoneChange}
            placeholder="(00) 00000-0000"
            inputProps={{ maxLength: 16 }}
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
        
        {isAdmin ? (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Perfil de Acesso</InputLabel>
              <Select value={formData.role} onChange={handleRoleChange} label="Perfil de Acesso">
                {roles.map(role => (
                  <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Perfil de Acesso"
              value={roles.find(r => r.value === formData.role)?.label || formData.role}
              disabled
              size="small"
              helperText="Apenas ADMIN pode alterar o perfil"
            />
          </Grid>
        )}
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Unidade de Saúde</InputLabel>
            <Select value={formData.unidadeId} onChange={handleUnidadeChange} label="Unidade de Saúde">
              <MenuItem value="">Nenhuma</MenuItem>
              {unidades.map(unidade => (
                <MenuItem key={unidade.id} value={unidade.id}>{unidade.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="password"
            label={usuario ? "Nova Senha (opcional)" : "Senha"}
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            helperText={usuario ? "Preencha apenas para alterar" : "Mínimo 6 caracteres"}
            required={!usuario}
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                color="success"
              />
            }
            label={formData.ativo ? 'Usuário Ativo' : 'Usuário Inativo'}
          />
        </Grid>
      </Grid>

      <DialogActions sx={{ mt: 3, px: 0 }}>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (usuario ? 'Atualizar' : 'Cadastrar')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default FormUsuario;