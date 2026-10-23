export enum UserRole {
  PLATFORM_ADMIN = 'platform_admin',
  CLINIC_ADMIN = 'clinic_admin',
  CLINIC_USER = 'clinic_user',
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  clinicId: string | null;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  clinicId: string | null;
}
