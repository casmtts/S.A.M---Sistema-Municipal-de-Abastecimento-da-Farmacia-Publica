// src/modules/medicamentos/medicamentos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { UpdateEstoqueDto } from './dto/update-estoque.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('medicamentos')
@UseGuards(JwtAuthGuard)
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  // =============================================
  // 1. PRIMEIRO: Rotas com palavras ESPECÍFICAS
  // =============================================

  @Get('vencer/:dias')
  getProximosVencer(@Param('dias') dias: string) {
    console.log('🟢 Rota /vencer/:dias chamada com dias:', dias);
    return this.medicamentosService.getProximosVencer(parseInt(dias));
  }

  @Get('alertas')
  getAlertas() {
    console.log('🟢 Rota /alertas chamada');
    return this.medicamentosService.getAlertasEstoque();
  }

  @Get('resumo')
  getResumo() {
    console.log('🟢 Rota /resumo chamada');
    return this.medicamentosService.getResumo();
  }

  // =============================================
  // 2. SEGUNDO: Rotas SEM palavras (GET geral)
  // =============================================

  @Get()
  findAll() {
    console.log('🟢 Rota GET / chamada');
    return this.medicamentosService.findAll();
  }

  // =============================================
  // 3. TERCEIRO: Rotas com PARÂMETRO DINÂMICO
  // =============================================

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('🟢 Rota /:id chamada com id:', id);
    return this.medicamentosService.findOne(id);
  }

  // =============================================
  // 4. QUARTO: Rotas POST, PATCH, DELETE
  // =============================================

  @Post()
  create(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    return this.medicamentosService.create(createMedicamentoDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicamentoDto: UpdateMedicamentoDto,
  ) {
    return this.medicamentosService.update(id, updateMedicamentoDto);
  }

  @Patch(':id/estoque')
  updateEstoque(
    @Param('id') id: string,
    @Body() updateEstoqueDto: UpdateEstoqueDto,
  ) {
    return this.medicamentosService.updateEstoque(
      id,
      updateEstoqueDto.quantidade,
      updateEstoqueDto.tipo,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicamentosService.remove(id);
  }
}
