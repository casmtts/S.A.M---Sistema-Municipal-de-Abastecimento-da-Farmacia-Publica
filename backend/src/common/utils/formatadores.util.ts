export const formatadores = {
  // Formatar data para DD/MM/YYYY
  data: (data: Date | string): string => {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  },

  // Formatar moeda para R$ X.XXX,XX
  moeda: (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  },

  // Formatar CPF
  cpf: (cpf: string): string => {
    if (!cpf) return '';
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length !== 11) return cpf;
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  // Formatar telefone
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
