import { Router } from 'express';
import clinicRouter from '../../modules/clinic/clinic.router.js';

const router = Router();

router.use(clinicRouter);

export default router;
