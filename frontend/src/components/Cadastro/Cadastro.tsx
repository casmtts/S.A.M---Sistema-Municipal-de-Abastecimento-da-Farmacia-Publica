// src/pages/CadastrosPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
  Switch,
  FormControlLabel,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useFornecedores } from '../../hooks/useFornecedores';
import { useUnidadesSaude } from '../../hooks/useUnidadesSaude';
import { FornecedorType, UnidadeSaudeType, CreateFornecedorDTO, CreateUnidadeSaudeDTO } from '../../types';

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
  searchField: {
    width: 300,
  },
  tableHeader: {
    bgcolor: '#f5f5f5',
  },
  actionButtons: {
    mb: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: 2,
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

// UF para selects
const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

// Tipos de unidade
const tiposUnidade = [
  { value: 'UBS', label: 'UBS - Unidade Básica de Saúde' },
  { value: 'UPA', label: 'UPA - Unidade de Pronto Atendimento' },
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'CENTRO_ESPECIALIZADO', label: 'Centro Especializado' },
  { value: 'FARMACIA', label: 'Farmácia' },
];

const tipoColors: Record<string, 'primary' | 'secondary' | 'info' | 'success' | 'warning'> = {
  UBS: 'primary',
  UPA: 'secondary',
  HOSPITAL: 'info',
  CENTRO_ESPECIALIZADO: 'success',
  FARMACIA: 'warning',
};

const tipoLabels: Record<string, string> = {
  UBS: 'UBS',
  UPA: 'UPA',
  HOSPITAL: 'Hospital',
  CENTRO_ESPECIALIZADO: 'Centro Esp.',
  FARMACIA: 'Farmácia',
};

