import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import type { AuthenticatedUser } from '../../shared/auth/auth.types.js';
import { UserRole } from '../../shared/auth/auth.types.js';
import { USER_REPOSITORY } from '../../shared/di/injection-tokens.js';

import type { CreateUserRecord, UserRepositoryPort } from './user.repository.port.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort
  ) {}

  async onModuleInit(): Promise<void> {
    const email = process.env.AUTH_BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.AUTH_BOOTSTRAP_ADMIN_PASSWORD;

    if (!email && !password) return;
    if (!email || !password || password.length < 12) {
      throw new Error(
        'Set both AUTH_BOOTSTRAP_ADMIN_EMAIL and AUTH_BOOTSTRAP_ADMIN_PASSWORD (12+ characters)'
      );
    }

    if (await this.users.findByEmail(email)) return;

    await this.users.create({
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: UserRole.PLATFORM_ADMIN,
      clinicId: null,
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; tokenType: 'Bearer'; expiresIn: number }> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      clinicId: user.clinicId?.toString() ?? null,
    };

    const accessToken = await this.jwtService.signAsync({
      sub: authenticatedUser.id,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      clinicId: authenticatedUser.clinicId,
    });

    return { accessToken, tokenType: 'Bearer', expiresIn: 900 };
  }

  async createClinicUser(input: {
    email: string;
    password: string;
    role: UserRole.CLINIC_ADMIN | UserRole.CLINIC_USER;
    clinicId: string;
  }): Promise<{ id: string; email: string; role: UserRole; clinicId: string }> {
    const email = input.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    const record: CreateUserRecord = {
      email,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: input.role,
      clinicId: input.clinicId,
    };
    const user = await this.users.create(record);

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      clinicId: user.clinicId!.toString(),
    };
  }
}
