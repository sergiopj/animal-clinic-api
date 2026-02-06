'use strict';
import { Logger } from '../services/Logger';
import mongoose from 'mongoose';

const logger = Logger.getLogger('DbRun');

export class DBConfig {
  static async connectDB() {
    try {
      const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/animalClinic';
      await mongoose.connect(dbUri);
      logger.info('Connection to database has been established successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
    }
  }
}
