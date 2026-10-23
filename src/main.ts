import 'reflect-metadata';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppModule } from './app.module.js';
import { ValidationError } from './shared/middlewares/errors/app-error.js';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const port = Number(process.env.PORT || 3000);

  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.enableCors({ origin: process.env.FRONT_HOST || 'http://localhost:4200' });
  app.enableShutdownHooks();
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new ValidationError(
          'Validation failed',
          errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
            value: error.value,
          }))
        ),
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Animal Clinic API')
    .setDescription('API for managing clinics, pets, and veterinarians')
    .setVersion('1.0.0')
    .addTag('Clinics')
    .addTag('Pets')
    .addTag('Veterinarians')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error(
    error instanceof Error ? error.stack || error.message : String(error),
    undefined,
    'Bootstrap'
  );
  process.exitCode = 1;
});
