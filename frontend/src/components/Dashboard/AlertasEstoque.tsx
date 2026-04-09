import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { Warning as WarningIcon, Error as ErrorIcon } from '@mui/icons-material';
import { MedicamentoType } from '../../types';

interface AlertasEstoqueProps {
  criticos: MedicamentoType[];
  baixos: MedicamentoType[];
}

export const AlertasEstoque: React.FC<AlertasEstoqueProps> = ({ criticos, baixos }) => {
  const todosAlertas = [...criticos, ...baixos];

  if (todosAlertas.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">
          Nenhum alerta de estoque no momento
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Medicamento</TableCell>
            <TableCell align="right">Estoque Atual</TableCell>
            <TableCell align="right">Estoque Mínimo</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todosAlertas.map((medicamento) => {
            const isCritico = criticos.some(c => c.id === medicamento.id);
            return (
              <TableRow key={medicamento.id}>
                <TableCell component="th" scope="row">
                  {medicamento.nome}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={isCritico ? 'error' : 'warning'}
                    fontWeight="bold"
                  >
                    {medicamento.quantidadeAtual} un.
                  </Typography>
                </TableCell>
                <TableCell align="right">{medicamento.quantidadeMinima} un.</TableCell>
                <TableCell align="center">
                  <Chip
                    icon={isCritico ? <ErrorIcon /> : <WarningIcon />}
                    label={isCritico ? 'Crítico' : 'Baixo'}
                    color={isCritico ? 'error' : 'warning'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};