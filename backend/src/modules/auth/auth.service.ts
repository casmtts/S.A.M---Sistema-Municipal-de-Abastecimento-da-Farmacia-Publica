import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcesso: new Date() },
    });

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ email: registerDto.email }, { cpf: registerDto.cpf }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email ou CPF já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: registerDto.nome,
        email: registerDto.email,
        cpf: registerDto.cpf,
        senha: hashedPassword,
        role: registerDto.role || 'ATENDENTE',
        telefone: registerDto.telefone,
        cargo: registerDto.cargo,
      },
    });

    // Retorna o usuário sem a senha
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...result } = usuario;
    return result;
  }
}
