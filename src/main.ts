import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust proxy so that X-Forwarded-* headers are available (Railway, Vercel, etc.)
  const server = app.getHttpAdapter().getInstance();
  // If using express, set trust proxy so req.protocol and x-forwarded-* headers are correct
  if (server && typeof server.set === 'function') {
    server.set('trust proxy', true);
  }

  const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = rawOrigins.split(',').map((origin) => origin.trim()).filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy: Origin not allowed'), false);
    },
    credentials: true,
  });

  console.log('Allowed CORS origins:', allowedOrigins);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
