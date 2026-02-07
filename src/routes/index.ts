import { Router, Request, Response } from 'express';
import petsRoute from './pets.route';
import swaggerUi from 'swagger-ui-express';
import swaggerSetup from '../docs/swagger';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));
router.use('/pets', petsRoute);
router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Ok');
});

export default router;
