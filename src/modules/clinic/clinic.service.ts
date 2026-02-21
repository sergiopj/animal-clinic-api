import {injectable, inject} from 'tsyringe';
import {ILogger} from '../../shared/application/logging/logger.interface.js';
import { IClinicRepository } from './interfaces/Clinic.interface.js';
import type { IClinic } from './clinic.entity.js';
import { ResponseClinicDTO } from './dto/Response/response-clinic.dto.js';

@injectable()
export class ClinicService {
    constructor(
        @inject('ILogger') private logger: ILogger,
        @inject('IClinicRepository') private clinicRepository: IClinicRepository
    ) {}

    /**
     * Maps IClinic entity to ResponseClinicDTO, excluding internal fields like __v
     */
    private toResponseDTO(clinic: IClinic): ResponseClinicDTO {
        return {
            _id: (clinic as any)._id.toString(),
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
            updatedAt: clinic.updatedAt || new Date()
        };
    }

    public async getAllClinics(): Promise<ResponseClinicDTO[]> {
        this.logger.info('ClinicService: Fetching all clinics');
        const clinics = await this.clinicRepository.findAll();
        return clinics.map(clinic => this.toResponseDTO(clinic));
    }

    public async getClinicById(id: string): Promise<ResponseClinicDTO | null> {
        this.logger.info(`ClinicService: Fetching clinic with id: ${id}`);
        const clinic = await this.clinicRepository.findById(id);
        if (!clinic) return null;
        return this.toResponseDTO(clinic);
    }

    public async addClinic(clinicData: IClinic): Promise<ResponseClinicDTO> {
        this.logger.info('ClinicService: Adding a new clinic');
        const created = await this.clinicRepository.create(clinicData as Partial<IClinic>);
        return this.toResponseDTO(created);
    }

    public async updateClinic(id: string, clinicData: IClinic): Promise<ResponseClinicDTO | null> {
        this.logger.info(`ClinicService: Updating clinic with id: ${id}`);
        const updated = await this.clinicRepository.update(id, clinicData as Partial<IClinic>);
        if (!updated) return null;
        return this.toResponseDTO(updated);
    }

    public async deleteClinic(id: string): Promise<ResponseClinicDTO | null> {
        this.logger.info(`ClinicService: Deleting clinic with id: ${id}`);
        const deleted = await this.clinicRepository.delete(id);
        if (!deleted) return null;
        return this.toResponseDTO(deleted);
    }

    // TODO corregir anys
    public async getVeterinariansByClinicId(clinicId: string): Promise<any[]> {
        this.logger.info(`ClinicService: Fetching veterinarians for clinic with id: ${clinicId}`);
        return this.clinicRepository.findVeterinariansByClinicId(clinicId);
    }

    public async getPetsByClinicId(clinicId: string): Promise<any[]> {
        this.logger.info(`ClinicService: Fetching pets for clinic with id: ${clinicId}`);
        return this.clinicRepository.findPetsByClinicId(clinicId);  
        
    }

}
