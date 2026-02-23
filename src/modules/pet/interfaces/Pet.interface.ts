import type { IPet } from "../pet.entity.js";
import type { PaginationParams, CursorPaginationParams, PaginatedResponse, CursorPaginatedResponse } from "../../../shared/utils/pagination/pagination.util.js";
import { PetGenderEnum, PetSpeciesEnum } from "../pet.index.js";

export interface PetFilters {
    name?: string;
    species?: PetSpeciesEnum;
    gender?: PetGenderEnum;
}

export interface IPetRepository {
    findAll(): Promise<IPet[]>;
    findById(id: string): Promise<IPet | null>;
    findByIdAndPopulate(id: string): Promise<IPet | null>;
    create(petData: Partial<IPet>): Promise<IPet>;
    update(id: string, petData: Partial<IPet>): Promise<IPet | null>;
    delete(id: string): Promise<IPet | null>;
    findPetsByClinicId(clinicId: string): Promise<IPet[]>;
    findWithPagination(params: PaginationParams, filters?: PetFilters): Promise<PaginatedResponse<IPet>>;
    findWithCursorPagination(params: CursorPaginationParams, filters?: PetFilters): Promise<CursorPaginatedResponse<IPet>>;
    countDocuments(filters?: PetFilters): Promise<number>;
}
