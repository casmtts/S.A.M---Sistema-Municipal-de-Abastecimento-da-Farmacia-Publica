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
import { UnidadesSaudeService } from './unidades-saude.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('unidades-saude')
@UseGuards(RolesGuard)
export class UnidadesSaudeController {
  constructor(private readonly unidadesSaudeService: UnidadesSaudeService) {}

  @Get()
  findAll() {
    return this.unidadesSaudeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesSaudeService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUnidadeDto: CreateUnidadeDto) {
    return this.unidadesSaudeService.create(createUnidadeDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUnidadeDto: UpdateUnidadeDto) {
    return this.unidadesSaudeService.update(id, updateUnidadeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.unidadesSaudeService.remove(id);
  }
}
