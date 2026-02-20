import type { IClinic } from "../../../entities/clinic/Clinic.entity.js";
import type { IPet } from "../../../entities/pet/Pet.entity.js";
import type { IVet } from "../../../entities/veterinarian/Veterinarian.entity.js";

export interface IClinicRepository {
    findAll(): Promise<IClinic[]>;
    findById(id: string): Promise<IClinic | null>;
    create(clinicData: Partial<IClinic>): Promise<IClinic>;
    update(id: string, clinicData: Partial<IClinic>): Promise<IClinic | null>;
    delete(id: string): Promise<IClinic | null>;
    findVeterinariansByClinicId(clinicId: string): Promise<IVet[]>;
    findPetsByClinicId(clinicId: string): Promise<IPet[]>;
}
