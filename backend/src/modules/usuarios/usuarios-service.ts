import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Listar todos os usuários (sem senha)
   */
  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        ativo: true,
        telefone: true,
        cargo: true,
        unidadeId: true,
        ultimoAcesso: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Buscar usuário por ID (sem senha)
   */
  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        ativo: true,
        telefone: true,
        cargo: true,
        unidadeId: true,
        ultimoAcesso: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return usuario;
  }

  /**
   * Buscar usuário por email (com senha - apenas para autenticação)
   */
  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  /**
   * Buscar usuário por CPF (sem senha)
   */
  async findByCpf(cpf: string) {
    return this.prisma.usuario.findUnique({
      where: { cpf },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        ativo: true,
        telefone: true,
        cargo: true,
        unidadeId: true,
        ultimoAcesso: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Buscar usuários por unidade
   */
  async findByUnidade(unidadeId: string) {
    return this.prisma.usuario.findMany({
      where: { unidadeId, ativo: true },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        telefone: true,
        cargo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Buscar usuários por papel/role
   */
  async findByRole(role: string) {
    return this.prisma.usuario.findMany({
      where: { role: role as any, ativo: true },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cargo: true,
        unidadeId: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Buscar usuários ativos
   */
  async findAtivos() {
    return this.prisma.usuario.findMany({
      where: { ativo: true },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        telefone: true,
        cargo: true,
        unidadeId: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Criar novo usuário
   */
  async create(createUsuarioDto: CreateUsuarioDto) {
    // Verificar se já existe usuário com mesmo email ou CPF
    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ email: createUsuarioDto.email }, { cpf: createUsuarioDto.cpf }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email ou CPF já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        ativo: true,
        telefone: true,
        cargo: true,
        unidadeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return usuario;
  }

  /**
   * Atualizar usuário
   */
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);

    // Se estiver atualizando email ou CPF, verificar duplicidade
    if (updateUsuarioDto.email || updateUsuarioDto.cpf) {
      const existingUser = await this.prisma.usuario.findFirst({
        where: {
          OR: [
            { email: updateUsuarioDto.email },
            { cpf: updateUsuarioDto.cpf },
          ],
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException(
          'Email ou CPF já cadastrado por outro usuário',
        );
      }
    }

    const data: any = { ...updateUsuarioDto };
    if (updateUsuarioDto.senha) {
      data.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        ativo: true,
        telefone: true,
        cargo: true,
        unidadeId: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Atualizar último acesso
   */
  async updateUltimoAcesso(id: string) {
    return this.prisma.usuario.update({
      where: { id },
      data: { ultimoAcesso: new Date() },
      select: {
        id: true,
        nome: true,
        email: true,
        ultimoAcesso: true,
      },
    });
  }

  /**
   * Ativar/Desativar usuário
   */
  async toggleStatus(id: string, ativo: boolean) {
    await this.findOne(id);

    return this.prisma.usuario.update({
      where: { id },
      data: { ativo },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Remover usuário
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.usuario.delete({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  }

  /**
   * Resumo estatístico dos usuários
   */
  async getResumo() {
    const total = await this.prisma.usuario.count();
    const ativos = await this.prisma.usuario.count({ where: { ativo: true } });
    const inativos = total - ativos;

    const porRole = await this.prisma.usuario.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });

    const ultimosAcessos = await this.prisma.usuario.findMany({
      where: {
        ultimoAcesso: {
          not: null,
        },
      },
      select: {
        nome: true,
        email: true,
        role: true,
        ultimoAcesso: true,
      },
      orderBy: { ultimoAcesso: 'desc' },
      take: 5,
    });

    return {
      total,
      ativos,
      inativos,
      porRole: porRole.map((item) => ({
        role: item.role,
        quantidade: item._count.id,
      })),
      ultimosAcessos,
    };
  }
}
