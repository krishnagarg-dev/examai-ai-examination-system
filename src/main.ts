import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 5000;

  await app.listen(port, '0.0.0.0');

  console.log(`ExamAI backend running on port ${port}`);
}

bootstrap();