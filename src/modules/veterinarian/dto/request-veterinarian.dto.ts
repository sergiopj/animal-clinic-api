import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RequestVeterinarianDTO {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber!: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  specialties?: string[];

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  email!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  experienceYears?: number;

  @IsMongoId()
  clinicId!: string;
}

export class VeterinarianIdParamDTO {
  @IsMongoId()
  @IsNotEmpty()
  id!: string;
}
