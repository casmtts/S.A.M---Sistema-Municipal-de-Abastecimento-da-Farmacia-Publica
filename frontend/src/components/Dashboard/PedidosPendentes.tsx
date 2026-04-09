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
  Button,
  Box,
  Typography,
} from '@mui/material';
import { PedidoType } from '../../types';
import { format } from 'date-fns';

interface PedidosPendentesProps {
  pedidos: PedidoType[];
}

export const PedidosPendentes: React.FC<PedidosPendentesProps> = ({ pedidos }) => {
  if (pedidos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">
          Nenhum pedido pendente no momento
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
            <TableCell align="right">Quantidade</TableCell>
            <TableCell>Data Solicitação</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell component="th" scope="row">
                {pedido.medicamentoNome}
              </TableCell>
              <TableCell align="right">{pedido.quantidadeSolicitada} un.</TableCell>
              <TableCell>
                {format(new Date(pedido.dataSolicitacao), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={pedido.status}
                  color={pedido.status === 'PENDENTE' ? 'warning' : 'info'}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Button size="small" variant="outlined" color="primary">
                  Aprovar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};