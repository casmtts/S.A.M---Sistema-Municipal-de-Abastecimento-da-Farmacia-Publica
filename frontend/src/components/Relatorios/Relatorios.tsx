import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Stack,
    Divider,
    TextField,
    InputAdornment,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    CircularProgress,
} from '@mui/material';
import {
    PictureAsPdf as PdfIcon,
    TableChart as ExcelIcon,
    Print as PrintIcon,
    Search as SearchIcon,
    CleaningServices as CleaningIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { MedicamentoType, PedidoType } from '../../types';
import api from '../../services/api';

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
    tableContainer: {
        borderRadius: 3,
    },
    actionButtons: {
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 1,
    },
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

export const Relatorios: React.FC = () => {
    const [medicamentos, setMedicamentos] = useState<MedicamentoType[]>([]);
    const [pedidos, setPedidos] = useState<PedidoType[]>([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [error, setError] = useState<string | null>(null);

    // Carregar dados da API
    const carregarMedicamentos = async () => {
        try {
            const response = await api.get('/medicamentos');
            setMedicamentos(response.data);
        } catch (error) {
            console.error('Erro ao carregar medicamentos:', error);
            setError('Erro ao carregar medicamentos');
        }
    };

    const carregarPedidos = async () => {
        try {
            const response = await api.get('/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            setError('Erro ao carregar pedidos');
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            await Promise.all([carregarMedicamentos(), carregarPedidos()]);
            setLoading(false);
        };
        carregarDados();
    }, []);

    // Dados filtrados
    const filteredMedicamentos = useMemo(() => {
        return medicamentos.filter(m =>
            m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [medicamentos, searchTerm]);

    const filteredPedidos = useMemo(() => {
        if (statusFilter === 'todos') return pedidos;
        return pedidos.filter(p => p.status === statusFilter);
    }, [pedidos, statusFilter]);

    // Estatísticas para o resumo
    const stats = useMemo(() => {
        const totalMedicamentos = medicamentos.length;
        const totalEstoque = medicamentos.reduce((sum, m) => sum + m.quantidadeAtual, 0);
        const valorEstoque = medicamentos.reduce((sum, m) => sum + (m.quantidadeAtual * m.precoUnitario), 0);
        const medicamentosCriticos = medicamentos.filter(m => m.quantidadeAtual <= m.quantidadeMinima * 0.5).length;
        const medicamentosBaixos = medicamentos.filter(m => m.quantidadeAtual <= m.quantidadeMinima && m.quantidadeAtual > m.quantidadeMinima * 0.5).length;
        const totalPedidos = pedidos.length;
        const pedidosPendentes = pedidos.filter(p => p.status === 'PENDENTE').length;
        const pedidosEntregues = pedidos.filter(p => p.status === 'ENTREGUE').length;
        const valorTotalPedidos = pedidos.reduce((sum, p) => sum + (p.quantidadeSolicitada * p.valorUnitario), 0);

        return {
            totalMedicamentos,
            totalEstoque,
            valorEstoque,
            medicamentosCriticos,
            medicamentosBaixos,
            totalPedidos,
            pedidosPendentes,
            pedidosEntregues,
            valorTotalPedidos,
        };
    }, [medicamentos, pedidos]);

    const formatarMoeda = (valor: number): string => {
        return valor.toFixed(2).replace('.', ',');
    };

    const formatarData = (data: Date): string => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    // ✅ Função correta para exportar relatórios
    const handleExport = async (formato: 'pdf' | 'excel') => {
        setExportLoading(true);
        setError(null);

        // Determinar o tipo de relatório baseado na aba atual
        let tipo = '';
        switch (tabValue) {
            case 0:
                tipo = 'MEDICAMENTOS';
                break;
            case 1:
                tipo = 'PEDIDOS';
                break;
            case 2:
                tipo = 'MOVIMENTACOES';
                break;
            case 3:
                tipo = 'RESUMO_GERAL';
                break;
            default:
                tipo = 'MEDICAMENTOS';
        }

        try {
            const response = await api.post('/relatorios/exportar', {
                tipo,
                formato: formato.toUpperCase(),
            }, {
                responseType: 'blob',
            });

            // Verificar se a resposta é um erro (blob de erro)
            if (response.headers['content-type']?.includes('application/json')) {
                const text = await response.data.text();
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || 'Erro ao gerar relatório');
            }

            // Criar blob e fazer download
            const blob = new Blob([response.data], {
                type: formato === 'pdf'
                    ? 'application/pdf'
                    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Nome do arquivo
            const dataAtual = new Date().toISOString().split('T')[0];
            link.download = `relatorio_${tipo.toLowerCase()}_${dataAtual}.${formato}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err: any) {
            console.error('Erro ao exportar:', err);
            setError(err.message || 'Erro ao gerar relatório');
        } finally {
            setExportLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('todos');
    };

    if (loading) {
        return (
            <Box sx={styles.container}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Carregando relatórios...</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={styles.container}>
            {/* Header */}
            <Paper sx={styles.headerPaper}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                    Relatórios e Análises
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Visualize e exporte dados detalhados do sistema de abastecimento
                </Typography>
            </Paper>

            {/* Mensagem de erro */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Botões de ação */}
            <Box sx={styles.actionButtons}>
                <Button
                    variant="contained"
                    startIcon={<PdfIcon />}
                    onClick={() => handleExport('pdf')}
                    disabled={exportLoading}
                    sx={{ borderRadius: 2 }}
                >
                    {exportLoading ? <CircularProgress size={24} /> : 'Exportar PDF'}
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<ExcelIcon />}
                    onClick={() => handleExport('excel')}
                    disabled={exportLoading}
                    sx={{ borderRadius: 2 }}
                >
                    {exportLoading ? <CircularProgress size={24} /> : 'Exportar Excel'}
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    sx={{ borderRadius: 2 }}
                >
                    Imprimir
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CleaningIcon />}
                    onClick={handleClearFilters}
                    sx={{ borderRadius: 2 }}
                >
                    Limpar Filtros
                </Button>
            </Box>

            {/* Tabs */}
            <Paper sx={{ borderRadius: 3 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ px: 2, pt: 2 }}>
                    <Tab label="Medicamentos" />
                    <Tab label="Pedidos" />
                    <Tab label="Resumo Geral" />
                </Tabs>

                {/* Tab Medicamentos */}
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ px: 2, pb: 2 }}>
                        <TextField
                            size="small"
                            placeholder="Buscar medicamento por nome ou princípio ativo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2, width: 350 }}
                            fullWidth={false}
                        />

                        <TableContainer component={Paper} sx={styles.tableContainer}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell>Medicamento</TableCell>
                                        <TableCell>Princípio Ativo</TableCell>
                                        <TableCell align="right">Estoque</TableCell>
                                        <TableCell align="right">Mínimo</TableCell>
                                        <TableCell align="right">Preço</TableCell>
                                        <TableCell>Validade</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMedicamentos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Nenhum medicamento encontrado
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMedicamentos.map((med) => {
                                            const isCritico = med.quantidadeAtual <= med.quantidadeMinima * 0.5;
                                            const isBaixo = med.quantidadeAtual <= med.quantidadeMinima;
                                            return (
                                                <TableRow key={med.id} hover>
                                                    <TableCell>{med.nome}</TableCell>
                                                    <TableCell>{med.principioAtivo}</TableCell>
                                                    <TableCell align="right">{med.quantidadeAtual} un.</TableCell>
                                                    <TableCell align="right">{med.quantidadeMinima} un.</TableCell>
                                                    <TableCell align="right">R$ {formatarMoeda(med.precoUnitario)}</TableCell>
                                                    <TableCell>{formatarData(med.validade)}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={isCritico ? 'Crítico' : isBaixo ? 'Baixo' : 'Normal'}
                                                            color={isCritico ? 'error' : isBaixo ? 'warning' : 'success'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                            Total de registros: {filteredMedicamentos.length} medicamentos
                        </Typography>
                    </Box>
                </TabPanel>

                {/* Tab Pedidos */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ px: 2, pb: 2 }}>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <FormControl size="small" sx={{ width: 200 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="todos">Todos</MenuItem>
                                    <MenuItem value="PENDENTE">Pendentes</MenuItem>
                                    <MenuItem value="APROVADO">Aprovados</MenuItem>
                                    <MenuItem value="ENTREGUE">Entregues</MenuItem>
                                    <MenuItem value="CANCELADO">Cancelados</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>

                        <TableContainer component={Paper} sx={styles.tableContainer}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell>Medicamento</TableCell>
                                        <TableCell align="right">Solicitado</TableCell>
                                        <TableCell align="right">Entregue</TableCell>
                                        <TableCell>Data Solicitação</TableCell>
                                        <TableCell>Data Prevista</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="right">Valor Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPedidos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Nenhum pedido encontrado
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPedidos.map((pedido) => (
                                            <TableRow key={pedido.id} hover>
                                                <TableCell>{pedido.medicamentoNome}</TableCell>
                                                <TableCell align="right">{pedido.quantidadeSolicitada} un.</TableCell>
                                                <TableCell align="right">{pedido.quantidadeEntregue} un.</TableCell>
                                                <TableCell>{formatarData(pedido.dataSolicitacao)}</TableCell>
                                                <TableCell>{formatarData(pedido.dataPrevistaEntrega)}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={pedido.status}
                                                        color={
                                                            pedido.status === 'ENTREGUE' ? 'success' :
                                                                pedido.status === 'PENDENTE' ? 'warning' :
                                                                    pedido.status === 'CANCELADO' ? 'error' : 'info'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    R$ {formatarMoeda(pedido.quantidadeSolicitada * pedido.valorUnitario)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                            Total de registros: {filteredPedidos.length} pedidos
                        </Typography>
                    </Box>
                </TabPanel>

                {/* Tab Resumo Geral */}
                <TabPanel value={tabValue} index={2}>
                    <Box sx={{ px: 2, pb: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, borderRadius: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                        Resumo de Estoque
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Total de Medicamentos:</Typography>
                                            <Typography fontWeight="bold">{stats.totalMedicamentos}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Unidades em Estoque:</Typography>
                                            <Typography fontWeight="bold">{stats.totalEstoque}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Valor Total em Estoque:</Typography>
                                            <Typography fontWeight="bold" color="#2e7d32">
                                                R$ {formatarMoeda(stats.valorEstoque)}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Medicamentos Críticos:</Typography>
                                            <Typography fontWeight="bold" color="error">
                                                {stats.medicamentosCriticos}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Medicamentos Baixos:</Typography>
                                            <Typography fontWeight="bold" color="warning.main">
                                                {stats.medicamentosBaixos}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, borderRadius: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                        Resumo de Pedidos
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Total de Pedidos:</Typography>
                                            <Typography fontWeight="bold">{stats.totalPedidos}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Pedidos Pendentes:</Typography>
                                            <Typography fontWeight="bold" color="warning.main">
                                                {stats.pedidosPendentes}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Pedidos Entregues:</Typography>
                                            <Typography fontWeight="bold" color="success.main">
                                                {stats.pedidosEntregues}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Valor Total dos Pedidos:</Typography>
                                            <Typography fontWeight="bold" color="#2e7d32">
                                                R$ {formatarMoeda(stats.valorTotalPedidos)}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="textSecondary">Taxa de Entrega:</Typography>
                                            <Typography fontWeight="bold">
                                                {stats.totalPedidos > 0
                                                    ? Math.round((stats.pedidosEntregues / stats.totalPedidos) * 100)
                                                    : 0}%
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Alert severity="info" icon={<TrendingUpIcon />}>
                                    Utilize os filtros nas abas "Medicamentos" e "Pedidos" para refinar sua busca.
                                    Os dados podem ser exportados nos formatos PDF ou Excel.
                                </Alert>
                            </Grid>
                        </Grid>
                    </Box>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default Relatorios;