import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const getMongoUri = (): string => {
  const user = process.env.DB_USER || 'admin';
  const password = process.env.DB_PASSWORD || 'admin';
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '27017';
  const dbName = process.env.DB_NAME || 'animalClinic';

  return `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`;
};

export const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();
    await mongoose.connect(mongoUri);
    console.log('Connection to MongoDB has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('Connection to MongoDB has been closed.');
};

export default mongoose;
