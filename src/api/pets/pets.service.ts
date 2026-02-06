import { injectable, inject } from 'tsyringe';
import petsRepository from './pets.repository.js';
import { ILogger } from '../../application/interfaces/ILogger.js';
import Pet from '../../database/models/pet.model.js';

@injectable()
export class PetsService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  public async getAllPets(): Promise<Pet[]> {
    this.logger.info('Fetching all pets');
    return petsRepository.findAll();
  }

  public async getPetById(id: number): Promise<Pet | null> {
    this.logger.info(`Fetching pet with id: ${id}`);
    return petsRepository.findById(id);
  }

  public async addNewPet(data: any): Promise<Pet> {
    this.logger.info('Adding new pet', data);
    return petsRepository.create(data);
  }
  
  // TODO: Re-implementar la lógica de negocio (cálculos, etc.) si es necesario
  // ya que la lógica anterior dependía de Mongoose.
}
