import { IsEmail, IsEnum, IsMongoId, IsString, MinLength } from 'class-validator';

import { UserRole } from '../../../shared/auth/auth.types.js';

export class CreateClinicUserDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(12)
  password!: string;

  @IsEnum([UserRole.CLINIC_ADMIN, UserRole.CLINIC_USER])
  role!: UserRole.CLINIC_ADMIN | UserRole.CLINIC_USER;

  @IsMongoId()
  clinicId!: string;
}
