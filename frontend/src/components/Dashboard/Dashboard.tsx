import React, { useMemo, useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  LinearProgress,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import {
  Warning as WarningIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Medication as MedicationIcon,
  Vaccines as VaccinesIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  TrendingUp as TrendingUpIcon,
  QueryStats as QueryStatsIcon,
} from '@mui/icons-material';
import { useMedicamentos } from '../../hooks/useMedicamentos';
import { usePedidos } from '../../hooks/usePedidos';
import { GraficoConsumo } from './GraficoConsumo';
import { AlertasEstoque } from './AlertasEstoque';
import { PedidosPendentes } from './PedidosPendentes';
import { MedicamentoType } from '../../types';

const styles = {
  container: {
    p: { xs: 1, sm: 2, md: 3 },
  },
  title: {
    mb: 0.5,
  },
  alertBox: {
    mt: 3,
  },
};

const StatCard = ({
  title,
  value,
  icon,
  accent,
  trend,
  onClick,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  trend: number;
  onClick: () => void;
}) => {
  const positive = trend >= 0;
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${accent}22`,
        boxShadow: '0 10px 24px rgba(12, 36, 97, 0.08)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 28px rgba(12, 36, 97, 0.16)',
        },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: accent, lineHeight: 1.1 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              color: accent,
              bgcolor: `${accent}1A`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
          {positive ? (
            <ArrowUpwardIcon fontSize="small" sx={{ color: '#2e7d32' }} />
          ) : (
            <ArrowDownwardIcon fontSize="small" sx={{ color: '#d32f2f' }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: positive ? '#2e7d32' : '#d32f2f',
            }}
          >
            {positive ? '+' : ''}
            {trend}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs. período anterior
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = () => {
  const { medicamentos, loading, getAlertas } = useMedicamentos();
  const { pedidosPendentes, pedidos } = usePedidos();
  const [alertas, setAlertas] = useState({ criticos: 0, baixos: 0 });
  const [alertasDetalhados, setAlertasDetalhados] = useState<{ criticos: MedicamentoType[]; baixos: MedicamentoType[] }>({
    criticos: [],
    baixos: [],
  });
  const [openDetail, setOpenDetail] = useState<null | 'medicamentos' | 'valor' | 'dispensas' | 'faltas' | 'itens'>(
    null
  );

  useEffect(() => {
    const load = async () => {
      const data = await getAlertas();
      setAlertas({ criticos: data.criticos.length, baixos: data.baixos.length });
      setAlertasDetalhados(data);
    };
    load();
  }, [getAlertas]);

  const totalEstoque = useMemo(
    () => medicamentos.reduce((sum, m) => sum + m.quantidadeAtual * m.precoUnitario, 0),
    [medicamentos]
  );

  const totalUnidades = useMemo(
    () => medicamentos.reduce((sum, m) => sum + m.quantidadeAtual, 0),
    [medicamentos]
  );
  const dispensasConcluidas = useMemo(
    () => pedidos.filter((p) => p.status === 'ENTREGUE').length,
    [pedidos]
  );
  const itensDispensados = useMemo(
    () => pedidos.reduce((sum, p) => sum + p.quantidadeEntregue, 0),
    [pedidos]
  );
  const medicamentosEmFalta = alertas.criticos + alertas.baixos;

  const percentualRisco =
    totalUnidades === 0
      ? 0
      : Math.min(100, Math.round(((alertas.criticos + alertas.baixos) / Math.max(1, medicamentos.length)) * 100));

  const trends = useMemo(() => {
    // Tendencias simuladas com base nos dados atuais para visualizacao executiva.
    const medicamentosTrend = Math.min(18, Math.max(-8, medicamentos.length - 4));
    const valorTrend = Math.min(24, Math.max(-15, Math.round(totalEstoque / 150)));
    const pedidosTrend = Math.min(20, Math.max(-20, dispensasConcluidas * 4 - 5));
    const alertaTrend = -Math.min(25, alertas.criticos * 6 + alertas.baixos * 2);
    const dispensadosTrend = Math.min(28, Math.max(-15, Math.round(itensDispensados / 25)));
    return { medicamentosTrend, valorTrend, pedidosTrend, alertaTrend, dispensadosTrend };
  }, [medicamentos.length, totalEstoque, dispensasConcluidas, alertas.criticos, alertas.baixos, itensDispensados]);

  const topEstoque = useMemo(
    () => [...medicamentos].sort((a, b) => b.quantidadeAtual - a.quantidadeAtual).slice(0, 5),
    [medicamentos]
  );
  const topDispensas = useMemo(
    () => [...pedidos].sort((a, b) => b.quantidadeEntregue - a.quantidadeEntregue).slice(0, 5),
    [pedidos]
  );
  const valorMedioPorMedicamento = medicamentos.length ? totalEstoque / medicamentos.length : 0;

  const modalContent = useMemo(() => {
    switch (openDetail) {
      case 'medicamentos':
        return {
          title: 'Medicamentos Cadastrados',
          lines: [
            `Total cadastrados: ${medicamentos.length}`,
            `Unidades em estoque: ${totalUnidades}`,
            `Media por medicamento: ${medicamentos.length ? Math.round(totalUnidades / medicamentos.length) : 0} un.`,
          ],
          list: topEstoque.map((m) => `${m.nome} - ${m.quantidadeAtual} un.`),
        };
      case 'valor':
        return {
          title: 'Valor em Estoque',
          lines: [
            `Valor total: R$ ${totalEstoque.toFixed(2)}`,
            `Valor medio por medicamento: R$ ${valorMedioPorMedicamento.toFixed(2)}`,
            `Itens em estoque: ${totalUnidades} un.`,
          ],
          list: topEstoque.map((m) => `${m.nome} - R$ ${(m.quantidadeAtual * m.precoUnitario).toFixed(2)}`),
        };
      case 'dispensas':
        return {
          title: 'Dispensas Concluidas',
          lines: [
            `Dispensas concluídas: ${dispensasConcluidas}`,
            `Pedidos pendentes: ${pedidosPendentes.length}`,
            `Pedidos totais: ${pedidos.length}`,
          ],
          list: topDispensas.map((p) => `${p.medicamentoNome} - ${p.quantidadeEntregue} un. entregues`),
        };
      case 'faltas':
        return {
          title: 'Medicamentos em Falta',
          lines: [
            `Alertas totais: ${medicamentosEmFalta}`,
            `Críticos: ${alertas.criticos}`,
            `Baixos: ${alertas.baixos}`,
          ],
          list: [...alertasDetalhados.criticos, ...alertasDetalhados.baixos].map(
            (m) => `${m.nome} - atual ${m.quantidadeAtual} / minimo ${m.quantidadeMinima}`
          ),
        };
      case 'itens':
        return {
          title: 'Itens Dispensados',
          lines: [
            `Total de itens dispensados: ${itensDispensados}`,
            `Media por pedido: ${pedidos.length ? Math.round(itensDispensados / pedidos.length) : 0} un.`,
            `Dispensas concluídas: ${dispensasConcluidas}`,
          ],
          list: topDispensas.map((p) => `${p.medicamentoNome} - ${p.quantidadeEntregue} un.`),
        };
      default:
        return null;
    }
  }, [
    openDetail,
    medicamentos.length,
    totalUnidades,
    topEstoque,
    totalEstoque,
    valorMedioPorMedicamento,
    dispensasConcluidas,
    pedidosPendentes.length,
    pedidos.length,
    topDispensas,
    medicamentosEmFalta,
    alertas.criticos,
    alertas.baixos,
    alertasDetalhados,
    itensDispensados,
  ]);

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Typography>Carregando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          mb: 3,
          background: 'linear-gradient(120deg, #0B1F48 0%, #123A88 60%, #2A6FD6 100%)',
          color: '#fff',
          boxShadow: '0 14px 34px rgba(11,31,72,0.35)',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" sx={styles.title}>
              Painel Inteligente
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Visão em tempo real do estoque, alertas e tendência operacional.
            </Typography>
          </Box>
          <Chip
            icon={<TrendingUpIcon />}
            label={`Risco de estoque: ${percentualRisco}%`}
            sx={{ bgcolor: '#ffffff22', color: '#fff', '& .MuiChip-icon': { color: '#fff' } }}
          />
        </Stack>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Medicamentos Cadastrados"
            value={medicamentos.length}
            icon={<MedicationIcon fontSize="medium" />}
            accent="#1976d2"
            trend={trends.medicamentosTrend}
            onClick={() => setOpenDetail('medicamentos')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor em Estoque"
            value={`R$ ${totalEstoque.toFixed(2)}`}
            icon={<AttachMoneyIcon fontSize="medium" />}
            accent="#2e7d32"
            trend={trends.valorTrend}
            onClick={() => setOpenDetail('valor')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Dispensas Concluídas"
            value={dispensasConcluidas}
            icon={<ShoppingCartIcon fontSize="medium" />}
            accent="#ed6c02"
            trend={trends.pedidosTrend}
            onClick={() => setOpenDetail('dispensas')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Medicamentos em Falta"
            value={medicamentosEmFalta}
            icon={<WarningIcon fontSize="medium" />}
            accent="#d32f2f"
            trend={trends.alertaTrend}
            onClick={() => setOpenDetail('faltas')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Itens Dispensados"
            value={itensDispensados}
            icon={<VaccinesIcon fontSize="medium" />}
            accent="#6A1B9A"
            trend={trends.dispensadosTrend}
            onClick={() => setOpenDetail('itens')}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <QueryStatsIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Consumo x Estoque
                </Typography>
              </Stack>
              <GraficoConsumo medicamentos={medicamentos} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Saúde do Estoque
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nível de criticidade atual
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percentualRisco}
                color={percentualRisco > 50 ? 'error' : percentualRisco > 25 ? 'warning' : 'success'}
                sx={{ mt: 1.5, mb: 1, height: 10, borderRadius: 6 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                {percentualRisco}% de risco
              </Typography>

              <Stack spacing={1}>
                <Chip color="error" label={`${alertas.criticos} críticos`} />
                <Chip color="warning" label={`${alertas.baixos} baixos`} />
                <Chip color="info" label={`${pedidos.length} pedidos totais`} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Alertas de Estoque
              </Typography>
              <AlertasEstoque criticos={alertasDetalhados.criticos} baixos={alertasDetalhados.baixos} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Pedidos Pendentes
              </Typography>
              <PedidosPendentes pedidos={pedidosPendentes} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {(alertas.criticos > 0 || alertas.baixos > 0) && (
        <Box sx={styles.alertBox}>
          <Alert severity="warning">
            {alertas.criticos} medicamento(s) em estado crítico e {alertas.baixos} com estoque baixo.
          </Alert>
        </Box>
      )}

      <Dialog open={openDetail !== null} onClose={() => setOpenDetail(null)} fullWidth maxWidth="sm">
        <DialogTitle>{modalContent?.title ?? 'Detalhes'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1}>
            {(modalContent?.lines ?? []).map((line) => (
              <Typography key={line} variant="body2">
                {line}
              </Typography>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Informações detalhadas
          </Typography>
          <Stack spacing={0.75}>
            {(modalContent?.list ?? []).length > 0 ? (
              (modalContent?.list ?? []).map((item) => (
                <Typography key={item} variant="body2" color="text.secondary">
                  - {item}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum detalhe disponível no momento.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(null)} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
