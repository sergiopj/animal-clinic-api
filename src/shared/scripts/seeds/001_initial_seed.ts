import Clinic from '../../../modules/clinic/clinic.entity.js';
import { PetGenderEnum } from '../../../modules/pet/enums/pet-gender.enum.js';
import { PetSpeciesEnum } from '../../../modules/pet/enums/pet-species.enum.js';
import Pet from '../../../modules/pet/pet.entity.js';
import Vet from '../../../modules/veterinarian/veterinarian.entity.js';

export const seed = async () => {
  // 1. Crear o obtener Clínica
  let clinic = await Clinic.findOne({ licenseNumber: 'CL-2023-001' });
  if (!clinic) {
    clinic = await Clinic.create({
      name: 'Animal Clinic Central',
      address: 'Calle Principal 123, Madrid',
      phone: '+34 912 345 678',
      email: 'contacto@animalclinic.com',
      website: 'https://www.animalclinic.com',
      vatNumber: 'ESB12345678',
      licenseNumber: 'CL-2023-001',
    });
  }
  console.log('Clinic created or found.');

  const clinicId = clinic._id;

  // 2. Crear o obtener Veterinarios
  let vet1 = await Vet.findOne({ licenseNumber: 'VET-001' });
  if (!vet1) {
    vet1 = await Vet.create({
      firstName: 'Juan',
      lastName: 'Pérez',
      licenseNumber: 'VET-001',
      email: 'juan.perez@clinic.com',
      experienceYears: 12,
      phone: '+34 912 345 679',
      clinicId: clinicId,
    });
  }

  let vet2 = await Vet.findOne({ licenseNumber: 'VET-002' });
  if (!vet2) {
    vet2 = await Vet.create({
      firstName: 'Ana',
      lastName: 'García',
      licenseNumber: 'VET-002',
      email: 'ana.garcia@clinic.com',
      experienceYears: 8,
      phone: '+34 912 345 680',
      clinicId: clinicId,
    });
  }
  console.log('Veterinarians created or found.');

  // 3. Crear o obtener Mascotas
  let pet1 = await Pet.findOne({ name: 'Max', clinicId: clinicId });
  if (!pet1) {
    pet1 = await Pet.create({
      name: 'Max',
      species: PetSpeciesEnum.Dog,
      gender: PetGenderEnum.Male,
      birthdate: new Date('2020-01-15'),
      clinicId: clinicId,
    });
  }

  let pet2 = await Pet.findOne({ name: 'Luna', clinicId: clinicId });
  if (!pet2) {
    pet2 = await Pet.create({
      name: 'Luna',
      species: PetSpeciesEnum.Cat,
      gender: PetGenderEnum.Female,
      birthdate: new Date('2021-05-20'),
      clinicId: clinicId,
    });
  }
  console.log('Pets created or found.');
};
