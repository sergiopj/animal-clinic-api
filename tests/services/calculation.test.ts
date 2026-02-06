'use strict';
import { Calculation } from '../../src/services/Calculation';
import { PET_OBJECT_DB_LIST } from '../common/mocks/pet.mock';

describe('ArithmeticCalcService', () => {  

  describe('calculateAgeInYears', () => {
    it('validation of whether the number of years is received correctly from a date of birth', async () => {
      const years: number = await Calculation.calculateAgeInYears('2000-03-15');    
      expect(typeof years).toBe('number');
      expect(years).toBeGreaterThan(0);
    });
  }); 

  describe('calculateStandarDeviation', () => {
    it('validation to calculate the standard deviation of a list of pets', async () => {
      const dbPetList: any = PET_OBJECT_DB_LIST;
      const standarDeviation: number = await Calculation.calculateStandarDeviation(dbPetList); 
      expect(typeof standarDeviation).toBe('number');
      expect(standarDeviation).toBe(5.72);
    });
  }); 

  describe('calculateAverageAge', () => {
    it('validation to calculate average age of a list of pets', async () => {
      const dbPetList: any = PET_OBJECT_DB_LIST;
      const averageAge: number = await Calculation.calculateAverageAge(dbPetList);    
      expect(typeof averageAge).toBe('number');
      expect(averageAge).toBe(10);
    });
  });

});
