import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AiModule } from './modules/ai/ai.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ClinicModule } from './modules/clinic/clinic.module.js';
import { HealthController } from './modules/health/health.controller.js';
import { PetModule } from './modules/pet/pet.module.js';
import { VeterinarianModule } from './modules/veterinarian/veterinarian.module.js';
import { LoggerModule } from './shared/application/logging/logger.module.js';
import { JwtAuthGuard } from './shared/auth/jwt-auth.guard.js';
import { RolesGuard } from './shared/auth/roles.guard.js';
import { getMongoUri } from './shared/config/database.config.js';
import { ApiExceptionFilter } from './shared/middlewares/errors/api-exception.filter.js';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoUri()),
    AuthModule,
    LoggerModule,
    AiModule,
    ClinicModule,
    PetModule,
    VeterinarianModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
