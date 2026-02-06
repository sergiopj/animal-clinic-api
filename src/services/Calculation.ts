'use strict';
import moment from 'moment';
import { IPet } from '../database/models/pets/pet.model';

// TODO los servicios quizas muchos metodos sean helpers?
// REVISAR BIEN EL NAMIMG DE TODOS LOS FICHEROS
export class Calculation {

  /** receives the date of birth and returns the age based on the current date 
   * @param birthdate
   * @returns {number}
   */    
  static calculateAgeInYears(birthdate: Date): number {
    const now = moment();    
    return now.diff(birthdate, 'years');
  }

  /** receives an age with the ages of the pets and calculates its standard deviation 
   * @param pets
   * @returns {number}
   */  
  static calculateStandarDeviation(pets: IPet[]): number {
    // square root of arithmetic mean
    const averageAge: number = this.calculateAverageAge(pets)
    // subtract each year from the average number of years
    const ageAverageDif = pets.map((pet: IPet) => {
      return this.calculateAgeInYears(pet.birthdate) - averageAge;
    });
    // square each difference
    const squaredDiff = ageAverageDif.map(age => {
      return Math.pow(age, 2);
    });
    // calculate the arithmetic mean of the squared differences
    const arithmeticAvg = squaredDiff.reduce((sum, diff) => {
      return sum + diff;
    }, 0) / pets.length;
    // square root of arithmetic mean
    const standarDeviation = parseFloat(Math.sqrt(arithmeticAvg).toFixed(2));
    return standarDeviation;
  }

  /** calculates the average age of a list of pets
   * @param pets
   * @returns {number}
   */    
  static calculateAverageAge(pets: IPet[]): number {
    const averageAge = pets.reduce((sum, pet) => {
      return sum + this.calculateAgeInYears(pet.birthdate);
    }, 0) / pets.length;
    return parseFloat(averageAge.toFixed(2))
  }

  
}
