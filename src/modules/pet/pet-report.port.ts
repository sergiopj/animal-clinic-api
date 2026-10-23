import type { AIResponseDTO } from '../ai/ai-query.model.js';

import type { ResponsePetDTO } from './dto/Response/response-pet.dto.js';

export interface PetReportPort {
  generateReport(pet: ResponsePetDTO): Promise<Buffer>;
  generateCareReport(pet: ResponsePetDTO, analysis: AIResponseDTO): Promise<Buffer>;
}
