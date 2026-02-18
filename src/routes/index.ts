import { Router } from 'express';
import clinicController from '../controllers/clinic.controller.js';

const router = Router();

// --- Pet Routes ---

// router.post('/pets/:id/analyze', petController.analyzePet); // AI Analysis endpoint

// TODO sacar en grupos de rutas por entidad, y luego importar esos grupos aqui, para no tener un fichero de rutas gigante
// --- Clinic Routes ---
router.get('/clinics', clinicController.getAllClinics);
router.get('/clinics/:id', clinicController.getClinicById);
router.post('/clinics', clinicController.createClinic);
router.put('/clinics/:id', clinicController.updateClinic);
router.delete('/clinics/:id', clinicController.deleteClinic);

// --- Vet Routes ---


export default router;

