import type { IClinic } from "../clinic.entity.js";
import type { IPet } from "../../pet/pet.entity.js";
import type { IVeterinarian } from "../../veterinarian/veterinarian.entity.js";
import type { PaginationParams, CursorPaginationParams, PaginatedResponse, CursorPaginatedResponse } from "../../../shared/utils/pagination/pagination.util.js";

export interface ClinicFilters {
    name?: string;
    city?: string;
    country?: string;
    isActive?: boolean;
}

export interface IClinicRepository {
    findAll(): Promise<IClinic[]>;
    findById(id: string): Promise<IClinic | null>;
    create(clinicData: Partial<IClinic>): Promise<IClinic>;
    update(id: string, clinicData: Partial<IClinic>): Promise<IClinic | null>;
    delete(id: string): Promise<IClinic | null>;
    findVeterinariansByClinicId(clinicId: string): Promise<IVeterinarian[]>;
    findPetsByClinicId(clinicId: string): Promise<IPet[]>;    
    findWithPagination(params: PaginationParams, filters?: ClinicFilters): Promise<PaginatedResponse<IClinic>>;
    findWithCursorPagination(params: CursorPaginationParams, filters?: ClinicFilters): Promise<CursorPaginatedResponse<IClinic>>;
    countDocuments(filters?: ClinicFilters): Promise<number>;
}
