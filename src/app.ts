import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import apiRouter from './shared/routes/routes.index.js';
import swaggerSpec from './shared/documentation/swagger.js';
import { configureContainer } from './shared/config/container.config.js';
import { errorHandler } from './shared/middlewares/errors/errors.index.js';

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

// TODO proteger rutas con autenticación y autorización (JWT, OAuth2, etc) ojo con ver historiales clinicos de otras clinicas, solo lo podra ver la entidad superior superadmin clinica padre de todas las clinicas, y cada clinica solo podra ver su propio historial clinico, no el de otras clinicas, ni el de la entidad superior superadmin
// TODO implementar rate limiting para proteger contra ataques de denegación de servicio (DoS)
// TODO agregar pruebas unitarias y de integración con Jest y Supertest
// TODO configurar CI/CD para despliegue automático en plataformas como Heroku, AWS, etc.

export { app };
