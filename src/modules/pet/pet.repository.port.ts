import type {
  CursorPaginationParams,
  CursorPaginatedResponse,
  PaginatedResponse,
  PaginationParams,
} from '../../shared/utils/pagination/pagination.util.js';

import type { IPet } from './pet.entity.js';
import type { PetGenderEnum, PetSpeciesEnum } from './pet.index.js';

export interface PetFilters {
  name?: string;
  species?: PetSpeciesEnum;
  gender?: PetGenderEnum;
}

export interface PetRepositoryPort {
  findAll(): Promise<IPet[]>;
  findById(id: string, clinicId?: string): Promise<IPet | null>;
  findByIdAndPopulate(id: string, clinicId?: string): Promise<IPet | null>;
  create(petData: Partial<IPet>): Promise<IPet>;
  update(id: string, petData: Partial<IPet>, clinicId?: string): Promise<IPet | null>;
  delete(id: string, clinicId?: string): Promise<IPet | null>;
  findPetsByClinicId(clinicId: string): Promise<IPet[]>;
  findWithPagination(
    params: PaginationParams,
    filters?: PetFilters,
    clinicId?: string
  ): Promise<PaginatedResponse<IPet>>;
  findWithCursorPagination(
    params: CursorPaginationParams,
    filters?: PetFilters,
    clinicId?: string
  ): Promise<CursorPaginatedResponse<IPet>>;
  countDocuments(filters?: PetFilters, clinicId?: string): Promise<number>;
}
