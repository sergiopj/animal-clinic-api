import Clinic from '../../entities/clinic/Clinic.entity.js';
import Vet from '../../entities/veterinarian/Veterinarian.entity.js';
import Pet from '../../entities/pet/Pet.entity.js';
import { PetGender } from '../../entities/pet/enums/pet-gender.enum.js';
import { PetSpecies } from '../../entities/pet/enums/pet-species.enum.js';

export const seed = async () => {
  // 1. Crear o obtener Clínica
  let clinic = await Clinic.findOne({ licenseNumber: 'CL-2023-001' });
  if (!clinic) {
    clinic = await Clinic.create({
      name: 'Animal Clinic Central',
      address: 'Calle Principal 123, Madrid',
      phone: '+34 912 345 678',
      email: 'contacto@animalclinic.com',
      licenseNumber: 'CL-2023-001'
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
      clinicId: clinicId
    });
  }

  let vet2 = await Vet.findOne({ licenseNumber: 'VET-002' });
  if (!vet2) {
    vet2 = await Vet.create({
      firstName: 'Ana',
      lastName: 'García',
      licenseNumber: 'VET-002',
      email: 'ana.garcia@clinic.com',
      clinicId: clinicId
    });
  }
  console.log('Veterinarians created or found.');

  // 3. Crear o obtener Mascotas
  let pet1 = await Pet.findOne({ name: 'Max', clinicId: clinicId });
  if (!pet1) {
    pet1 = await Pet.create({
      name: 'Max',
      species: PetSpecies.Dog,
      gender: PetGender.Male,
      birthdate: new Date('2020-01-15'),
      clinicId: clinicId
    });
  }

  let pet2 = await Pet.findOne({ name: 'Luna', clinicId: clinicId });
  if (!pet2) {
    pet2 = await Pet.create({
      name: 'Luna',
      species: PetSpecies.Cat,
      gender: PetGender.Female,
      birthdate: new Date('2021-05-20'),
      clinicId: clinicId
    });
  }
  console.log('Pets created or found.');
};
