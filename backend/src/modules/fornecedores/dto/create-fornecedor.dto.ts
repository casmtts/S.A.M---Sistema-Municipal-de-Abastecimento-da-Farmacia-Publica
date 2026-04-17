import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateFornecedorDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @IsString()
  cnpj: string;

  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  uf?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contato?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  prazoEntrega?: number;

  @IsOptional()
  @IsString()
  condicoesPagamento?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
