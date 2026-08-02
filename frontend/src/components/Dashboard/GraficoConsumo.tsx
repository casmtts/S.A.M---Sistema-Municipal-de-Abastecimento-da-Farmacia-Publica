// src/components/Dashboard/GraficoConsumo.tsx
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MedicamentoType } from '../../types';
import { Box, Typography } from '@mui/material';

interface GraficoConsumoProps {
  medicamentos: MedicamentoType[];
}

// Dados mockados estáticos para exemplo
const MOCK_CONSUMO = {
  'Paracetamol': 350,
  'Amoxicilina': 280,
  'Ibuprofeno': 420,
  'Dipirona': 310,
  'Losartana': 190,
};

const DEFAULT_CONSUMO = 200;

export const GraficoConsumo: React.FC<GraficoConsumoProps> = ({ medicamentos }) => {
  const data = useMemo(() => {
    return medicamentos.slice(0, 5).map(m => ({
      nome: m.nome.length > 15 ? m.nome.substring(0, 15) + '...' : m.nome,
      consumo: MOCK_CONSUMO[m.nome as keyof typeof MOCK_CONSUMO] || DEFAULT_CONSUMO,
      estoque: m.quantidadeAtual
    }));
  }, [medicamentos]);

  if (medicamentos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="textSecondary">
          Carregando dados do gráfico...
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="consumo" fill="#8884d8" name="Consumo Mensal" />
        <Bar dataKey="estoque" fill="#82ca9d" name="Estoque Atual" />
      </BarChart>
    </ResponsiveContainer>
  );
};