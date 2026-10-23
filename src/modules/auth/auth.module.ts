import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { USER_REPOSITORY } from '../../shared/di/injection-tokens.js';
import { clinicSchema } from '../clinic/clinic.entity.js';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { MongoUserRepositoryAdapter } from './mongo-user.repository.adapter.js';
import { userSchema } from './user.entity.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret || secret.length < 32) {
          throw new Error('JWT_SECRET must be configured with at least 32 characters');
        }
        return { secret, signOptions: { expiresIn: '15m' } };
      },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Clinic', schema: clinicSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    MongoUserRepositoryAdapter,
    { provide: USER_REPOSITORY, useExisting: MongoUserRepositoryAdapter },
  ],
  exports: [AuthService],
})
export class AuthModule {}
