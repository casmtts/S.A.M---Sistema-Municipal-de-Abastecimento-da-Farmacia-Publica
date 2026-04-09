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
} from '@mui/material';
import logoSistema from '../assets/Logo_sistema_de_abastecimento_farmacêutico.png';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!nome || !email || !username || !password) {
        setError('Preencha todos os campos obrigatorios');
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas nao coincidem');
        return;
      }

      localStorage.setItem('token', 'fake-token');
      navigate('/dashboard');
    } catch {
      setError('Erro ao criar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f4f8ff 0%, #e8f1ff 100%)',
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 0 },
      }}
    >
      <Container maxWidth="sm" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: { xs: 520, sm: 600 },
            mx: 'auto',
            borderRadius: { xs: 2.5, sm: 4 },
            overflow: 'hidden',
            bgcolor: '#ffffff',
            border: '1px solid #dbe7ff',
            boxShadow: { xs: '0 8px 20px rgba(0, 58, 112, 0.10)', sm: '0 16px 32px rgba(0, 58, 112, 0.12)' },
          }}
        >
          <CardContent sx={{ p: { xs: 2.25, sm: 3.5 } }}>
            <Stack direction="column" spacing={2.5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Avatar src={logoSistema} alt="Logo SAM" sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 } }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      S.A.M
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sistema Municipal de Abastecimento
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.45rem', sm: '1.75rem' } }}>
                  Criar conta
                </Typography>
                <Typography color="text.secondary">
                  Cadastre seu acesso para operar o sistema de abastecimento da farmacia publica.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Cadastro de usuario
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Preencha os dados para concluir seu registro.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    label="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    required
                  />
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="medium"
                    disabled={loading}
                    sx={{ mt: 2, py: 1, fontWeight: 700 }}
                  >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Ja possui conta?{' '}
                  <Link component={RouterLink} to="/login" underline="hover">
                    Fazer login
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
