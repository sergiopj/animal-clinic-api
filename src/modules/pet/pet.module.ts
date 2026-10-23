import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PET_REPORT, PET_REPOSITORY } from '../../shared/di/injection-tokens.js';
import { PetPdfReportAdapter } from '../../shared/pdf-render/report/pdf-report.adapter.js';
import { medicalReportSchema } from '../medical-report/medical-report.entity.js';
import { veterinarianSchema } from '../veterinarian/veterinarian.entity.js';

import { MongoPetRepositoryAdapter } from './mongo-pet.repository.adapter.js';
import { PetController } from './pet.controller.js';
import { petSchema } from './pet.entity.js';
import { PetService } from './pet.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Pet', schema: petSchema },
      { name: 'MedicalReport', schema: medicalReportSchema },
      { name: 'Veterinarian', schema: veterinarianSchema },
    ]),
  ],
  controllers: [PetController],
  providers: [
    PetService,
    { provide: PET_REPOSITORY, useClass: MongoPetRepositoryAdapter },
    { provide: PET_REPORT, useClass: PetPdfReportAdapter },
  ],
})
export class PetModule {}
