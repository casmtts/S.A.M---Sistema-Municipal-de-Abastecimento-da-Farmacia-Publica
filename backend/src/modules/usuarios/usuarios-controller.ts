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
import { UsuariosService } from './usuarios-service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('usuarios')
@UseGuards(RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // ========== ROTAS ESPECÍFICAS (PRIMEIRO) ==========

  @Get('ativos')
  @Roles(UserRole.ADMIN)
  findAtivos() {
    return this.usuariosService.findAtivos();
  }

  @Get('resumo')
  @Roles(UserRole.ADMIN)
  getResumo() {
    return this.usuariosService.getResumo();
  }

  @Get('role/:role')
  @Roles(UserRole.ADMIN)
  findByRole(@Param('role') role: string) {
    return this.usuariosService.findByRole(role);
  }

  @Get('unidade/:unidadeId')
  @Roles(UserRole.ADMIN)
  findByUnidade(@Param('unidadeId') unidadeId: string) {
    return this.usuariosService.findByUnidade(unidadeId);
  }

  // ========== ROTAS SEM PARÂMETROS ==========

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
  }

  // ========== ROTAS COM PARÂMETRO ==========

  @Get('cpf/:cpf')
  @Roles(UserRole.ADMIN)
  findByCpf(@Param('cpf') cpf: string) {
    return this.usuariosService.findByCpf(cpf);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  // ========== ROTAS POST, PATCH, DELETE ==========

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch(':id/toggle')
  @Roles(UserRole.ADMIN)
  toggleStatus(@Param('id') id: string, @Body('ativo') ativo: boolean) {
    return this.usuariosService.toggleStatus(id, ativo);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
