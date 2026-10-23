import { Inject, Injectable } from '@nestjs/common';

import type { ILogger } from '../../shared/application/logging/logger.interface.js';
import { CLINIC_REPORT, CLINIC_REPOSITORY, LOGGER } from '../../shared/di/injection-tokens.js';
import {
  PaginatedResponseDTO,
  CursorPaginatedResponseDTO,
} from '../../shared/utils/pagination/paginated-response.dto.js';
import {
  PaginationParams,
  CursorPaginationParams,
} from '../../shared/utils/pagination/pagination.util.js';
import type { IPet } from '../pet/pet.entity.js';
import type { IVeterinarian } from '../veterinarian/veterinarian.entity.js';

import { ClinicReportPort } from './clinic-report.port.js';
import type { IClinic } from './clinic.entity.js';
import { ClinicFilters, ClinicRepositoryPort } from './clinic.repository.port.js';
import { ClinicQueryParams } from './dto/Request/query-clinic.dto.js';
import { ResponseClinicDTO } from './dto/Response/response-clinic.dto.js';

@Injectable()
export class ClinicService {
  constructor(
    @Inject(LOGGER) private logger: ILogger,
    @Inject(CLINIC_REPOSITORY) private clinicRepository: ClinicRepositoryPort,
    @Inject(CLINIC_REPORT) private clinicReport: ClinicReportPort
  ) {}

  private toResponseDTO(clinic: IClinic): ResponseClinicDTO {
    return {
      _id: clinic._id.toString(),
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      email: clinic.email,
      website: clinic.website,
      vatNumber: clinic.vatNumber || '',
      licenseNumber: clinic.licenseNumber,
      veterinarians: clinic.veterinarians,
      pets: clinic.pets,
      createdAt: clinic.createdAt || new Date(),
      updatedAt: clinic.updatedAt || new Date(),
    };
  }

  public async getClinicById(id: string): Promise<ResponseClinicDTO | null> {
    this.logger.info(`ClinicService: Fetching clinic with id: ${id}`);
    const clinic = await this.clinicRepository.findById(id);
    if (!clinic) return null;
    return this.toResponseDTO(clinic);
  }

  public async addClinic(clinicData: Partial<IClinic>): Promise<ResponseClinicDTO> {
    this.logger.info('ClinicService: Adding a new clinic');
    const created = await this.clinicRepository.create(clinicData);
    return this.toResponseDTO(created);
  }

  public async updateClinic(
    id: string,
    clinicData: Partial<IClinic>
  ): Promise<ResponseClinicDTO | null> {
    this.logger.info(`ClinicService: Updating clinic with id: ${id}`);
    const updated = await this.clinicRepository.update(id, clinicData);
    if (!updated) return null;
    return this.toResponseDTO(updated);
  }

  public async deleteClinic(id: string): Promise<ResponseClinicDTO | null> {
    this.logger.info(`ClinicService: Deleting clinic with id: ${id}`);
    const deleted = await this.clinicRepository.delete(id);
    if (!deleted) return null;
    return this.toResponseDTO(deleted);
  }

  public async generateClinicReport(id: string): Promise<Buffer | null> {
    const clinic = await this.getClinicById(id);
    if (!clinic) return null;
    return this.clinicReport.generateReport(clinic);
  }

  // TODO corregir anys
  public async getVeterinariansByClinicId(clinicId: string): Promise<IVeterinarian[]> {
    this.logger.info(`ClinicService: Fetching veterinarians for clinic with id: ${clinicId}`);
    return this.clinicRepository.findVeterinariansByClinicId(clinicId);
  }

  public async getPetsByClinicId(clinicId: string): Promise<IPet[]> {
    this.logger.info(`ClinicService: Fetching pets for clinic with id: ${clinicId}`);
    return this.clinicRepository.findPetsByClinicId(clinicId);
  }

  private extractFiltersFromQuery(query: ClinicQueryParams): ClinicFilters {
    const filters: ClinicFilters = {};

    if (query.name) filters.name = query.name as string;
    if (query.city) filters.city = query.city as string;
    if (query.country) filters.country = query.country as string;
    if (query.isActive !== undefined) filters.isActive = query.isActive === 'true';

    return filters;
  }

  public async getClinics(
    query: ClinicQueryParams
  ): Promise<
    PaginatedResponseDTO<ResponseClinicDTO> | CursorPaginatedResponseDTO<ResponseClinicDTO>
  > {
    const filters = this.extractFiltersFromQuery(query);
    const hasCursor = query.cursor !== undefined;

    if (hasCursor) {
      this.logger.info('ClinicService: Using cursor-based pagination');
      return this.getCursorPaginatedClinics(query, filters);
    } else {
      this.logger.info('ClinicService: Using offset-based pagination');
      return this.getPaginatedClinics(query, filters);
    }
  }

  private async getPaginatedClinics(
    query: ClinicQueryParams,
    filters?: ClinicFilters
  ): Promise<PaginatedResponseDTO<ResponseClinicDTO>> {
    const params: PaginationParams = {
      page: query.page ? (typeof query.page === 'number' ? query.page : parseInt(query.page)) : 1,
      limit: query.limit
        ? Math.min(100, typeof query.limit === 'number' ? query.limit : parseInt(query.limit))
        : 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    };

    this.logger.info('ClinicService: Fetching clinics with pagination', { params, filters });

    const result = await this.clinicRepository.findWithPagination(params, filters);

    return {
      data: result.data.map((clinic) => this.toResponseDTO(clinic)),
      pagination: result.pagination,
    };
  }

  private async getCursorPaginatedClinics(
    query: ClinicQueryParams,
    filters?: ClinicFilters
  ): Promise<CursorPaginatedResponseDTO<ResponseClinicDTO>> {
    const params: CursorPaginationParams = {
      cursor: query.cursor || '',
      limit: query.limit
        ? Math.min(100, typeof query.limit === 'number' ? query.limit : parseInt(query.limit))
        : 10,
      sortBy: query.sortBy || '_id',
      sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    };

    this.logger.info('ClinicService: Fetching clinics with cursor pagination', { params, filters });

    const result = await this.clinicRepository.findWithCursorPagination(params, filters);

    let total: number | undefined;
    if (params.cursor === undefined || params.cursor === '') {
      total = await this.clinicRepository.countDocuments(filters);
    }

    return {
      data: result.data.map((clinic) => this.toResponseDTO(clinic)),
      pagination: {
        ...result.pagination,
        total,
      },
    };
  }
}
