import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRole } from '../../shared/auth/auth.types.js';
import type { AccessTokenPayload, AuthenticatedUser } from '../../shared/auth/auth.types.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be configured with at least 32 characters');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: AccessTokenPayload): AuthenticatedUser {
    if (
      !payload.sub ||
      !payload.email ||
      !Object.values(UserRole).includes(payload.role) ||
      (payload.role !== UserRole.PLATFORM_ADMIN &&
        (!payload.clinicId || !Types.ObjectId.isValid(payload.clinicId)))
    ) {
      throw new UnauthorizedException('Invalid access token');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      clinicId: payload.clinicId,
    };
  }
}
