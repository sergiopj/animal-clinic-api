import { injectable, inject } from 'tsyringe';
import { ILogger } from '../application/interfaces/ILogger.js';
import Pet from '../models/entities/Pet.js';
import Clinic from '../models/entities/Clinic.js';
import { AIService } from './ai.service.js';
import { AIResponseDTO } from '../models/dto/ai-query.dto.js';
import { FilterQuery } from 'mongoose';

// <--- 2. ORCHESTRATOR: Gets DB data and calls AI
@injectable()
export class PetService {
  constructor(
    @inject('ILogger') private logger: ILogger,
    @inject(AIService) private aiService: AIService
  ) {}

  // public async getAllPets(filter?: FilterQuery<any>): Promise<any[]> {
  //   this.logger.info('PetService: Fetching all pets');
  //   return Pet.find(filter || {}).populate('clinicId', 'name address phone').exec();
  // }


  /**
   * Analyze pet with AI - Orchestrates data retrieval and AI call
   */
  // public async analyzePetWithAI(petId: string, query: string){
  //   // this.logger.info(`PetService: Starting AI analysis for pet ${petId}`);

  //   // // 1. Get pet data from database (including medical history)
  //   // const pet = await this.getPetById(petId);
  //   // if (!pet) {
  //   //   throw new Error('Pet not found');
  //   // }

  //   // // 2. Call AI Service to analyze
  //   // const analysis = await this.aiService.analyzePet(pet, query);

  //   // this.logger.info(`PetService: AI analysis completed for pet ${petId}`);
  //   // return analysis;
  // }
}

