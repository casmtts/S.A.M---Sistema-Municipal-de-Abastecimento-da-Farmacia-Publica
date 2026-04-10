// src/pages/UsuariosPage.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ListaUsuarios } from '../components/UsuariosPermissoes/ListaUsuario';

const styles = {
  container: {
    p: { xs: 1, sm: 2, md: 3 },
  },
  headerPaper: {
    p: { xs: 2, md: 3 },
    borderRadius: 3,
    mb: 3,
    background: 'linear-gradient(120deg, #0B1F48 0%, #123A88 60%, #2A6FD6 100%)',
    color: '#fff',
  },
};

export const UsuariosPage: React.FC = () => {
  return (
    <Box sx={styles.container}>
      <Paper sx={styles.headerPaper}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          👥 Usuários e Permissões
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Gerencie os usuários e níveis de acesso ao sistema de abastecimento
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <ListaUsuarios />
      </Paper>
    </Box>
  );
};

export default UsuariosPage;