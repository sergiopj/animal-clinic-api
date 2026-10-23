import type { ResponsePetDTO } from './dto/Response/response-pet.dto.js';

export interface PetReportPort {
  generateReport(pet: ResponsePetDTO): Promise<Buffer>;
}
