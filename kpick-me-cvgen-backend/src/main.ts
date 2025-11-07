import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  await app.listen(process.env.PORT || 3001);
}
bootstrap();

// ===== auth/strategies/jwt.strategy.ts =====


// ===== user/user.entity.ts =====


// ===== user/user.module.ts =====


// ===== cv/cv.entity.ts =====


// ===== cv/cv.controller.ts =====


// ===== cv/cv.service.ts =====


// ===== cv/dto/cv.dto.ts =====


// ===== cv/cv.module.ts =====


// ===== interview/interview.entity.ts =====


// ===== interview/interview.controller.ts =====


// ===== interview/interview.service.ts =====


// ===== interview/interview.module.ts =====


// ===== training/training-progress.entity.ts =====


// ===== training/training.controller.ts =====


// ===== training/training.service.ts =====


// ===== training/training.module.ts =====