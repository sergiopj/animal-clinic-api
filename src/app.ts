import "reflect-metadata";
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { container } from 'tsyringe';

import apiRouter from './routes/index.js';
import { ILogger } from './application/interfaces/ILogger.js';
import { Log4jsLogger } from './application/logging/log4js.logger.js';
import { AIService, PetService, ClinicService, VetService } from './services/index.js';
import { IClinicRepository, ClinicRepository } from './repositories/index.js';

dotenv.config();

// --- DI Container Setup ---
container.register<ILogger>('ILogger', {
  useClass: Log4jsLogger
});
container.register<IClinicRepository>('IClinicRepository', {
  useClass: ClinicRepository
});
container.register(AIService, { useClass: AIService });
container.register(PetService, { useClass: PetService });
container.register(ClinicService, { useClass: ClinicService });
container.register(VetService, { useClass: VetService });

const app = express();

// --- Middlewares ---
app.use(helmet());
app.use(cors({ origin: process.env.FRONT_HOST || 'http://localhost:4200' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// --- API Routes ---
app.use('/api/', apiRouter);

// --- Health Check ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// --- 404 Handler ---
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// TODO: Implement a proper global error handler
// app.use(errorHandler);

export { app };
