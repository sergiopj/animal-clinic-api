'use strict';
import moment from 'moment';
import Pet from '../../database/models/pet.model.js';

// TODO: Esta clase necesita ser adaptada para usar los modelos de Sequelize
// ya que la interfaz IPet de Mongoose ya no existe.
// Por ahora, la comento para evitar errores de compilación.

/*
export class Calculation {

  static calculateAgeInYears(birthdate: Date): number {
    const now = moment();    
    return now.diff(birthdate, 'years');
  }

  static calculateStandarDeviation(pets: Pet[]): number {
    const averageAge: number = this.calculateAverageAge(pets)
    const ageAverageDif = pets.map((pet: Pet) => {
      return this.calculateAgeInYears(pet.birthdate) - averageAge;
    });
    const squaredDiff = ageAverageDif.map(age => {
      return Math.pow(age, 2);
    });
    const arithmeticAvg = squaredDiff.reduce((sum, diff) => {
      return sum + diff;
    }, 0) / pets.length;
    const standarDeviation = parseFloat(Math.sqrt(arithmeticAvg).toFixed(2));
    return standarDeviation;
  }

  static calculateAverageAge(pets: Pet[]): number {
    const averageAge = pets.reduce((sum, pet) => {
      return sum + this.calculateAgeInYears(pet.birthdate);
    }, 0) / pets.length;
    return parseFloat(averageAge.toFixed(2))
  }
}
*/
