import { Router } from 'express';
import petsRouter from './pets/pets.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSetup from '../docs/swagger.js';

const router = Router();

// API routes
router.use('/pets', petsRouter);

// Docs
// Note: The healthcheck is now in app.ts
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

export default router;
