import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsDateString,
  IsNumber,
  IsBoolean,
  IsMongoId,
  Min
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PetSpecies } from '../../../../entities/pet/enums/pet-species.enum.js';
import { PetGender } from '../../../../entities/pet/enums/pet-gender.enum.js';

/**
 * DTO for creating a new pet
 */
export class CreatePetDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEnum(PetSpecies, { message: 'Species must be either Dog or Cat' })
  @IsNotEmpty({ message: 'Species is required' })
  species!: PetSpecies;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsEnum(PetGender, { message: 'Gender must be either Male or Female' })
  @IsNotEmpty({ message: 'Gender is required' })
  gender!: PetGender;

  @IsDateString({}, { message: 'Birthdate must be a valid date in ISO format (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Birthdate is required' })
  birthdate!: string;

  @IsNumber()
  @Min(0, { message: 'Weight must be a positive number' })
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : undefined)
  weight?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isVaccinated?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isSterilized?: boolean;

  @IsMongoId({ message: 'Clinic ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Clinic ID is required' })
  clinicId!: string;
}

/**
 * DTO for updating an existing pet (all fields optional except ID)
 */
export class UpdatePetDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(PetSpecies, { message: 'Species must be either Dog or Cat' })
  @IsOptional()
  species?: PetSpecies;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsEnum(PetGender, { message: 'Gender must be either Male or Female' })
  @IsOptional()
  gender?: PetGender;

  @IsDateString({}, { message: 'Birthdate must be a valid date in ISO format (YYYY-MM-DD)' })
  @IsOptional()
  birthdate?: string;

  @IsNumber()
  @Min(0, { message: 'Weight must be a positive number' })
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : undefined)
  weight?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isVaccinated?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isSterilized?: boolean;

  @IsMongoId({ message: 'Clinic ID must be a valid MongoDB ObjectId' })
  @IsOptional()
  clinicId?: string;
}

/**
 * DTO for validating MongoDB ObjectId in params
 */
export class PetIdParamDTO {
  @IsMongoId({ message: 'Pet ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Pet ID is required' })
  id!: string;
}
