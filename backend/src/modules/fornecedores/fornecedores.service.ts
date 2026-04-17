import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';

@Injectable()
export class FornecedoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.fornecedor.findMany({
      include: {
        medicamentos: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const fornecedor = await this.prisma.fornecedor.findUnique({
      where: { id },
      include: { medicamentos: true },
    });

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado`);
    }

    return fornecedor;
  }

  async create(createFornecedorDto: CreateFornecedorDto) {
    return this.prisma.fornecedor.create({
      data: createFornecedorDto,
    });
  }

  async update(id: string, updateFornecedorDto: UpdateFornecedorDto) {
    await this.findOne(id);
    return this.prisma.fornecedor.update({
      where: { id },
      data: updateFornecedorDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fornecedor.delete({ where: { id } });
  }
}
