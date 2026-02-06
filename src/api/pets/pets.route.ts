import { Router } from "express";
import petsController from "./pets.controller.js";
import { validateGetPetById, validateAddNewPet } from "../../middlewares/request-validators/pets.validator.js";

const router = Router();

router.get("/", petsController.getAllPets);
router.get("/:id", validateGetPetById, petsController.getPetById);
router.post("/", validateAddNewPet, petsController.addNewPet);

// TODO: Re-implementar estas rutas que requieren lógica de negocio más compleja
// router.get("/species/most_numerous_species", petsController.getMostNumerousSpecies);
// router.get("/species/average_age", petsController.getSpeciesAverageAge);

export default router;
