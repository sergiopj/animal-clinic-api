import { connectDB, disconnectDB } from '../config/database.config.js';
import { seed } from './seeds/001_initial_seed.js';

const runSeed = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();
    
    console.log('Running seed...');
    await seed();
    
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

runSeed();
