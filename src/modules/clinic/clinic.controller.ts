import { Request, Response, NextFunction } from 'express';
import { ClinicService } from './clinic.service.js';
import { ILogger } from '../../shared/application/logging/logger.interface.js';
import { HttpStatus } from '../../shared/utils/http-status/http-status.util.js';
import { generateWelcomeReportPDF } from '../../shared/pdf-render/clinic/report/welcome-report.js';
import { ClinicQueryParams } from './dto/Request/query-clinic.dto.js';

class ClinicController {
  constructor(
    private readonly clinicService: ClinicService,
    private readonly logger: ILogger
  ) {}

  getClinics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.clinicService.getClinics(req.query as ClinicQueryParams);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      this.logger.error('Error getting clinics', error);
      next(error);
    }
  };

  getClinicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const clinic = await this.clinicService.getClinicById(id);

      if (!clinic) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
      }

      this.logger.info(`Clinic ${id} retrieved successfully`);
      res.status(HttpStatus.OK).json(clinic);
    } catch (error) {
      this.logger.error('Error getting clinic by id', error);
      next(error);
    }
  };

  createClinic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newClinic = await this.clinicService.addClinic(req.body);
      res.status(HttpStatus.CREATED).json(newClinic);
    } catch (error) {
      this.logger.error('Error creating clinic', error);
      next(error);
    }
  };

  updateClinic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updatedClinic = await this.clinicService.updateClinic(id, req.body);
      if (!updatedClinic) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
      }
      res.status(HttpStatus.OK).json(updatedClinic);
    } catch (error) {
      this.logger.error('Error updating clinic', error);
      next(error);
    }
  };

  addClinic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newClinic = await this.clinicService.addClinic(req.body);
      res.status(HttpStatus.CREATED).json(newClinic);
    } catch (error) {
      this.logger.error('Error adding clinic', error);
      next(error);
    }
  };

  deleteClinic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const deletedClinic = await this.clinicService.deleteClinic(id);
      if (!deletedClinic) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
      }
      res.status(HttpStatus.OK).json(deletedClinic);
    } catch (error) {
      this.logger.error('Error deleting clinic', error);
      next(error);
    }
  };

  getClinicReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const clinic = await this.clinicService.getClinicById(id);

      if (!clinic) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
      }

      const pdfBuffer = await generateWelcomeReportPDF(clinic);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=clinic_${id}_report.pdf`);
      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      this.logger.error('Error generating clinic report', error);
      next(error);
    }
  };
}

export default ClinicController;
