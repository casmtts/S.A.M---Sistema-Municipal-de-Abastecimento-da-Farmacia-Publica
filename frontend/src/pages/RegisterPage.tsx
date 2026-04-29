import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Stack,
  Avatar,
  Divider,
  Link,
  Grid,
  MenuItem,
} from '@mui/material';
import logoSistema from '../assets/Logo_sistema_de_abastecimento_farmacêutico.png';
import api from '../services/api';

const roles = [
  { value: 'ATENDENTE', label: 'Atendente' },
  { value: 'FARMACEUTICO', label: 'Farmacêutico' },
  { value: 'GESTOR', label: 'Gestor' },
  { value: 'ADMIN', label: 'Administrador' },
];

const aplicarMascaraCPF = (valor: string): string => {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
  if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
};

const aplicarMascaraTelefone = (valor: string): string => {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length === 0) return '';
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
};

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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    role: 'ATENDENTE',
    telefone: '',
    cargo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') setEmailError('');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mascara = aplicarMascaraCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: mascara }));
    const numeros = mascara.replace(/\D/g, '');
    if (numeros.length === 11 && !validarCPF(mascara)) {
      setCpfError('CPF inválido');
    } else {
      setCpfError('');
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mascara = aplicarMascaraTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: mascara }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    setEmailError(email && !validarEmail(email) ? 'E-mail inválido' : '');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const numerosCPF = formData.cpf.replace(/\D/g, '');
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

    if (formData.email && !validarEmail(formData.email)) {
      setError('E-mail inválido');
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''),
        senha: formData.senha,
        role: formData.role,
        telefone: formData.telefone.replace(/\D/g, '') || undefined,
        cargo: formData.cargo || undefined,
      };

      await api.post('/auth/register', dataToSend);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao realizar cadastro';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f4f8ff 0%, #e8f1ff 100%)', py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 0 } }}>
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
        <Card sx={{ width: '100%', maxWidth: { xs: 520, md: 980 }, mx: 'auto', borderRadius: { xs: 2.5, sm: 4 }, overflow: 'hidden', bgcolor: '#ffffff', border: '1px solid #dbe7ff', boxShadow: { xs: '0 8px 20px rgba(0, 58, 112, 0.10)', sm: '0 16px 32px rgba(0, 58, 112, 0.12)' } }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 5 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2.5, md: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Avatar src={logoSistema} alt="Logo SAM" sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 } }} />
                  <Box><Typography variant="h6" sx={{ fontWeight: 700 }}>S.A.M</Typography><Typography variant="caption" color="text.secondary">Sistema Municipal de Abastecimento</Typography></Box>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.6rem', sm: '2rem' } }}>Criar conta</Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.92rem', sm: '1rem' } }}>Preencha os dados abaixo para criar seu acesso ao sistema.</Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Cadastro</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Informe seus dados para criar sua conta.</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Nome completo" name="nome" value={formData.nome} onChange={handleChange} required size="small" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="E-mail" name="email" type="email" value={formData.email} onChange={handleEmailChange} error={!!emailError} helperText={emailError} required size="small" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="CPF" name="cpf" value={formData.cpf} onChange={handleCpfChange} error={!!cpfError} helperText={cpfError || '11 dígitos'} placeholder="000.000.000-00" inputProps={{ maxLength: 18 }} size="small" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleTelefoneChange} placeholder="(00) 00000-0000" inputProps={{ maxLength: 16 }} size="small" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Cargo/Função" name="cargo" value={formData.cargo} onChange={handleChange} size="small" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth select label="Perfil de acesso" name="role" value={formData.role} onChange={handleChange} size="small">{roles.map((role) => (<MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>))}</TextField></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth type="password" label="Senha" name="senha" value={formData.senha} onChange={handleChange} required size="small" helperText="Mínimo 6 caracteres" /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth type="password" label="Confirmar senha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required size="small" /></Grid>
                  </Grid>
                  <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 3, py: 1.25, fontWeight: 700 }}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
                </form>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>Já tem uma conta? <Link component={RouterLink} to="/login" underline="hover">Fazer login</Link></Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;