import { injectable } from 'tsyringe';
import { IClinicRepository } from './interfaces/IClinicRepository.js';
import Clinic from '../models/entities/Clinic.js';
import Vet from '../models/entities/Vet.js';
import Pet from '../models/entities/Pet.js';
import type { IClinic } from '../models/entities/Clinic.js';
import type { ClinicDTO } from '../dtos/clinic.dto.js';

@injectable()
export class ClinicRepository implements IClinicRepository {
    
    public async findAll(): Promise<ClinicDTO[]> {
        const clinics = await Clinic.find()
            .populate('veterinarians')
            .populate('pets')
            .exec();
        return clinics.map((clinic: IClinic) => {
            return {
                _id: clinic._id.toString(),
                name: clinic.name,
                address: clinic.address,
                phone: clinic.phone,
                email: clinic.email,
                website: clinic.website,
                vatNumber: clinic.vatNumber,
                licenseNumber: clinic.licenseNumber,
                veterinarians: clinic.veterinarians,
                pets: clinic.pets,
                createdAt: clinic.createdAt,
                updatedAt: clinic.updatedAt
            } as ClinicDTO;
        });
    }

    public async findById(id: string): Promise<ClinicDTO | null> {
        const clinic = await Clinic.findById(id)
            .populate('veterinarians')
            .populate('pets')
            .exec();
        if (!clinic) {
            return null;
        }
        return {
            _id: clinic._id.toString(),
            name: clinic.name,
            address: clinic.address,
            phone: clinic.phone,
            email: clinic.email,
            website: clinic.website,
            vatNumber: clinic.vatNumber,
            licenseNumber: clinic.licenseNumber,
            veterinarians: clinic.veterinarians,
            pets: clinic.pets,
            createdAt: clinic.createdAt,
            updatedAt: clinic.updatedAt
        } as ClinicDTO;    
    }

    public async create(clinicData: any): Promise<ClinicDTO> {
        const clinic = new Clinic(clinicData);
        const savedClinic = await clinic.save();
        return {
            _id: savedClinic._id.toString(),
            name: savedClinic.name,
            address: savedClinic.address,
            phone: savedClinic.phone,
            email: savedClinic.email,
            website: savedClinic.website,
            vatNumber: savedClinic.vatNumber,
            licenseNumber: savedClinic.licenseNumber,
            veterinarians: [],
            pets: [],
            createdAt: savedClinic.createdAt,
            updatedAt: savedClinic.updatedAt
        } as ClinicDTO;       
    }

    public async update(id: string, clinicData: any): Promise<ClinicDTO | null> {
        const updatedClinic = await Clinic.findByIdAndUpdate(id, clinicData, { new: true })
            .populate('veterinarians')
            .populate('pets')
            .exec();
        if (!updatedClinic) {
            return null;
        }
        return {
            _id: updatedClinic._id.toString(),
            name: updatedClinic.name,
            address: updatedClinic.address,
            phone: updatedClinic.phone,
            email: updatedClinic.email,
            website: updatedClinic.website,
            vatNumber: updatedClinic.vatNumber,
            licenseNumber: updatedClinic.licenseNumber,
            veterinarians: updatedClinic.veterinarians,
            pets: updatedClinic.pets,
            createdAt: updatedClinic.createdAt,
            updatedAt: updatedClinic.updatedAt
        } as ClinicDTO;       
    }

    public async delete(id: string): Promise<ClinicDTO | null> {
        const deletedClinic = await Clinic.findByIdAndDelete(id).exec();
        if (!deletedClinic) {
            return null;
        }
        return {
            _id: deletedClinic._id.toString(),
            name: deletedClinic.name,
            address: deletedClinic.address,
            phone: deletedClinic.phone,
            email: deletedClinic.email,            
            website: deletedClinic.website,
            vatNumber: deletedClinic.vatNumber,
            licenseNumber: deletedClinic.licenseNumber,
            createdAt: deletedClinic.createdAt,
            updatedAt: deletedClinic.updatedAt
        } as ClinicDTO;        
    }

    // TODO quitar los anys cuando esten las entidades de veterinarios y mascotas
    public async findVetsByClinicId(clinicId: string): Promise<any[]> {
        const vets = await Vet.find({ clinicId }).exec();
        return vets.map((vet: any) => vet.toObject());
    }

    public async findPetsByClinicId(clinicId: string): Promise<any[]> {
        const pets = await Pet.find({ clinicId }).exec();
        return pets.map((pet: any) => pet.toObject());
    }
}
