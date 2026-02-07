import { IPet } from '../../src/database/models/pet/pet.model';
import { IParamsValidator } from '../../src/database/models/pet/responses.model';

export const expectValidatorPetsObject = (pet: IPet) => {
  expect(pet).toHaveProperty('id');
  expect(pet).toHaveProperty('name');
  expect(typeof pet.name).toBe('string');
  expect(pet).toHaveProperty('species');
  expect(typeof pet.birthdate).toMatch(/^(string|object)$/);
  expect(pet).toHaveProperty('birthdate');
  expect(typeof pet.species).toBe('string');
  expect(pet).toHaveProperty('gender');
  expect(typeof pet.gender).toBe('string');
}

export const expectValidatorInsertPetsObject = (pet: IPet) => {
  expect(pet).toHaveProperty('name');
  expect(typeof pet.name).toBe('string');
  expect(pet).toHaveProperty('species');
  expect(typeof pet.birthdate).toMatch(/^(string|object)$/);
  expect(pet).toHaveProperty('birthdate');
  expect(typeof pet.species).toBe('string');
  expect(pet).toHaveProperty('gender');
  expect(typeof pet.gender).toBe('string');
}

export const expectValidatorResponses = (elem: IParamsValidator) => {
  expect(elem).toHaveProperty("msg");
  expect(typeof elem.msg).toBe("string");
  expect(elem).toHaveProperty("param");
  expect(typeof elem.msg).toBe("string");
  expect(elem).toHaveProperty("location");
  expect(typeof elem.location).toBe("string");
};

export const expectValidatorMostNumObject = (average: any) => { 
  const { count, species} = average.dataValues;
  expect(typeof species).toBe('string');
  expect(species).not.toBe('');
  expect(typeof count).toBe('number');
  expect(count).toBeGreaterThan(0)
}
  
