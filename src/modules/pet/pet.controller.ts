import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../../shared/application/logging/logger.interface.js';
import { HttpStatus } from '../../shared/utils/http-status/http-status.util.js';
import { PetService } from './pet.service.js';
import { PetQueryParams } from './dto/Request/query-pet.dto.js';
import { generatePetClinicalHistoryReportPDF } from '../../shared/pdf-render/report/pdf-render-report.js';

class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly logger: ILogger
  ) {}

  getPets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.petService.getPets(req.query as PetQueryParams);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      this.logger.error('Error getting pets', error);
      next(error);
    }
  };

  getPetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const pet = await this.petService.getPetById(id);

      if (!pet) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Pet not found' });
      }

      this.logger.info(`Pet ${id} retrieved successfully`);
      res.status(HttpStatus.OK).json(pet);
    } catch (error) {
      this.logger.error('Error getting pet by id', error);
      next(error);
    }
  };

  createPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPet = await this.petService.addPet(req.body);
      res.status(HttpStatus.CREATED).json(newPet);
    } catch (error) {
      this.logger.error('Error creating pet', error);
      next(error);
    }
  };

  updatePet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updatedPet = await this.petService.updatePet(id, req.body);
      if (!updatedPet) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Pet not found' });
      }
      res.status(HttpStatus.OK).json(updatedPet);
    } catch (error) {
      this.logger.error('Error updating pet', error);
      next(error);
    }
  };

  addPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPet = await this.petService.addPet(req.body);
      res.status(HttpStatus.CREATED).json(newPet);
    } catch (error) {
      this.logger.error('Error adding pet', error);
      next(error);
    }
  };

  deletePet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const deletedPet = await this.petService.deletePet(id);
      if (!deletedPet) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Pet not found' });
      }
      res.status(HttpStatus.OK).json(deletedPet);
    } catch (error) {
      this.logger.error('Error deleting pet', error);
      next(error);
    }
  };

  getPetReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const pet = await this.petService.getPetById(id);

      if (!pet) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Pet not found' });
      }

      const pdfBuffer = await generatePetClinicalHistoryReportPDF(pet);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=pet_${id}_report.pdf`);
      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      this.logger.error('Error generating pet report', error);
      next(error);
    }
  };
}

export default PetController;
