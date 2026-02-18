import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ClinicService } from '../services/clinic.service.js';
import { matchedData } from 'express-validator';
import { ILogger } from '../application/interfaces/ILogger.js';
import { HttpStatus } from '../utils/http-status.util.js';

const getAllClinics = async (req: Request, res: Response): Promise<void> => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const clinics = await clinicService.getAllClinics();
    res.status(HttpStatus.OK).json(clinics);
  } catch (error) {
    logger.error('Error getting clinics', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error getting clinics' });
  }
};

const getClinicById = async (req: Request, res: Response) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const { id } = matchedData(req);
    const clinic = await clinicService.getClinicById(id);
    if (!clinic) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Clinic not found' });
    }
    res.status(HttpStatus.OK).json(clinic);
  } catch (error) {
    logger.error('Error getting clinic by id', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error getting clinic' });
  }
};

const createClinic = async (req: Request, res: Response) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const newClinic = await clinicService.addClinic(req.body);
    res.status(HttpStatus.CREATED).json(newClinic);
  } catch (error) {
    logger.error('Error creating clinic', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating clinic' });
  }
}


const updateClinic = async (req: Request, res: Response) => {
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
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error updating clinic' });
  }
};

const addClinic = async (req: Request, res: Response) => {
  const clinicService = container.resolve(ClinicService);
  const logger = container.resolve<ILogger>('ILogger');
  try {
    const newClinic = await clinicService.addClinic(req.body);
    res.status(HttpStatus.CREATED).json(newClinic);
  } catch (error) {
    logger.error('Error adding clinic', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error adding clinic' });
  }
};

// TODO documentacion para swagger, y validacion de datos de entrada con express-validator

const deleteClinic = async (req: Request, res: Response) => {
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
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting clinic' });
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
