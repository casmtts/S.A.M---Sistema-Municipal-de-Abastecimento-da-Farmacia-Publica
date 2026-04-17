import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://s-a-m-sistema-municipal-de-abasteci.vercel.app/',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ IMPORTANTE: Usar a porta fornecida pelo Render
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // ← '0.0.0.0' é essencial!

  console.log(`🚀 Servidor rodando na porta ${port}`);
}
bootstrap();
