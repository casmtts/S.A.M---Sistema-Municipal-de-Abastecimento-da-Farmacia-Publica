import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export enum TipoRelatorio {
  MEDICAMENTOS = 'MEDICAMENTOS',
  PEDIDOS = 'PEDIDOS',
  MOVIMENTACOES = 'MOVIMENTACOES',
  FORNECEDORES = 'FORNECEDORES',
  UNIDADES = 'UNIDADES',
  USUARIOS = 'USUARIOS',
}

export enum FormatoRelatorio {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
}

export class RelatorioOptionsDto {
  @IsEnum(TipoRelatorio)
  tipo: TipoRelatorio;

  @IsEnum(FormatoRelatorio)
  formato: FormatoRelatorio;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
