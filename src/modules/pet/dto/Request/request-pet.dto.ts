import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsMongoId,
  Min,
} from 'class-validator';

import { PetGenderEnum } from '../../enums/pet-gender.enum.js';
import { PetSpeciesEnum } from '../../enums/pet-species.enum.js';

export class RequestPetDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEnum(PetSpeciesEnum, {
    message: `Species must be one of: ${Object.values(PetSpeciesEnum).join(', ')}`,
  })
  species!: PetSpeciesEnum;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsEnum(PetGenderEnum, {
    message: `Gender must be one of: ${Object.values(PetGenderEnum).join(', ')}`,
  })
  gender!: PetGenderEnum;

  @IsDateString({}, { message: 'Birthdate must be a valid date' })
  birthdate!: Date;

  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0, { message: 'Weight must be a positive number' })
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isVaccinated?: boolean;

  @IsBoolean()
  @IsOptional()
  isSterilized?: boolean;

  @IsMongoId({ message: 'Clinic ID must be a valid MongoDB ObjectId' })
  clinicId!: string;
}

/**
 * DTO for validating MongoDB ObjectId in params
 */
export class PetIdParamDTO {
  @IsMongoId({ message: 'Pet ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Pet ID is required' })
  id!: string;
}
