import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VETERINARIAN_REPOSITORY } from '../../shared/di/injection-tokens.js';
import { specialtySchema } from '../specialty/specialty.entity.js';

import { MongoVeterinarianRepositoryAdapter } from './mongo-veterinarian.repository.adapter.js';
import { VeterinarianController } from './veterinarian.controller.js';
import { veterinarianSchema } from './veterinarian.entity.js';
import { VeterinarianService } from './veterinarian.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Veterinarian', schema: veterinarianSchema },
      { name: 'Specialty', schema: specialtySchema },
    ]),
  ],
  controllers: [VeterinarianController],
  providers: [
    VeterinarianService,
    { provide: VETERINARIAN_REPOSITORY, useClass: MongoVeterinarianRepositoryAdapter },
  ],
})
export class VeterinarianModule {}
