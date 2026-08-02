import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  Min,
  IsNotEmpty,
} from 'class-validator';

export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
  DISPENSA = 'DISPENSA',
}

export class CreateMovimentacaoDto {
  @IsUUID()
  @IsNotEmpty()
  medicamentoId: string;

  @IsEnum(TipoMovimentacao)
  tipo: TipoMovimentacao;

  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsOptional()
  @IsString()
  documentoReferencia?: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsUUID()
  unidadeOrigemId?: string;

  @IsOptional()
  @IsUUID()
  unidadeDestinoId?: string;
}
