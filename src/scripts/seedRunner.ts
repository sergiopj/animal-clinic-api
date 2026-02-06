import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const runLatestSeed = async () => {
  try {
    const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/animalClinic';
    await mongoose.connect(dbUri);
    console.log('Connected to database for seeding...');

    const seedsDir = path.join(__dirname, 'seeds');
    
    // Check if directory exists
    if (!fs.existsSync(seedsDir)) {
      console.error(`Seeds directory not found at ${seedsDir}`);
      process.exit(1);
    }

    // Get all files in the seeds directory
    const files = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
      .sort(); // Sort alphabetically to get the latest based on naming convention (e.g., 001, 002)

    if (files.length === 0) {
      console.log('No seed files found.');
      await mongoose.disconnect();
      return;
    }

    const latestSeedFile = files[files.length - 1];
    console.log(`Found latest seed file: ${latestSeedFile}`);

    // Import and run the seed function
    const seedModule = await import(path.join(seedsDir, latestSeedFile));
    
    if (seedModule.seed && typeof seedModule.seed === 'function') {
      await seedModule.seed();
    } else {
      console.error(`File ${latestSeedFile} does not export a 'seed' function.`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from database.');
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
};

runLatestSeed();
