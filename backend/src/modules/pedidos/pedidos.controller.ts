import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('pedidos')
@UseGuards(RolesGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get('pendentes')
  getPendentes() {
    return this.pedidosService.getPedidosPendentes();
  }

  @Get('atrasados')
  getAtrasados() {
    return this.pedidosService.getPedidosAtrasados();
  }

  @Get('resumo')
  getResumo() {
    return this.pedidosService.getResumo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FARMACEUTICO, UserRole.GESTOR)
  create(@Body() createPedidoDto: CreatePedidoDto, @Request() req) {
    return this.pedidosService.create(createPedidoDto, req.user.id);
  }

  @Patch(':id/aprovar')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  aprovar(@Param('id') id: string, @Request() req) {
    return this.pedidosService.aprovar(id, req.user.id);
  }

  @Patch(':id/entregar')
  @Roles(UserRole.ADMIN, UserRole.FARMACEUTICO)
  registrarEntrega(
    @Param('id') id: string,
    @Body('quantidade') quantidade: number,
  ) {
    return this.pedidosService.registrarEntrega(id, quantidade);
  }

  @Patch(':id/cancelar')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  cancelar(@Param('id') id: string, @Body('motivo') motivo: string) {
    return this.pedidosService.cancelar(id, motivo);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(id);
  }
}
