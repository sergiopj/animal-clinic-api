import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import type { ILogger } from '../../shared/application/logging/logger.interface.js';
import { LOGGER, PET_REPORT, PET_REPOSITORY } from '../../shared/di/injection-tokens.js';
import {
  PaginatedResponseDTO,
  CursorPaginatedResponseDTO,
} from '../../shared/utils/pagination/paginated-response.dto.js';
import {
  PaginationParams,
  CursorPaginationParams,
} from '../../shared/utils/pagination/pagination.util.js';

import { PetQueryParams } from './dto/Request/query-pet.dto.js';
import { ResponsePetDTO } from './dto/Response/response-pet.dto.js';
import { PetReportPort } from './pet-report.port.js';
import { IPet } from './pet.entity.js';
import { PetGenderEnum, PetSpeciesEnum } from './pet.index.js';
import { PetFilters, PetRepositoryPort } from './pet.repository.port.js';

@Injectable()
export class PetService {
  constructor(
    @Inject(LOGGER) private logger: ILogger,
    @Inject(PET_REPOSITORY) private petRepository: PetRepositoryPort,
    @Inject(PET_REPORT) private petReport: PetReportPort
  ) {}

  private toResponseDTO(pet: IPet): ResponsePetDTO {
    return {
      _id: pet._id.toString(),
      name: pet.name,
      breed: pet.breed,
      species: pet.species,
      gender: pet.gender,
      birthdate: pet.birthdate,
      weight: pet.weight,
      color: pet.color,
      notes: pet.notes,
      isVaccinated: pet.isVaccinated,
      isSterilized: pet.isSterilized,
      clinicId: pet.clinicId.toString(),
      createdAt: pet.createdAt || new Date(),
      updatedAt: pet.updatedAt || new Date(),
    };
  }

  private toResponseWithClinicalHistoryDTO(pet: IPet): ResponsePetDTO {
    const petDTO = this.toResponseDTO(pet);
    if (pet.medicalReport && pet.medicalReport.length > 0) {
      petDTO.medicalReport = pet.medicalReport.map((report) => {
        if (report.veterinarianId instanceof Types.ObjectId) {
          throw new Error('Medical report veterinarian was not populated');
        }
        const reportDTO = {
          ...report.toObject(),
          _id: report._id.toString(),
          petId: report.petId.toString(),
          clinicId: report.clinicId.toString(),
          veterinarianId: {
            ...report.veterinarianId.toObject(),
            _id: report.veterinarianId._id.toString(),
          },
        };
        return reportDTO;
      });
    }
    return petDTO;
  }

  public async getPetById(id: string, clinicId?: string): Promise<ResponsePetDTO | null> {
    this.logger.info(`PetService: Fetching pet with id: ${id}`);
    const pet = await this.petRepository.findById(id, clinicId);
    if (!pet) return null;
    return this.toResponseDTO(pet);
  }

  public async getPetWithClinicalHistory(
    id: string,
    clinicId?: string
  ): Promise<ResponsePetDTO | null> {
    this.logger.info(`PetService: Fetching pet with clinical history for id: ${id}`);
    const pet = await this.petRepository.findByIdAndPopulate(id, clinicId);
    if (!pet) return null;
    return this.toResponseWithClinicalHistoryDTO(pet);
  }

  public async generateClinicalHistoryReport(
    id: string,
    clinicId?: string
  ): Promise<Buffer | null> {
    const pet = await this.getPetWithClinicalHistory(id, clinicId);
    if (!pet) return null;
    return this.petReport.generateReport(pet);
  }

  public async addPet(petData: IPet, clinicId?: string): Promise<ResponsePetDTO> {
    this.logger.info('PetService: Adding a new pet');
    const scopedPetData = clinicId
      ? { ...petData, clinicId: new Types.ObjectId(clinicId) }
      : petData;
    const created = await this.petRepository.create(scopedPetData as Partial<IPet>);
    return this.toResponseDTO(created);
  }

  public async updatePet(
    id: string,
    petData: IPet,
    clinicId?: string
  ): Promise<ResponsePetDTO | null> {
    this.logger.info(`PetService: Updating pet with id: ${id}`);
    const scopedPetData = clinicId
      ? { ...petData, clinicId: new Types.ObjectId(clinicId) }
      : petData;
    const updated = await this.petRepository.update(id, scopedPetData as Partial<IPet>, clinicId);
    if (!updated) return null;
    return this.toResponseDTO(updated);
  }

  public async deletePet(id: string, clinicId?: string): Promise<ResponsePetDTO | null> {
    this.logger.info(`PetService: Deleting pet with id: ${id}`);
    const deleted = await this.petRepository.delete(id, clinicId);
    if (!deleted) return null;
    return this.toResponseDTO(deleted);
  }

  public async getPetsByClinicId(clinicId: string): Promise<IPet[]> {
    this.logger.info(`PetService: Fetching pets for clinic with id: ${clinicId}`);
    return this.petRepository.findPetsByClinicId(clinicId);
  }

  private extractFiltersFromQuery(query: PetQueryParams): PetFilters {
    const filters: PetFilters = {};

    if (query.name) filters.name = query.name as string;
    if (query.species) filters.species = query.species as PetSpeciesEnum;
    if (query.gender) filters.gender = query.gender as PetGenderEnum;

    return filters;
  }

  public async getPets(
    query: PetQueryParams,
    clinicId?: string
  ): Promise<PaginatedResponseDTO<ResponsePetDTO> | CursorPaginatedResponseDTO<ResponsePetDTO>> {
    const filters = this.extractFiltersFromQuery(query);
    const hasCursor = query.cursor !== undefined;

    if (hasCursor) {
      this.logger.info('PetService: Using cursor-based pagination');
      return this.getCursorPaginatedPets(query, filters, clinicId);
    } else {
      this.logger.info('PetService: Using offset-based pagination');
      return this.getPaginatedPets(query, filters, clinicId);
    }
  }

  private async getPaginatedPets(
    query: PetQueryParams,
    filters?: PetFilters,
    clinicId?: string
  ): Promise<PaginatedResponseDTO<ResponsePetDTO>> {
    const params: PaginationParams = {
      page: query.page ? (typeof query.page === 'number' ? query.page : parseInt(query.page)) : 1,
      limit: query.limit
        ? Math.min(100, typeof query.limit === 'number' ? query.limit : parseInt(query.limit))
        : 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    };

    this.logger.info('PetService: Fetching pets with pagination', { params, filters });

    const result = await this.petRepository.findWithPagination(params, filters, clinicId);

    return {
      data: result.data.map((pet) => this.toResponseDTO(pet)),
      pagination: result.pagination,
    };
  }

  private async getCursorPaginatedPets(
    query: PetQueryParams,
    filters?: PetFilters,
    clinicId?: string
  ): Promise<CursorPaginatedResponseDTO<ResponsePetDTO>> {
    const params: CursorPaginationParams = {
      cursor: query.cursor || '',
      limit: query.limit
        ? Math.min(100, typeof query.limit === 'number' ? query.limit : parseInt(query.limit))
        : 10,
      sortBy: query.sortBy || '_id',
      sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    };

    this.logger.info('PetService: Fetching pets with cursor pagination', { params, filters });

    const result = await this.petRepository.findWithCursorPagination(params, filters, clinicId);

    let total: number | undefined;
    if (params.cursor === undefined || params.cursor === '') {
      total = await this.petRepository.countDocuments(filters, clinicId);
    }

    return {
      data: result.data.map((pet) => this.toResponseDTO(pet)),
      pagination: {
        ...result.pagination,
        total,
      },
    };
  }
}
