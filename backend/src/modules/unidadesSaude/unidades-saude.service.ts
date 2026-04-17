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

  async findAll() {
    return this.prisma.unidadeSaude.findMany({
      orderBy: { nome: 'asc' },
    });
  }

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

  async findByCodigo(codigo: string) {
    return this.prisma.unidadeSaude.findUnique({
      where: { codigo },
    });
  }

  async findAtivas() {
    return this.prisma.unidadeSaude.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findByTipo(tipo: string) {
    return this.prisma.unidadeSaude.findMany({
      where: {
        tipo: tipo as any,
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async create(createUnidadeDto: CreateUnidadeDto) {
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

  async update(id: string, updateUnidadeDto: UpdateUnidadeDto) {
    await this.findOne(id);

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

  async toggleStatus(id: string, ativo: boolean) {
    await this.findOne(id);

    return this.prisma.unidadeSaude.update({
      where: { id },
      data: { ativo },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.unidadeSaude.delete({
      where: { id },
    });
  }

  async getResumo() {
    const total = await this.prisma.unidadeSaude.count();
    const ativas = await this.prisma.unidadeSaude.count({
      where: { ativo: true },
    });

    const porTipo = await this.prisma.unidadeSaude.groupBy({
      by: ['tipo'],
      _count: {
        id: true,
      },
      where: {
        ativo: true,
      },
    });

    return {
      total,
      ativas,
      inativas: total - ativas,
      porTipo: porTipo.map((item) => ({
        tipo: item.tipo,
        quantidade: item._count.id,
      })),
    };
  }
}