export const Cadastro: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Fornecedores state
  const { fornecedores, loading: loadingFornecedores, criarFornecedor, atualizarFornecedor, deletarFornecedor, recarregar: recarregarFornecedores } = useFornecedores();
  const [searchFornecedor, setSearchFornecedor] = useState('');
  const [fornecedorModal, setFornecedorModal] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<FornecedorType | null>(null);
  
  // Unidades state
  const { unidades, loading: loadingUnidades, criarUnidade, atualizarUnidade, deletarUnidade, recarregar: recarregarUnidades } = useUnidadesSaude();
  const [searchUnidade, setSearchUnidade] = useState('');
  const [unidadeModal, setUnidadeModal] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeSaudeType | null>(null);
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // ==================== FORNECEDORES ====================
  const filteredFornecedores = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(searchFornecedor.toLowerCase()) ||
    f.cnpj.includes(searchFornecedor) ||
    f.cidade.toLowerCase().includes(searchFornecedor.toLowerCase())
  );

  const handleDeleteFornecedor = async (id: string, nome: string) => {
    try {
      await deletarFornecedor(id);
      setSnackbar({ open: true, message: `Fornecedor ${nome} excluído`, severity: 'success' });
      recarregarFornecedores();
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir fornecedor', severity: 'error' });
    }
  };

  // ==================== UNIDADES ====================
  const filteredUnidades = unidades.filter(u =>
    u.nome.toLowerCase().includes(searchUnidade.toLowerCase()) ||
    u.codigo.toLowerCase().includes(searchUnidade.toLowerCase()) ||
    u.cidade.toLowerCase().includes(searchUnidade.toLowerCase())
  );

  const handleDeleteUnidade = async (id: string, nome: string) => {
    try {
      await deletarUnidade(id);
      setSnackbar({ open: true, message: `Unidade ${nome} excluída`, severity: 'success' });
      recarregarUnidades();
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir unidade', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Paper sx={styles.headerPaper}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Cadastros
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Gerencie fornecedores e unidades de saúde da rede municipal
        </Typography>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ px: 2, pt: 2 }}>
          <Tab icon={<BusinessIcon />} iconPosition="start" label="Fornecedores" />
          <Tab icon={<LocationIcon />} iconPosition="start" label="Unidades de Saúde" />
        </Tabs>

        {/* Tab Fornecedores */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Box sx={styles.actionButtons}>
              <TextField
                size="small"
                placeholder="Buscar por nome, CNPJ ou cidade..."
                value={searchFornecedor}
                onChange={(e) => setSearchFornecedor(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={styles.searchField}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedFornecedor(null);
                  setFornecedorModal(true);
                }}
              >
                Novo Fornecedor
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={styles.tableHeader}>
                    <TableCell>Fornecedor</TableCell>
                    <TableCell>CNPJ</TableCell>
                    <TableCell>Contato</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Cidade/UF</TableCell>
                    <TableCell align="center">Prazo</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingFornecedores ? (
                    <TableRow><TableCell colSpan={8} align="center">Carregando...</TableCell></TableRow>
                  ) : filteredFornecedores.length === 0 ? (
                    <TableRow><TableCell colSpan={8} align="center">Nenhum fornecedor encontrado</TableCell></TableRow>
                  ) : (
                    filteredFornecedores.map((f) => (
                      <TableRow key={f.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight="bold">{f.nome}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{f.cnpj}</TableCell>
                        <TableCell>{f.contato}</TableCell>
                        <TableCell>{f.telefone}</TableCell>
                        <TableCell>{f.cidade}/{f.uf}</TableCell>
                        <TableCell align="center">
                          <Chip label={`${f.prazoEntrega} dias`} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={f.ativo ? 'Ativo' : 'Inativo'} color={f.ativo ? 'success' : 'default'} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton size="small" color="primary" onClick={() => { setSelectedFornecedor(f); setFornecedorModal(true); }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton size="small" color="error" onClick={() => handleDeleteFornecedor(f.id, f.nome)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Tab Unidades de Saúde */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Box sx={styles.actionButtons}>
              <TextField
                size="small"
                placeholder="Buscar por nome, código ou cidade..."
                value={searchUnidade}
                onChange={(e) => setSearchUnidade(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={styles.searchField}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedUnidade(null);
                  setUnidadeModal(true);
                }}
              >
                Nova Unidade
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={styles.tableHeader}>
                    <TableCell>Unidade</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Responsável</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Cidade/UF</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingUnidades ? (
                    <TableRow><TableCell colSpan={8} align="center">Carregando...</TableCell></TableRow>
                  ) : filteredUnidades.length === 0 ? (
                    <TableRow><TableCell colSpan={8} align="center">Nenhuma unidade encontrada</TableCell></TableRow>
                  ) : (
                    filteredUnidades.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight="bold">{u.nome}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{u.codigo}</TableCell>
                        <TableCell>
                          <Chip label={tipoLabels[u.tipo]} color={tipoColors[u.tipo]} size="small" />
                        </TableCell>
                        <TableCell>{u.responsavel}</TableCell>
                        <TableCell>{u.telefone}</TableCell>
                        <TableCell>{u.cidade}/{u.uf}</TableCell>
                        <TableCell align="center">
                          <Chip label={u.ativo ? 'Ativo' : 'Inativo'} color={u.ativo ? 'success' : 'default'} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton size="small" color="primary" onClick={() => { setSelectedUnidade(u); setUnidadeModal(true); }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton size="small" color="error" onClick={() => handleDeleteUnidade(u.id, u.nome)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Paper>

      {/* Modal Fornecedor */}
      <Dialog open={fornecedorModal} onClose={() => setFornecedorModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
        <DialogContent>
          <FormFornecedor
            fornecedor={selectedFornecedor}
            onSuccess={() => {
              setFornecedorModal(false);
              recarregarFornecedores();
              setSnackbar({ open: true, message: 'Fornecedor salvo com sucesso!', severity: 'success' });
            }}
            onCancel={() => setFornecedorModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Unidade */}
      <Dialog open={unidadeModal} onClose={() => setUnidadeModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedUnidade ? 'Editar Unidade' : 'Nova Unidade'}</DialogTitle>
        <DialogContent>
          <FormUnidade
            unidade={selectedUnidade}
            onSuccess={() => {
              setUnidadeModal(false);
              recarregarUnidades();
              setSnackbar({ open: true, message: 'Unidade salva com sucesso!', severity: 'success' });
            }}
            onCancel={() => setUnidadeModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={handleCloseSnackbar}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

// ==================== FORMULÁRIO FORNECEDOR ====================
interface FormFornecedorProps {
  fornecedor?: FornecedorType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const FormFornecedor: React.FC<FormFornecedorProps> = ({ fornecedor, onSuccess, onCancel }) => {
  const { criarFornecedor, atualizarFornecedor } = useFornecedores();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateFornecedorDTO>({
    nome: fornecedor?.nome || '',
    razaoSocial: fornecedor?.razaoSocial || '',
    cnpj: fornecedor?.cnpj || '',
    inscricaoEstadual: fornecedor?.inscricaoEstadual || '',
    endereco: fornecedor?.endereco || '',
    numero: fornecedor?.numero || '',
    complemento: fornecedor?.complemento || '',
    bairro: fornecedor?.bairro || '',
    cidade: fornecedor?.cidade || '',
    uf: fornecedor?.uf || 'SP',
    cep: fornecedor?.cep || '',
    telefone: fornecedor?.telefone || '',
    email: fornecedor?.email || '',
    contato: fornecedor?.contato || '',
    prazoEntrega: fornecedor?.prazoEntrega || 7,
    condicoesPagamento: fornecedor?.condicoesPagamento || '30 dias',
    ativo: fornecedor?.ativo ?? true,
    observacoes: fornecedor?.observacoes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (fornecedor) await atualizarFornecedor(fornecedor.id, formData);
      else await criarFornecedor(formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Nome Fantasia" name="nome" value={formData.nome} onChange={handleChange} required size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Razão Social" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Inscrição Estadual" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={8}><TextField fullWidth label="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth label="Número" name="numero" value={formData.numero} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={5}><TextField fullWidth label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={2}><TextField fullWidth select label="UF" name="uf" value={formData.uf} onChange={handleChange} size="small">{ufs.map(uf => (<MenuItem key={uf} value={uf}>{uf}</MenuItem>))}</TextField></Grid>
        <Grid item xs={12} sm={5}><TextField fullWidth label="CEP" name="cep" value={formData.cep} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Contato" name="contato" value={formData.contato} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={3}><TextField fullWidth type="number" label="Prazo (dias)" name="prazoEntrega" value={formData.prazoEntrega} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={3}><TextField fullWidth label="Condições Pagamento" name="condicoesPagamento" value={formData.condicoesPagamento} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Observações" name="observacoes" value={formData.observacoes} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12}><FormControlLabel control={<Switch checked={formData.ativo} onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))} />} label="Ativo" /></Grid>
      </Grid>
      <DialogActions sx={{ mt: 3, px: 0 }}>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : (fornecedor ? 'Atualizar' : 'Cadastrar')}</Button>
      </DialogActions>
    </Box>
  );
};

// ==================== FORMULÁRIO UNIDADE ====================
interface FormUnidadeProps {
  unidade?: UnidadeSaudeType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const FormUnidade: React.FC<FormUnidadeProps> = ({ unidade, onSuccess, onCancel }) => {
  const { criarUnidade, atualizarUnidade } = useUnidadesSaude();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateUnidadeSaudeDTO>({
    nome: unidade?.nome || '',
    tipo: unidade?.tipo || 'UBS',
    codigo: unidade?.codigo || '',
    endereco: unidade?.endereco || '',
    numero: unidade?.numero || '',
    complemento: unidade?.complemento || '',
    bairro: unidade?.bairro || '',
    cidade: unidade?.cidade || '',
    uf: unidade?.uf || 'SP',
    cep: unidade?.cep || '',
    telefone: unidade?.telefone || '',
    email: unidade?.email || '',
    responsavel: unidade?.responsavel || '',
    horarioFuncionamento: unidade?.horarioFuncionamento || '',
    ativo: unidade?.ativo ?? true,
    observacoes: unidade?.observacoes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (unidade) await atualizarUnidade(unidade.id, formData);
      else await criarUnidade(formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}><TextField fullWidth label="Nome da Unidade" name="nome" value={formData.nome} onChange={handleChange} required size="small" /></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth label="Código" name="codigo" value={formData.codigo} onChange={handleChange} required size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth select label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} size="small">{tiposUnidade.map(t => (<MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>))}</TextField></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Responsável" name="responsavel" value={formData.responsavel} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={8}><TextField fullWidth label="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth label="Número" name="numero" value={formData.numero} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={5}><TextField fullWidth label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={2}><TextField fullWidth select label="UF" name="uf" value={formData.uf} onChange={handleChange} size="small">{ufs.map(uf => (<MenuItem key={uf} value={uf}>{uf}</MenuItem>))}</TextField></Grid>
        <Grid item xs={12} sm={5}><TextField fullWidth label="CEP" name="cep" value={formData.cep} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Horário Funcionamento" name="horarioFuncionamento" value={formData.horarioFuncionamento} onChange={handleChange} placeholder="Ex: 07:00 - 19:00" size="small" /></Grid>
        <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Observações" name="observacoes" value={formData.observacoes} onChange={handleChange} size="small" /></Grid>
        <Grid item xs={12}><FormControlLabel control={<Switch checked={formData.ativo} onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))} />} label="Ativo" /></Grid>
      </Grid>
      <DialogActions sx={{ mt: 3, px: 0 }}>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : (unidade ? 'Atualizar' : 'Cadastrar')}</Button>
      </DialogActions>
    </Box>
  );
};

export default Cadastro;