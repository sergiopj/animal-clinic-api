import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestMedicalReportDTO {
  @IsMongoId({ message: 'Veterinarian ID must be a valid MongoDB ObjectId' })
  veterinarianId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Diagnosis is required' })
  diagnosis!: string;

  @IsString()
  @IsNotEmpty({ message: 'Treatment is required' })
  treatment!: string;

  @IsDateString({}, { message: 'Date must be a valid date' })
  @IsOptional()
  date?: string;
}

export class MedicalReportIdParamDTO {
  @IsMongoId({ message: 'Pet ID must be a valid MongoDB ObjectId' })
  id!: string;

  @IsMongoId({ message: 'Medical report ID must be a valid MongoDB ObjectId' })
  reportId!: string;
}
