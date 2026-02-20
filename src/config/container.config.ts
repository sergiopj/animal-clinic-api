import 'reflect-metadata';
import { container } from 'tsyringe';
import { ILogger } from '../application/logging/logger.interface.js';
import { Log4jsLogger } from '../application/logging/logger.js';
import { ClinicRepository } from '../repositories/clinic/clinic.repository.js';
import { AIService, ClinicService } from '../services/services.index.js';
import { IClinicRepository } from '../repositories/clinic/interfaces/Clinic.interface.js';

/**
 * Configure Dependency Injection container
 * Registers all application services and dependencies
 */
export function configureContainer(): void {
  // --- Infrastructure ---
  container.register<ILogger>('ILogger', {
    useClass: Log4jsLogger,
  });

  // --- Repositories ---
  container.register<IClinicRepository>('IClinicRepository', ClinicRepository);

  // --- Services ---
  container.register(AIService, { useClass: AIService });
  container.register(ClinicService, { useClass: ClinicService });
}
