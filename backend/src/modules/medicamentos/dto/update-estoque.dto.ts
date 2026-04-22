import { IsNumber, IsEnum, Min } from 'class-validator';

export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

export class UpdateEstoqueDto {
  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsEnum(TipoMovimentacao)
  tipo: TipoMovimentacao;
}
