import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PetsService } from './pets.service.js';
import { matchedData } from 'express-validator';
import { ILogger } from '../../application/interfaces/ILogger.js';

const getAllPets = async (req: Request, res: Response) => {
  const petsService = container.resolve(PetsService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const pets = await petsService.getAllPets();
    res.status(200).json(pets);
  } catch (error) {
    logger.error('Error getting pets', error);
    res.status(500).json({ message: 'Error getting pets' });
  }
};

const getPetById = async (req: Request, res: Response) => {
  const petsService = container.resolve(PetsService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const { id } = matchedData(req);
    const pet = await petsService.getPetById(parseInt(id, 10));
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(pet);
  } catch (error) {
    logger.error('Error getting pet by id', error);
    res.status(500).json({ message: 'Error getting pet' });
  }
};

const addNewPet = async (req: Request, res: Response) => {
  const petsService = container.resolve(PetsService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const data = matchedData(req);
    const newPet = await petsService.addNewPet(data);
    res.status(201).json(newPet);
  } catch (error) {
    logger.error('Error adding new pet', error);
    res.status(500).json({ message: 'Error adding new pet' });
  }
};

export default {
  getAllPets,
  getPetById,
  addNewPet,
  // TODO: Re-implementar los otros endpoints que requieren lógica de negocio más compleja
};
