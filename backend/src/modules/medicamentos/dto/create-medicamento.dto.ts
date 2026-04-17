import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicamentoDto {
  @IsString()
  nome: string;

  @IsString()
  principioAtivo: string;

  @IsOptional()
  @IsString()
  concentracao?: string;

  @IsOptional()
  @IsString()
  formaFarmaceutica?: string;

  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @IsOptional()
  @IsString()
  lote?: string;

  @Type(() => Date)
  @IsDate()
  validade: Date;

  @IsNumber()
  @Min(0)
  quantidadeAtual: number;

  @IsNumber()
  @Min(0)
  quantidadeMinima: number;

  @IsNumber()
  @Min(0)
  quantidadeMaxima: number;

  @IsNumber()
  @Min(0)
  precoUnitario: number;

  @IsOptional()
  @IsUUID()
  fornecedorId?: string;
}
