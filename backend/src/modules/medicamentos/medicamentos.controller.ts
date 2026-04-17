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
import { UpdateEstoqueDto } from './dto/update-medicamento.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('medicamentos')
@UseGuards(RolesGuard)
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  @Get()
  findAll() {
    return this.medicamentosService.findAll();
  }

  @Get('alertas')
  getAlertas() {
    return this.medicamentosService.getAlertasEstoque();
  }

  @Get('vencer/:dias')
  getProximosVencer(@Param('dias') dias: string) {
    return this.medicamentosService.getProximosVencer(parseInt(dias));
  }

  @Get('resumo')
  getResumo() {
    return this.medicamentosService.getResumo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicamentosService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FARMACEUTICO)
  create(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    return this.medicamentosService.create(createMedicamentoDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.FARMACEUTICO)
  update(
    @Param('id') id: string,
    @Body() updateMedicamentoDto: UpdateMedicamentoDto,
  ) {
    return this.medicamentosService.update(id, updateMedicamentoDto);
  }

  @Patch(':id/estoque')
  @Roles(UserRole.ADMIN, UserRole.FARMACEUTICO, UserRole.ATENDENTE)
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
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.medicamentosService.remove(id);
  }
}
