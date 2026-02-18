import { injectable, inject } from 'tsyringe';
import { ILogger } from '../application/interfaces/ILogger.js';
import Vet from '../models/entities/Vet.js';
import Clinic from '../models/entities/Clinic.js';

@injectable()
export class VetService {
  constructor(@inject('ILogger') private logger: ILogger) {}

}

