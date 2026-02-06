import "reflect-metadata"
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import petsRoute from './routes/pets.route';
import swaggerUi from 'swagger-ui-express';
import swaggerSetup from './docs/swagger';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.FRONT_HOST || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// TODO llevar a otro fichero
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));
app.use('/pets', petsRoute);
app.get('/health', (req: Request, res: Response) => {
    console.log('testtstsst')
    res.status(200).send('Ok');
});

export default app;
