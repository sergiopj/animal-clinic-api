import Clinic from '../../database/models/clinic.model.js';
import Veterinarian from '../../database/models/veterinarian.model.js';
import Pet from '../../database/models/pet.model.js';
import { PetGender } from '../../database/models/enums/pet-gender.enum.js';
import { PetSpecies } from '../../database/models/enums/pet-species.enum.js';

export const seed = async () => {
  // 1. Crear o obtener Clínica
  const [clinic] = await Clinic.findOrCreate({
    where: { licenseNumber: 'CL-2023-001' },
    defaults: {
      name: 'Animal Clinic Central',
      address: 'Calle Principal 123, Madrid',
      phone: '+34 912 345 678',
      email: 'contacto@animalclinic.com',
      licenseNumber: 'CL-2023-001'
    }
  });
  console.log('Clinic created or found.');

  const clinicId = clinic.get('id') as number;

  // 2. Crear o obtener Veterinarios
  await Veterinarian.findOrCreate({
    where: { licenseNumber: 'VET-001' },
    defaults: {
      firstName: 'Juan',
      lastName: 'Pérez',
      licenseNumber: 'VET-001',
      email: 'juan.perez@clinic.com',
      clinicId: clinicId
    }
  });
  await Veterinarian.findOrCreate({
    where: { licenseNumber: 'VET-002' },
    defaults: {
      firstName: 'Ana',
      lastName: 'García',
      licenseNumber: 'VET-002',
      email: 'ana.garcia@clinic.com',
      clinicId: clinicId
    }
  });
  console.log('Veterinarians created or found.');

  // 3. Crear o obtener Mascotas
  await Pet.findOrCreate({
    where: { name: 'Max', clinicId: clinicId },
    defaults: {
      name: 'Max',
      species: PetSpecies.Dog,
      gender: PetGender.Male,
      birthdate: new Date('2020-01-15'),
      clinicId: clinicId
    }
  });
  await Pet.findOrCreate({
    where: { name: 'Luna', clinicId: clinicId },
    defaults: {
      name: 'Luna',
      species: PetSpecies.Cat,
      gender: PetGender.Female,
      birthdate: new Date('2021-05-20'),
      clinicId: clinicId
    }
  });
  console.log('Pets created or found.');
};
