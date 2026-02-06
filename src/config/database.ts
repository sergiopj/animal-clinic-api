import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    dialect: 'postgres',
    logging: false,
  }
);

// Los modelos se registrarán en Sequelize cuando se importen por primera vez
// en cualquier parte de la aplicación. No es necesario importarlos aquí.

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgresSQL has been established successfully.');
    
    // Importar los modelos y asociaciones JUSTO ANTES de sincronizar
    // Esto asegura que Sequelize los conozca antes de intentar crear las tablas.
    await import('../database/models/clinic.model.js');
    await import('../database/models/veterinarian.model.js');
    await import('../database/models/pet.model.js');
    await import('../database/models/associations.js');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
    await sequelize.close();
    console.log('Connection to PostgresSQL has been closed.');
}

export default sequelize;
