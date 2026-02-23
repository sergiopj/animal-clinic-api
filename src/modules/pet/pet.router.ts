import { Router } from 'express';
import { requestValidator } from '../../shared/middlewares/request.validator.js';
import { Log4jsLogger } from '../../shared/application/logging/logger.js';
import { PetRepository } from './pet.repository.js';
import { PetService } from './pet.service.js';
import PetController from './pet.controller.js';
import { PetIdParamDTO, RequestPetDTO } from './dto/Request/request-pet.dto.js';

const router = Router();
const path = '/pets';
const logger = new Log4jsLogger();
const petRepository = new PetRepository();
const petService = new PetService(logger, petRepository);
const petController = new PetController(petService, logger);

/**
 * @swagger
 * /Pets:
 *   get:
 *     summary: Get all pets (paginated)
 *     description: Retrieve paginated pets with filtering (name, species, gender) and sorting support
 *     tags: [Pets]
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
 *         name: species
 *         schema: { type: string }
 *       - in: query
 *         name: gender
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of pets with pagination metadata
 *       500:
 *         description: Internal server error
 */
router.get(`${path}`, (req, res, next) => petController.getPets(req, res, next));

/**
 * @swagger
 * /pets/report/{id}:
 *   get:
 *     summary: Get pet report PDF
 *     description: Generate and download a comprehensive PDF report for a specific pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: PDF report generated successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Internal server error
 */
// TODO hacer que se envie un email con el PDF adjunto en lugar de descargarlo directamente en otro endpoint se necesita laentidad dueño para eso
router.get(`${path}/report/:id`, requestValidator(PetIdParamDTO, 'params'), (req, res, next) => petController.getPetReport(req, res, next));

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pet found successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Internal server error
 */
router.get(`${path}/:id`, requestValidator(PetIdParamDTO, 'params'), (req, res, next) => petController.getPetById(req, res, next));

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Pet created successfully
 *       500:
 *         description: Internal server error
 */
router.post(`${path}`, requestValidator(RequestPetDTO, 'body'), (req, res, next) => petController.createPet(req, res, next));

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     tags: [Pets]
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
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Internal server error
 */
router.put(`${path}/:id`, requestValidator(PetIdParamDTO, 'params'), requestValidator(RequestPetDTO, 'body'), (req, res, next) => petController.updatePet(req, res, next));

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Internal server error
 */
router.delete(`${path}/:id`, requestValidator(PetIdParamDTO, 'params'), (req, res, next) => petController.deletePet(req, res, next));

export default router;
