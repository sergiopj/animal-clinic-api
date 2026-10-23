import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CLINIC_REPORT, CLINIC_REPOSITORY } from '../../shared/di/injection-tokens.js';
import { ClinicPdfReportAdapter } from '../../shared/pdf-render/report/pdf-report.adapter.js';
import { petSchema } from '../pet/pet.entity.js';
import { veterinarianSchema } from '../veterinarian/veterinarian.entity.js';

import { ClinicController } from './clinic.controller.js';
import { clinicSchema } from './clinic.entity.js';
import { ClinicService } from './clinic.service.js';
import { MongoClinicRepositoryAdapter } from './mongo-clinic.repository.adapter.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Clinic', schema: clinicSchema },
      { name: 'Veterinarian', schema: veterinarianSchema },
      { name: 'Pet', schema: petSchema },
    ]),
  ],
  controllers: [ClinicController],
  providers: [
    ClinicService,
    { provide: CLINIC_REPOSITORY, useClass: MongoClinicRepositoryAdapter },
    { provide: CLINIC_REPORT, useClass: ClinicPdfReportAdapter },
  ],
})
export class ClinicModule {}
