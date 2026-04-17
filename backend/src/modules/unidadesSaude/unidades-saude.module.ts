import { Module } from '@nestjs/common';
import { UnidadesSaudeService } from './unidades-saude.service';
import { UnidadesSaudeController } from './unidades-saude.controller';

@Module({
  controllers: [UnidadesSaudeController],
  providers: [UnidadesSaudeService],
  exports: [UnidadesSaudeService],
})
export class UnidadesSaudeModule {}
