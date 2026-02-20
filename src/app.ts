import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import apiRouter from './routes/routes.index.js';
import swaggerSpec from './documentation/swagger.js';
import { configureContainer } from './config/container.config.js';
import { errorHandler } from './middlewares/errors/errors.index.js';

dotenv.config();

// Dependency Injection Container Setup
configureContainer();

const app = express();

// --- Middlewares ---
app.use(helmet());
app.use(cors({ origin: process.env.FRONT_HOST || 'http://localhost:4200' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/', apiRouter);

// --- Health Check ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

export { app };
