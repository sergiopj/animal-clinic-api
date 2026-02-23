import { Router } from 'express';
import { requestValidator } from '../../shared/middlewares/request.validator.js';
import { ClinicIdParamDTO, RequestClinicDTO } from './dto/Request/request-clinic.dto.js';
import ClinicController from './clinic.controller.js';
import { ClinicService } from './clinic.service.js';
import { ClinicRepository } from './clinic.repository.js';
import { Log4jsLogger } from '../../shared/application/logging/logger.js';

const router = Router();
const path = '/clinics';

const logger = new Log4jsLogger();
const clinicRepository = new ClinicRepository();
const clinicService = new ClinicService(logger, clinicRepository);
const clinicController = new ClinicController(clinicService, logger);

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics (paginated)
 *     description: Retrieve paginated clinics with filtering (name, city, country, isActive) and sorting support
 *     tags: [Clinics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: createdAt }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Paginated list of clinics with pagination metadata
 *       500:
 *         description: Internal server error
 */
router.get(`${path}`, (req, res, next) => clinicController.getClinics(req, res, next));

/**
 * @swagger
 * /clinics/report/{id}:
 *   get:
 *     summary: Get clinic report PDF
 *     description: Generate and download a comprehensive PDF report for a specific clinic
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: PDF report generated successfully
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */
// TODO hacer que se envie un email con el PDF adjunto en lugar de descargarlo directamente en otro endpoint se necesita laentidad dueño para eso
router.get(`${path}/report/:id`, requestValidator(ClinicIdParamDTO, 'params'), (req, res, next) => clinicController.getClinicReport(req, res, next));

/**
 * @swagger
 * /clinics/{id}:
 *   get:
 *     summary: Get clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Clinic found successfully
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */
router.get(`${path}/:id`, requestValidator(ClinicIdParamDTO, 'params'), (req, res, next) => clinicController.getClinicById(req, res, next));

/**
 * @swagger
 * /clinics:
 *   post:
 *     summary: Create a new clinic
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clinic'
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *       500:
 *         description: Internal server error
 */
router.post(`${path}`, requestValidator(RequestClinicDTO, 'body'), (req, res, next) => clinicController.createClinic(req, res, next));

/**
 * @swagger
 * /clinics/{id}:
 *   put:
 *     summary: Update a clinic
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clinic'
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */
router.put(`${path}/:id`, requestValidator(ClinicIdParamDTO, 'params'), requestValidator(RequestClinicDTO, 'body'), (req, res, next) => clinicController.updateClinic(req, res, next));

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Delete a clinic
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Clinic deleted successfully
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */
router.delete(`${path}/:id`, requestValidator(ClinicIdParamDTO, 'params'), (req, res, next) => clinicController.deleteClinic(req, res, next));

export default router;
