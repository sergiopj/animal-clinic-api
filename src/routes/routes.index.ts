import { Router } from 'express';
import clinicRouter from './clinic/clinic.router.js';
// import vetRouter from './vet/vet.router.js';
// import petRouter from './pet/pet.router.js';

const router = Router();

// --- Module Routes ---
router.use('/', clinicRouter);
// router.use('/', vetRouter);
// router.use('/', petRouter);

export default router;
