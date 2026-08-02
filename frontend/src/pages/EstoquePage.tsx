// src/pages/EstoquePage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { ListaMedicamentos } from '../components/Estoque/ListaMedicamentos';

const styles = {
  container: {
    p: 3,
  },
  title: {
    mb: 1,
  },
  subtitle: {
    mb: 3,
  },
};

export const EstoquePage: React.FC = () => {
  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom sx={styles.title}>
        Controle de Estoque
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={styles.subtitle}>
        Gerencie o estoque de medicamentos da rede municipal
      </Typography>
      <ListaMedicamentos />
    </Box>
  );
};