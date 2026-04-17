import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoDto {
  @IsUUID()
  @IsNotEmpty()
  medicamentoId: string;

  @IsNumber()
  @Min(1)
  quantidadeSolicitada: number;

  @Type(() => Date)
  @IsDate()
  dataPrevistaEntrega: Date;

  @IsOptional()
  @IsString()
  justificativa?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
