import Clinic from './clinic.model.js';
import Veterinarian from './veterinarian.model.js';
import Pet from './pet.model.js';

// Una Clínica tiene muchos Veterinarios
Clinic.hasMany(Veterinarian, { 
  foreignKey: 'clinicId', 
  as: 'veterinarians' 
});
Veterinarian.belongsTo(Clinic, { 
  foreignKey: 'clinicId', 
  as: 'clinic' 
});

// Una Clínica tiene muchas Mascotas registradas
Clinic.hasMany(Pet, {
  foreignKey: 'clinicId',
  as: 'pets'
});
Pet.belongsTo(Clinic, {
  foreignKey: 'clinicId',
  as: 'clinic'
});

console.log('Sequelize associations have been set up.');
