import { Inject, Injectable } from '@nestjs/common';

import type { ILogger } from '../../shared/application/logging/logger.interface.js';
import { LOGGER, VETERINARIAN_REPOSITORY } from '../../shared/di/injection-tokens.js';

import type { IVeterinarian } from './veterinarian.entity.js';
import type { VeterinarianModel, VeterinarianWriteModel } from './veterinarian.model.js';
import type { VeterinarianRepositoryPort } from './veterinarian.repository.port.js';

@Injectable()
export class VeterinarianService {
  constructor(
    @Inject(LOGGER) private readonly logger: ILogger,
    @Inject(VETERINARIAN_REPOSITORY)
    private readonly veterinarianRepository: VeterinarianRepositoryPort
  ) {}

  private toModel(veterinarian: IVeterinarian): VeterinarianModel {
    return {
      _id: veterinarian._id.toString(),
      firstName: veterinarian.firstName,
      lastName: veterinarian.lastName,
      licenseNumber: veterinarian.licenseNumber,
      specialties: veterinarian.specialties?.map((specialty) => specialty._id.toString()),
      phone: veterinarian.phone,
      email: veterinarian.email,
      experienceYears: veterinarian.experienceYears,
      clinicId: veterinarian.clinicId.toString(),
      createdAt: veterinarian.createdAt || new Date(),
      updatedAt: veterinarian.updatedAt || new Date(),
    };
  }

  public async getVeterinarians(): Promise<VeterinarianModel[]> {
    this.logger.info('VeterinarianService: Fetching veterinarians');
    const veterinarians = await this.veterinarianRepository.findAll();
    return veterinarians.map((veterinarian) => this.toModel(veterinarian));
  }

  public async getVeterinarianById(id: string): Promise<VeterinarianModel | null> {
    this.logger.info(`VeterinarianService: Fetching veterinarian with id: ${id}`);
    const veterinarian = await this.veterinarianRepository.findById(id);
    return veterinarian ? this.toModel(veterinarian) : null;
  }

  public async addVeterinarian(data: VeterinarianWriteModel): Promise<VeterinarianModel> {
    this.logger.info('VeterinarianService: Adding a veterinarian');
    return this.toModel(await this.veterinarianRepository.create(data));
  }

  public async updateVeterinarian(
    id: string,
    data: VeterinarianWriteModel
  ): Promise<VeterinarianModel | null> {
    this.logger.info(`VeterinarianService: Updating veterinarian with id: ${id}`);
    const veterinarian = await this.veterinarianRepository.update(id, data);
    return veterinarian ? this.toModel(veterinarian) : null;
  }

  public async deleteVeterinarian(id: string): Promise<VeterinarianModel | null> {
    this.logger.info(`VeterinarianService: Deleting veterinarian with id: ${id}`);
    const veterinarian = await this.veterinarianRepository.delete(id);
    return veterinarian ? this.toModel(veterinarian) : null;
  }
}
