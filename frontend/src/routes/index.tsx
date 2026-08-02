import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  CssBaseline,
  Button,
  Stack,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory2 as Inventory2Icon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  TableChart,
  Business as BusinessIcon,
  People,
} from '@mui/icons-material';
import { DashboardPage } from '../pages/DashboardPage';
import { EstoquePage } from '../pages/EstoquePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { RelatoriosPage } from '../pages/RelatoriosPage';
import { CadastroPage } from '../pages/CadastroPage';
import UsuarioPage from '../pages/UsuarioPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#123A88',
      dark: '#0B1F48',
    },
    secondary: {
      main: '#2A6FD6',
    },
    background: {
      default: '#f4f8ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f4f8ff',
        },
        a: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(120deg, #0B1F48 0%, #123A88 100%)',
          boxShadow: '0 8px 24px rgba(11, 31, 72, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #dbe7ff',
          boxShadow: '0 10px 24px rgba(12, 36, 97, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setAnchorEl(null);
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Estoque', path: '/estoque', icon: <Inventory2Icon fontSize="small" /> },
    { label: 'Cadastros', path: '/cadastros', icon: <BusinessIcon fontSize="small" /> },
    { label: 'Relatórios', path: '/relatorios', icon: <TableChart fontSize="small" /> },
    { label: 'Usuários', path: '/usuarios', icon: <People fontSize="small" /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Box
            component={RouterLink}
            to="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                whiteSpace: 'nowrap',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Sistema de Abastecimento
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flex: 1, justifyContent: 'center' }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: '#fff',
                    bgcolor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                    border: active ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                    textTransform: 'none',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>Usuário logado</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/estoque" element={
            <ProtectedRoute>
              <MainLayout>
                <EstoquePage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/cadastros" element={
            <ProtectedRoute>
              <MainLayout>
                <CadastroPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/relatorios" element={
            <ProtectedRoute>
              <MainLayout>
                <RelatoriosPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/usuarios" element={
            <ProtectedRoute>
              <MainLayout>
                <UsuarioPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Redirecionamentos */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};