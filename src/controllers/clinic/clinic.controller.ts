import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ClinicService } from '../../services/clinic/clinic.service.js';
import { matchedData } from 'express-validator';
import { ILogger } from '../../application/logging/logger.interface.js';
import { HttpStatus } from '../../utils/http-status.util.js';

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
    const { id } = matchedData(req);
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
    const { id } = matchedData(req);
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
    const { id } = matchedData(req);
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

export default {
  getAllClinics,
  getClinicById,
  updateClinic,
  addClinic,
  deleteClinic,
  createClinic
};
