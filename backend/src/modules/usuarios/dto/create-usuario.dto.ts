import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUsuarioDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  cpf: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  telefone?: string;

  @IsOptional()
  cargo?: string;

  @IsOptional()
  unidadeId?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
