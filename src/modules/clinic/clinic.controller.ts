import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ClinicService } from './clinic.service.js';
import { ILogger } from '../../shared/application/logging/logger.interface.js';
import { HttpStatus } from '../../shared/utils/http-status.util.js';
import { generateWelcomeReportPDF } from '../../shared/pdf-render/clinic/report/welcome-report.js';

const getAllClinics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const clinics = await clinicService.getAllClinics();
    res.status(HttpStatus.OK).json(clinics);
  } catch (error) {
    logger.error('Error getting clinics', error);
    next(error);
  }
};

const getClinicById = async (req: Request, res: Response, next: NextFunction) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const id = req.params.id;
    const clinic = await clinicService.getClinicById(id);

    if (!clinic) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
    }

    logger.info(`Clinic ${id} retrieved successfully`);
    res.status(HttpStatus.OK).json(clinic);
  } catch (error) {
    logger.error('Error getting clinic by id', error);
    next(error);
  }
};

const createClinic = async (req: Request, res: Response, next: NextFunction) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const newClinic = await clinicService.addClinic(req.body);
    res.status(HttpStatus.CREATED).json(newClinic);
  } catch (error) {
    logger.error('Error creating clinic', error);
    next(error);
  }
}


const updateClinic = async (req: Request, res: Response, next: NextFunction) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const id = req.params.id;
    const updatedClinic = await clinicService.updateClinic(id, req.body);
    if (!updatedClinic) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
    }
    res.status(HttpStatus.OK).json(updatedClinic);
  } catch (error) {
    logger.error('Error updating clinic', error);
    next(error);
  }
};

const addClinic = async (req: Request, res: Response, next: NextFunction) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const newClinic = await clinicService.addClinic(req.body);
    res.status(HttpStatus.CREATED).json(newClinic);
  } catch (error) {
    logger.error('Error adding clinic', error);
    next(error);
  }
};


const deleteClinic = async (req: Request, res: Response, next: NextFunction) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const id = req.params.id;
    const deletedClinic = await clinicService.deleteClinic(id);
    if (!deletedClinic) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
    }
    res.status(HttpStatus.OK).json(deletedClinic);
  } catch (error) {
    logger.error('Error deleting clinic', error);
    next(error);
  }
};


const getClinicReport = async (req: Request, res: Response, next: NextFunction) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const id = req.params.id;
    console.log('Generating report for clinic ID:', id); // Debug log
    const clinic = await clinicService.getClinicById(id);
    console.log('Clinic retrieved:', clinic); // Debug log


    if (!clinic) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
    }

    const pdfBuffer = await generateWelcomeReportPDF(clinic);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=clinic_${id}_report.pdf`);
    res.status(HttpStatus.OK).send(pdfBuffer);
  } catch (error) {
    logger.error('Error generating clinic report', error);
    next(error);
  }
}

export default {
  getAllClinics,
  getClinicById,
  updateClinic,
  addClinic,
  deleteClinic,
  createClinic,
  getClinicReport,
};
