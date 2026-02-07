import mongoose from 'mongoose';
import { Clinic } from '../../database/models/clinic/clinic.model';
import { Veterinarian } from '../../database/models/veterinarian/veterinarian.model';
import { Pet } from '../../database/models/pet/pet.model';
import { Vaccine } from '../../database/models/vaccine/vaccine.model';
import { VaccinationRecord } from '../../database/models/vaccination-record/vaccination-record.model';
import { Appointment, AppointmentType, AppointmentStatus } from '../../database/models/appointment/appointment.model';
import { Pathology } from '../../database/models/pathology/pathology.model';
import { SpeciesEnum as PetSpecies } from '../../database/models/pet/enums/species.enum';
import { GenderEnum as PetGender } from '../../database/models/pet/enums/gender.enum';
import { TypeEnum as VaccineType } from '../../database/models/vaccine/enums/type.enum';
import { StatusEnum as PathologyStatus } from '../../database/models/pathology/enums/status.enum';

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const seed = async () => {
  console.log('Running Seed: 002_full_clinic_data');

  // 1. Limpiar BD
  await Promise.all([
    Clinic.deleteMany({}),
    Veterinarian.deleteMany({}),
    Pet.deleteMany({}),
    Vaccine.deleteMany({}),
    VaccinationRecord.deleteMany({}),
    Appointment.deleteMany({}),
    Pathology.deleteMany({})
  ]);
  console.log('Database cleared.');

  // 2. Crear Clínica
  const clinic = await Clinic.create({
    name: 'Animal Clinic Central',
    address: 'Calle Principal 123, Madrid',
    phone: '+34 912 345 678',
    email: 'contacto@animalclinic.com',
    licenseNumber: 'CL-2023-001'
  });
  console.log('Clinic created.');

  // 3. Crear Veterinarios
  const vetsData = [
    { firstName: 'Juan', lastName: 'Pérez', licenseNumber: 'VET-001', specialties: ['Cirugía', 'Traumatología'], email: 'juan.perez@clinic.com', clinic: clinic._id },
    { firstName: 'Ana', lastName: 'García', licenseNumber: 'VET-002', specialties: ['Dermatología', 'Medicina Interna'], email: 'ana.garcia@clinic.com', clinic: clinic._id },
    { firstName: 'Carlos', lastName: 'López', licenseNumber: 'VET-003', specialties: ['Exóticos'], email: 'carlos.lopez@clinic.com', clinic: clinic._id }
  ];
  const vets = await Veterinarian.insertMany(vetsData);
  
  // Actualizar clínica con los veterinarios
  clinic.veterinarians = vets.map(v => v._id) as any;
  await clinic.save();
  console.log('Veterinarians created.');

  // 4. Crear Catálogo de Vacunas
  const vaccinesData = [
    { name: 'Rabisin', type: VaccineType.Rabies, manufacturer: 'Merial', validityMonths: 12, isMandatory: true },
    { name: 'Eurican', type: VaccineType.Distemper, manufacturer: 'Merial', validityMonths: 12, isMandatory: false },
    { name: 'Nobivac Parvo', type: VaccineType.Parvovirus, manufacturer: 'MSD', validityMonths: 12, isMandatory: true },
    { name: 'Leucogen', type: VaccineType.FelineLeukemia, manufacturer: 'Virbac', validityMonths: 12, isMandatory: false },
    { name: 'Feligen', type: VaccineType.Calicivirus, manufacturer: 'Virbac', validityMonths: 12, isMandatory: true }
  ];
  const vaccines = await Vaccine.insertMany(vaccinesData);
  console.log('Vaccines catalog created.');

  // 5. Crear Mascotas
  const petNames = ['Max', 'Luna', 'Rocky', 'Bella', 'Simba', 'Nala', 'Thor', 'Coco', 'Zeus', 'Kira'];
  const breeds: { [key in PetSpecies]: string[] } = { 
    [PetSpecies.Dog]: ['Labrador', 'Pastor Alemán', 'Bulldog'], 
    [PetSpecies.Cat]: ['Siamés', 'Persa', 'Común Europeo'] 
  };
  
  const pets = [];
  for (let i = 0; i < 20; i++) {
    const species = i % 2 === 0 ? PetSpecies.Dog : PetSpecies.Cat;
    const breed = getRandomElement(breeds[species]);
    
    pets.push({
      name: getRandomElement(petNames),
      species: species,
      breed: breed,
      gender: getRandomElement(Object.values(PetGender)),
      weight: Math.floor(Math.random() * 30) + 2,
      birthdate: getRandomDate(new Date(2015, 0, 1), new Date(2023, 0, 1)),
      isVaccinated: false, // Se actualizará dinámicamente si tuviera lógica, pero aquí es data estática
      isSterilized: Math.random() > 0.5
    });
  }
  const createdPets = await Pet.insertMany(pets);
  console.log('Pets created.');

  // 6. Crear Historial Médico (Vacunas, Patologías, Citas)
  for (const pet of createdPets) {
    // A. Vacunas (Algunas mascotas tienen vacunas)
    if (Math.random() > 0.3) {
      const vaccine = getRandomElement(vaccines);
      const vet = getRandomElement(vets);
      const appDate = getRandomDate(new Date(2023, 0, 1), new Date());
      const nextDate = new Date(appDate);
      nextDate.setMonth(nextDate.getMonth() + vaccine.validityMonths);

      const record = await VaccinationRecord.create({
        pet: pet._id,
        vaccine: vaccine._id,
        veterinarian: vet._id,
        clinic: clinic._id,
        applicationDate: appDate,
        nextDueDate: nextDate,
        batchNumber: `BATCH-${Math.floor(Math.random() * 10000)}`
      });
      
      pet.vaccinationRecords.push(record._id as any);
      pet.isVaccinated = true; // Simplificación para el seed
    }

    // B. Patologías (Algunas mascotas están enfermas)
    if (Math.random() > 0.7) {
      const pathology = await Pathology.create({
        name: 'Gastroenteritis',
        diagnosisDate: getRandomDate(new Date(2023, 0, 1), new Date()),
        status: PathologyStatus.Active,
        severity: 'Medium',
        pet: pet._id,
        notes: 'Vómitos y diarrea.'
      });
      pet.pathologies.push(pathology._id as any);
    }

    // C. Citas (Historial de visitas)
    const numAppointments = Math.floor(Math.random() * 3);
    for (let j = 0; j < numAppointments; j++) {
      await Appointment.create({
        pet: pet._id,
        veterinarian: getRandomElement(vets)._id,
        clinic: clinic._id,
        date: getRandomDate(new Date(2023, 0, 1), new Date()),
        type: getRandomElement(Object.values(AppointmentType)),
        status: AppointmentStatus.Completed,
        reason: 'Revisión rutinaria'
      });
    }
    
    await pet.save();
  }
  
  console.log('Medical history (Vaccines, Pathologies, Appointments) created.');
  console.log('Seed 002_full_clinic_data completed successfully!');
};
