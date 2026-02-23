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
import { PetSpecies } from '../../enums/pet-species.enum.js';
import { PetGender } from '../../enums/pet-gender.enum.js';

export class RequestPetDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEnum(PetSpecies, { message: `Species must be one of: ${Object.values(PetSpecies).join(', ')}` })
  species!: PetSpecies;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsEnum(PetGender, { message: `Gender must be one of: ${Object.values(PetGender).join(', ')}` })
  gender!: PetGender;

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
