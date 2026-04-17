import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicamentoDto } from './create-medicamento.dto';
import { IsNumber, IsEnum, Min } from 'class-validator';

export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

export class UpdateMedicamentoDto extends PartialType(CreateMedicamentoDto) {}

export class UpdateEstoqueDto {
  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsEnum(TipoMovimentacao)
  tipo: TipoMovimentacao;
}
