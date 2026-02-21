import { Router } from 'express';
import clinicController from './clinic.controller.js';
import { requestValidator } from '../../shared/middlewares/request.validator.js';
import { ClinicIdParamDTO, RequestClinicDTO } from './dto/Request/request-clinic.dto.js';

const router = Router();
const path = '/clinics';

// --- Clinic Routes ---

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics
 *     description: Retrieve a list of all clinics with their veterinarians and pets
 *     tags: [Clinics]
 *     responses:
 *       200:
 *         description: A list of clinics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clinic'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(`${path}`, clinicController.getAllClinics);

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
 *         schema:
 *           type: string
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: PDF report generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Clinic not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// TODO hacer que se envie un email con el PDF adjunto en lugar de descargarlo directamente en otro endpoint se necesita laentidad dueño para eso
router.get(`${path}/report/:id`, requestValidator(ClinicIdParamDTO, 'params'), clinicController.getClinicReport);

/**
 * @swagger
 * /clinics/{id}:
 *   get:
 *     summary: Get clinic by ID
 *     description: Retrieve a single clinic by its ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: Clinic found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         description: Clinic not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(`${path}/:id`, requestValidator(ClinicIdParamDTO, 'params'), clinicController.getClinicById);

/**
 * @swagger
 * /clinics:
 *   post:
 *     summary: Create a new clinic
 *     description: Register a new clinic in the system
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clinic'
 *           example:
 *             name: "Clínica Veterinaria San Francisco"
 *             address: "Calle Mayor 123, Madrid"
 *             phone: "+34 91 123 45 67"
 *             email: "info@clinicasanfrancisco.com"
 *             website: "https://www.clinicasanfrancisco.com"
 *             vatNumber: "B12345678"
 *             licenseNumber: "VET-2024-001"
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(`${path}`, requestValidator(RequestClinicDTO, 'body'), clinicController.createClinic);

/**
 * @swagger
 * /clinics/{id}:
 *   put:
 *     summary: Update a clinic
 *     description: Update an existing clinic's information
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The clinic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clinic'
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         description: Clinic not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(`${path}/:id`, requestValidator(ClinicIdParamDTO, 'params'), requestValidator(RequestClinicDTO, 'body'), clinicController.updateClinic);

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Delete a clinic
 *     description: Remove a clinic from the system
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: Clinic deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         description: Clinic not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(`${path}/:id`, requestValidator(ClinicIdParamDTO, 'params'), clinicController.deleteClinic);

export default router;

