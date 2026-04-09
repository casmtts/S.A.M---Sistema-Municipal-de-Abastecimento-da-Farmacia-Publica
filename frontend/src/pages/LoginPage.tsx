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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('token', 'fake-token');
        navigate('/dashboard');
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch {
      setError('Erro ao fazer login');
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
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: { xs: 520, md: 980 },
            mx: 'auto',
            borderRadius: { xs: 2.5, sm: 4 },
            overflow: 'hidden',
            bgcolor: '#ffffff',
            border: '1px solid #dbe7ff',
            boxShadow: { xs: '0 8px 20px rgba(0, 58, 112, 0.10)', sm: '0 16px 32px rgba(0, 58, 112, 0.12)' },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 5 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2.5, md: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.6rem', sm: '2rem' } }}>
                  Entrar na plataforma
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                  Gerencie estoque, pedidos e alertas da farmacia publica com seguranca e agilidade.
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Acesso
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Informe suas credenciais para continuar.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                  />
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 3, py: 1.25, fontWeight: 700 }}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
                  Credenciais de teste: <strong>admin / admin</strong>
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Ainda nao tem conta?{' '}
                  <Link component={RouterLink} to="/register" underline="hover">
                    Criar cadastro
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

export default LoginPage;