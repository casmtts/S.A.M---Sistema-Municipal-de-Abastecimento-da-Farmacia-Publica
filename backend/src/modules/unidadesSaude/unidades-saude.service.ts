import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';

@Injectable()
export class UnidadesSaudeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Buscar todas as unidades de saúde
   */
  async findAll() {
    return this.prisma.unidadeSaude.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Buscar unidade por ID
   */
  async findOne(id: string) {
    const unidade = await this.prisma.unidadeSaude.findUnique({
      where: { id },
    });

    if (!unidade) {
      throw new NotFoundException(
        `Unidade de saúde com ID ${id} não encontrada`,
      );
    }

    return unidade;
  }

  /**
   * Buscar unidade por código
   */
  async findByCodigo(codigo: string) {
    return this.prisma.unidadeSaude.findUnique({
      where: { codigo },
    });
  }

  /**
   * Buscar unidades ativas
   */
  async findAtivas() {
    return this.prisma.unidadeSaude.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Buscar unidades por tipo
   */
  async findByTipo(tipo: string) {
    return this.prisma.unidadeSaude.findMany({
      where: {
        tipo: tipo as any,
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Buscar unidades por cidade
   */
  async findByCidade(cidade: string) {
    return this.prisma.unidadeSaude.findMany({
      where: {
        cidade: {
          contains: cidade,
          mode: 'insensitive',
        },
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Criar nova unidade de saúde
   */
  async create(createUnidadeDto: CreateUnidadeDto) {
    // Verificar se já existe unidade com o mesmo código
    const existingUnidade = await this.findByCodigo(createUnidadeDto.codigo);

    if (existingUnidade) {
      throw new ConflictException(
        `Já existe uma unidade de saúde com o código ${createUnidadeDto.codigo}`,
      );
    }

    return this.prisma.unidadeSaude.create({
      data: {
        ...createUnidadeDto,
        ativo: createUnidadeDto.ativo ?? true,
      },
    });
  }

  /**
   * Atualizar unidade de saúde
   */
  async update(id: string, updateUnidadeDto: UpdateUnidadeDto) {
    await this.findOne(id);

    // Se estiver atualizando o código, verificar duplicidade
    if (updateUnidadeDto.codigo) {
      const existingUnidade = await this.findByCodigo(updateUnidadeDto.codigo);
      if (existingUnidade && existingUnidade.id !== id) {
        throw new ConflictException(
          `Já existe uma unidade de saúde com o código ${updateUnidadeDto.codigo}`,
        );
      }
    }

    return this.prisma.unidadeSaude.update({
      where: { id },
      data: updateUnidadeDto,
    });
  }

  /**
   * Ativar/Desativar unidade
   */
  async toggleStatus(id: string, ativo: boolean) {
    await this.findOne(id);

    return this.prisma.unidadeSaude.update({
      where: { id },
      data: { ativo },
    });
  }

  /**
   * Remover unidade de saúde
   */
  async remove(id: string) {
    await this.findOne(id);

    // Verificar se a unidade tem usuários vinculados
    const usuarios = await this.prisma.usuario.findMany({
      where: { unidadeId: id },
    });

    if (usuarios.length > 0) {
      throw new ConflictException(
        `Não é possível excluir a unidade pois existem ${usuarios.length} usuários vinculados a ela`,
      );
    }

    return this.prisma.unidadeSaude.delete({ where: { id } });
  }

  /**
   * Resumo estatístico das unidades
   */
  async getResumo() {
    const total = await this.prisma.unidadeSaude.count();
    const ativas = await this.prisma.unidadeSaude.count({
      where: { ativo: true },
    });
    const inativas = total - ativas;

    const porTipo = await this.prisma.unidadeSaude.groupBy({
      by: ['tipo'],
      _count: {
        id: true,
      },
      where: {
        ativo: true,
      },
    });

    const porCidade = await this.prisma.unidadeSaude.groupBy({
      by: ['cidade', 'uf'],
      _count: {
        id: true,
      },
      where: {
        ativo: true,
      },
      orderBy: {
        cidade: 'asc',
      },
    });

    return {
      total,
      ativas,
      inativas,
      porTipo: porTipo.map((item) => ({
        tipo: item.tipo,
        quantidade: item._count.id,
      })),
      porCidade: porCidade.map((item) => ({
        cidade: item.cidade || 'Não informada',
        uf: item.uf,
        quantidade: item._count.id,
      })),
    };
  }
}
