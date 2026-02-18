import {injectable, inject} from 'tsyringe';
import {ILogger} from '../application/interfaces/ILogger.js';
import { ClinicDTO } from '../dtos/clinic.dto.js';
import { IClinicRepository } from '../repositories/interfaces/IClinicRepository.js';

@injectable()
export class ClinicService {
    constructor(
        @inject('ILogger') private logger: ILogger,
        @inject('IClinicRepository') private clinicRepository: IClinicRepository
    ) {}

    public async getAllClinics(): Promise<ClinicDTO[]> {
        this.logger.info('ClinicService: Fetching all clinics');
        // Ahora veterinarians y pets vienen automáticamente con populate
        return this.clinicRepository.findAll();
    }

    public async getClinicById(id: string): Promise<any | null> {
        this.logger.info(`ClinicService: Fetching clinic with id: ${id}`);
        // Ahora veterinarians y pets vienen automáticamente con populate
        return this.clinicRepository.findById(id);
    }

    public async addClinic(clinicData: any): Promise<any> {
        this.logger.info('ClinicService: Adding a new clinic');
        return this.clinicRepository.create(clinicData);
    }

    public async updateClinic(id: string, clinicData: any): Promise<any | null> {
        this.logger.info(`ClinicService: Updating clinic with id: ${id}`);
        return this.clinicRepository.update(id, clinicData);
    }

    public async deleteClinic(id: string): Promise<any | null> {
        this.logger.info(`ClinicService: Deleting clinic with id: ${id}`);
        return this.clinicRepository.delete(id);
    }
}
