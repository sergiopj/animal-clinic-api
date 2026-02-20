import { injectable } from 'tsyringe';
import Clinic from '../../entities/clinic/Clinic.entity.js';
import Vet from '../../entities/veterinarian/Veterinarian.entity.js';
import Pet from '../../entities/pet/Pet.entity.js';
import type { IClinic } from '../../entities/clinic/Clinic.entity.js';
import type { IVet } from '../../entities/veterinarian/Veterinarian.entity.js';
import type { IPet } from '../../entities/pet/Pet.entity.js';
import { IClinicRepository } from './interfaces/Clinic.interface.js';

@injectable()
export class ClinicRepository implements IClinicRepository {

    // TODO implementar filters y paginación y countDocuments para paginación  
    
    public async findAll(): Promise<IClinic[]> {
        const clinics = await Clinic.find()
            .populate('veterinarians')
            .populate('pets')
            .exec();
        return clinics as IClinic[];
    }

    public async findById(id: string): Promise<IClinic | null> {
        const clinic = await Clinic.findById(id)
            .populate('veterinarians')
            .populate('pets')
            .exec();
        return clinic as IClinic | null;
    }

    public async create(clinicData: Partial<IClinic>): Promise<IClinic> {
        const clinic = new Clinic(clinicData);
        const savedClinic = await clinic.save();
        return savedClinic as IClinic;
    }

    public async update(id: string, clinicData: Partial<IClinic>): Promise<IClinic | null> {
        const updatedClinic = await Clinic.findByIdAndUpdate(id, clinicData, { new: true })
            .populate('veterinarians')
            .populate('pets')
            .exec();
        return updatedClinic as IClinic | null;
    }

    public async delete(id: string): Promise<IClinic | null> {
        const deletedClinic = await Clinic.findByIdAndDelete(id).exec();
        return deletedClinic as IClinic | null;
    }

    public async findVeterinariansByClinicId(clinicId: string): Promise<IVet[]> {
        const vets = await Vet.find({ clinicId }).exec();
        return vets as IVet[];
    }

    public async findPetsByClinicId(clinicId: string): Promise<IPet[]> {
        const pets = await Pet.find({ clinicId }).exec();
        return pets as IPet[];
    }
}
