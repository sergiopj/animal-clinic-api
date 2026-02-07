'use strict';
import { IPet, Pet } from '../database/models/pet/pet.model';
import DbQueries from './DbQueries';
import { Calculation } from './Calculation';


// TODO esto llevar al sitio que toca
/**
 * Function to get all pets
 * @returns {Promise<IPet[]>}
 */
const getAllPetsService = async (): Promise<IPet[]> => {
  try {    
    const pets: IPet[] = await DbQueries.getAllElems();
    return pets.length > 0 
      ? pets 
      : [];
  } catch (error: unknown) {
    const message: string = error instanceof Error 
        ? error.message 
        : 'Unknown Error';
    throw new Error(`Failed to get all pets - error: ${message}`);
  }
};

/**
 * Function to get a pet by id
 * @param id - pet id
 * @returns {Promise<IPet | null>}
 */
const getPetByIdService = async (id: string): Promise<IPet | null> => {
  try {
    const pet: IPet | null = await DbQueries.findElemById(id);
    return pet
      ? pet
      : null;
  } catch (error: unknown) {
    const message: string = error instanceof Error
        ? error.message 
        : 'Unknown Error';
    throw new Error(`Error getting pet by id - error: ${message}`);
  }
};

/**
 * Function to obtain the most numerous species
 * @returns {Promise<any | null>}
 */
const getMostNumerousSpeciesService = async (): Promise<any | null> => {
  try {
    const species = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      },
      {
        $project: {
          _id: 0,
          species: '$_id',
          count: 1
        }
      }
    ]);
    return species.length > 0 ? species[0] : null;
  } catch (error: unknown) {
    const message: string = error instanceof Error
        ? error.message 
        : 'Unknown Error';
    throw new Error(`Error getting most numerous species - error: ${message}`);
  }
};

/**
 * Function to obtain the average age among all pets
 * @returns {Promise<number>}
 */
const getSpeciesAverageAgeService = async (species: string): Promise<number> => {
  try {
    const querie = { species };
    const pets: IPet[] = await DbQueries.findElemsByQuerie(querie); 
    const averageAge: number = Calculation.calculateAverageAge(pets);   
    return averageAge;      
  } catch (error: unknown) {
    const message: string = error instanceof Error
        ? error.message 
        : 'Unknown Error';
    throw new Error(`Error getting species average age - error: ${message}`);
  }
};

/**
 * Function to obtain the standar deviation among all pets
 * @returns {Promise<number>}
 */
const getSpecieAgeStandarDeviationService = async (species: string): Promise<number> => {
  try {
    const querie = { species };
    const pets: IPet[] = await DbQueries.findElemsByQuerie(querie);
    const standarDeviation: number = Calculation.calculateStandarDeviation(pets);    
    return standarDeviation;  
  } catch (error: unknown) {
    const message: string = error instanceof Error
        ? error.message 
        : 'Unknown Error';
    throw new Error(`Error getting species standar deviation - error: ${message}`);
  }
};

/**
 * Function to add a pet
 * @param data - Pet data to add
 * @returns {Promise<IPet>}
 */

// TODO mejor que sean los actions y que accedan a los repositories? este es un fichero action de pet y el mismo tiene varios metodos
    // para que sirve el use case? mirar
const addNewPetService = async (data: Partial<IPet>): Promise<IPet> => {
  try {
    const { species, gender, name, birthdate } = data;
    const pet = {
      name,
      species: species?.toLocaleLowerCase(),
      gender: gender?.toLocaleLowerCase(),
      birthdate,
    }
    const result: IPet = await DbQueries.insertData(pet);
    return result;
  } catch (error) {
    const message: string = error instanceof Error 
      ? error.message
      : 'Unknown Error';   
    throw new Error(`Error adding new pet- error: ${message}`);
  }
};

export {
  getAllPetsService,
  getPetByIdService,
  getMostNumerousSpeciesService,
  getSpeciesAverageAgeService,
  getSpecieAgeStandarDeviationService,
  addNewPetService,
};
