import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUrl } from 'class-validator';

export class RequestClinicDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address!: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  phone!: string;

  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'VAT number is required' })
  vatNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'License number is required' })
  licenseNumber!: string;

  @IsUrl({}, { message: 'Website must be a valid URL' })
  @IsOptional()
  website?: string;
}

export class ClinicIdParamDTO {
  @IsString()
  @IsNotEmpty({ message: 'Clinic ID is required' })
  id!: string;
}
