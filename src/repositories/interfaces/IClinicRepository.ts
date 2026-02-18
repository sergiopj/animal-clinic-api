import { ClinicDTO } from '../../dtos/clinic.dto.js';

// TODO arreglar anys
export interface IClinicRepository {
    findAll(): Promise<ClinicDTO[]>;
    findById(id: string): Promise<ClinicDTO | null>;
    create(clinicData: any): Promise<ClinicDTO>;
    update(id: string, clinicData: any): Promise<ClinicDTO | null>;
    delete(id: string): Promise<ClinicDTO | null>;
    findVetsByClinicId(clinicId: string): Promise<any[]>;
    findPetsByClinicId(clinicId: string): Promise<any[]>;
}
