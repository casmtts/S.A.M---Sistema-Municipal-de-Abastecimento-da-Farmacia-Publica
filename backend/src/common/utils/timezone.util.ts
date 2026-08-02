import moment from 'moment-timezone';

// Configurar timezone padrão para Brasília
moment.tz.setDefault('America/Sao_Paulo');

export const timezone = {
  // Obter data atual no horário de Brasília
  agora: (): Date => {
    return moment().toDate();
  },

  // Formatar data para DD/MM/YYYY
  formatarData: (data?: Date): string => {
    if (!data) return moment().format('DD/MM/YYYY');
    return moment(data).format('DD/MM/YYYY');
  },

  // Formatar hora para HH:MM
  formatarHora: (data?: Date): string => {
    if (!data) return moment().format('HH:mm');
    return moment(data).format('HH:mm');
  },

  // Formatar data e hora completas
  formatarDataHora: (data?: Date): string => {
    if (!data) return moment().format('DD/MM/YYYY HH:mm:ss');
    return moment(data).format('DD/MM/YYYY HH:mm:ss');
  },

  // Obter string para nome de arquivo
  getDataArquivo: (): string => {
    return moment().format('DD-MM-YYYY_HH-mm');
  },

  // Obter data e hora atuais (para exibição)
  getDataHoraAtual: (): { data: string; hora: string } => {
    return {
      data: moment().format('DD/MM/YYYY'),
      hora: moment().format('HH:mm'),
    };
  },
};