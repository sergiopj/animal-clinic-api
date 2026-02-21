import type { IClinic } from "../clinic.entity.js";
import type { IPet } from "../../pet/pet.entity.js";
import type { IVeterinarian } from "../../veterinarian/veterinarian.entity.js";

export interface IClinicRepository {
    findAll(): Promise<IClinic[]>;
    findById(id: string): Promise<IClinic | null>;
    create(clinicData: Partial<IClinic>): Promise<IClinic>;
    update(id: string, clinicData: Partial<IClinic>): Promise<IClinic | null>;
    delete(id: string): Promise<IClinic | null>;
    findVeterinariansByClinicId(clinicId: string): Promise<IVeterinarian[]>;
    findPetsByClinicId(clinicId: string): Promise<IPet[]>;
}
