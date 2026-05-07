export const formatadores = {
  // Formatar data para DD/MM/YYYY
  data: (data: Date | string): string => {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  },

  // Formatar data e hora
  dataHora: (data: Date | string): string => {
    const d = new Date(data);
    return d.toLocaleString('pt-BR');
  },

  // Formatar hora
  hora: (data: Date | string): string => {
    const d = new Date(data);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  },

  // Data para nome de arquivo
  dataArquivo: (): string => {
    const hoje = new Date();
    return `${hoje.getDate().toString().padStart(2, '0')}-${(hoje.getMonth() + 1).toString().padStart(2, '0')}-${hoje.getFullYear()}`;
  },

  // Hora para nome de arquivo
  horaArquivo: (): string => {
    const hoje = new Date();
    return `${hoje.getHours().toString().padStart(2, '0')}-${hoje.getMinutes().toString().padStart(2, '0')}`;
  },

  // Obter data e hora atual formatada
  getDataHoraAtual: (): { data: string; hora: string } => {
    const agora = new Date();
    return {
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  },

  // Moeda brasileira
  moeda: (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  },

  // CPF
  cpf: (cpf: string): string => {
    if (!cpf) return '';
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length !== 11) return cpf;
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  // Telefone
  telefone: (telefone: string): string => {
    if (!telefone) return '';
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  },
};