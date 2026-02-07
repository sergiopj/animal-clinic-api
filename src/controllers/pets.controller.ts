'use strict';
import { Request, Response } from 'express';
import { IPet } from '../database/models/pet/pet.model';
import {
  getAllPetsService,
  getPetByIdService,
  getMostNumerousSpeciesService,
  getSpeciesAverageAgeService,
  addNewPetService,
  getSpecieAgeStandarDeviationService,
} from "../services/Pets";
import { Logger } from '../services/Logger';
const logger = Logger.getLogger('pets.controller');

/**
  * Return all pets
  * @param _req 
  * @param _res 
  * @returns {IPet[]}
*/
const getAllPets = async (_req: Request, _res: Response) => {
    try { 
      const data: IPet[] = await getAllPetsService(); 
      logger.info('::getAllPets | Start the process begins to obtaining all pets begins');
      data 
          ? _res.status(200).send({data, count: data.length})
          : _res.status(404).send({msg: 'All pets not found'});
    } catch (error: unknown) {  
      logger.error(`::getAllPets | Error trying to get all pets - error : ${error}`);   
      _res.status(500).send({msg: 'Error trying to get all pets'});
    }
};
  
/**
 * Returns the data of a pet by its id
 * @param _req 
 * @param _res 
 * @returns {IPet}
 */
  
const getPetById = async (_req: Request, _res: Response) => {
    const { id } = _req.params ;
    try {
      const data: IPet | null = await getPetByIdService(id);
      logger.info(`::getPetById | Start the process begins to obtaining pet by id : ${id}`);
      data?.name 
          ? _res.status(200).send(data)
          : _res.status(404).send({msg: 'Pet not found'}); 
    } catch (error) {     
      logger.error(`::getPetById | Error getting pet by id - error : ${error}`);
      _res.status(500).send({msg: `Error getting pet by id : ${id}`});
    }
};

// TODO VER BIEN EL RETURNS
/**
 * Returns the most numerous species
 * @param _req 
 * @param _res 
 * @returns {Json}
 */
  
const getMostNumerousSpecies = async (_req: Request, _res: Response) => {
  try {
    const species: any | null = await getMostNumerousSpeciesService();
    logger.info('::getMostNumerousSpecies | Start the process begins to obtain the most numerous species');
    species 
        ? _res.status(200).send(species)
        : _res.status(404).send({msg: 'Most numerous species not found'}); 
  } catch (error) {     
    logger.error(`::getMostNumerousSpecies | Error getting most numerous species - error : ${error}`);
    _res.status(500).send({msg: 'Error getting most numerous species'});
  }
};

/**
 * Returns species avegare age
 * @param _req 
 * @param _res 
 * @returns {Json}
 */
  
const getSpeciesAverageAge = async (_req: Request, _res: Response) => {
  try {
    const { species_name } = _req.query;
    const speciesAverage: number = await getSpeciesAverageAgeService(String(species_name));
    const standarDeviation: number = await getSpecieAgeStandarDeviationService(String(species_name));
    logger.info('::getSpeciesAverageAge | Start the process begins to obtain the species average age');
    speciesAverage 
        ? _res.status(200).send({speciesAverage, standarDeviation})
        : _res.status(404).send({msg: 'Species average afe not found'}); 
  } catch (error) {     
    logger.error(`::getSpeciesAverageAge | Error getting species average age - error : ${error}`);
    _res.status(500).send({msg: 'Error getting species average age'});
  }
};

/**
 * Add a new pet to the system
 * @param _req 
 * @param _res 
 * @returns {IPet}
 */
const addNewPet = async (_req: Request, _res: Response) => {
  try {
    const data = _req.body;
    const result: IPet = await addNewPetService(data);
    logger.info('::addNewPet | Start the process begins to insertion of a new pet');
    result 
      ? _res.status(201).send(result)
      : _res.status(404).send({msg: 'Could not add new pet'}); 
  } catch (error) {
    logger.error(`::addNewPet | Error adding new pet - error : ${error}`);
    _res.status(500).send({msg: 'Error adding new pet'});
  }
};

export {
    getAllPets,
    getPetById,
    getMostNumerousSpecies,
    getSpeciesAverageAge,
    addNewPet
}
