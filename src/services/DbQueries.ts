'use strict';

import { IPet, Pet } from '../database/models/pet/pet.model';
import { FilterQuery } from 'mongoose';

// TODO esto no creo que deba estar aqui
/**
 * Function that get all elems
 * @returns {Promise<IPet[]>} db elements obtained
 */
const getAllElems = (): Promise<IPet[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const pets: IPet[] = await Pet.find().sort({ _id: 1 });
      resolve(pets);
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string'
        ? error 
        : 'An error occurred - error: unknow';
      reject(new Error(errorMessage));
    }     
  });
};

/**
 * Function that gets a elem by id
 * @param id id value
 * @returns {Promise<IPet | null>} db element obtained by its id
 */
const findElemById = (id: string): Promise<IPet | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const pet: IPet | null = await Pet.findById(id);
      resolve(pet);
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string'
        ? error 
        : 'An error occurred - error: unknow';
      reject(new Error(errorMessage));
    } 
  });
};

/**
 * Function that obtains results based on a query
 * @param querie querie object
 * @returns {Promise<IPet[]>} obtained db elements
 */
const findElemsByQuerie = (querie: FilterQuery<IPet>): Promise<IPet[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const elements: IPet[] = await Pet.find(querie);
      resolve(elements);
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string'
        ? error 
        : 'An error occurred - error: unknow';
      reject(new Error(errorMessage));
    }      
  });
}

/**
 * Function that obtains only one result based on a query
 * @param querie querie object
 * @returns {Promise<IPet | null>} obtained db elements
 */
const findOneByQuerie = (querie: FilterQuery<IPet>): Promise<IPet | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const elements: IPet | null = await Pet.findOne(querie);
      resolve(elements);
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string'
        ? error 
        : 'An error occurred - error: unknow';
      reject(new Error(errorMessage));
    }       
  });
}


/**
 * Function that saves an element in db
 * @param data element data to insert
 * @returns {Promise<IPet>} result of inserted element
 */
const insertData = (data: Partial<IPet>): Promise<IPet> => {
    return new Promise(async (resolve, reject) => {
      try {
        const newPet = new Pet(data);
        const savedStatus = await newPet.save();
        resolve(savedStatus)
      } catch (error: unknown) {
        const errorMessage = typeof error === 'string'
          ? error 
          : 'An error occurred - error: unknow';
        reject(new Error(errorMessage));
      } 
    });
  }

export = {
  getAllElems,
  findElemById,
  findElemsByQuerie,
  insertData,
  findOneByQuerie
};
