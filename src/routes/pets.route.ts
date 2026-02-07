"use strict";
import * as express from "express";
const Router = express.Router();
import {
  getPetById,
  getMostNumerousSpecies,
  getSpeciesAverageAge,
  getAllPets,
  addNewPet,
} from "../controllers/pets.controller";
import { validateGetPetById, validateAddNewPet } from "../middlewares/request-validators/pets.validator";

Router.get("/", getAllPets);
Router.get(
  "/:id",
  validateGetPetById,
  getPetById
);
Router.get("/species/most_numerous_species", getMostNumerousSpecies);
Router.get("/species/average_age", getSpeciesAverageAge);
Router.post(
  "/",
  validateAddNewPet,
  addNewPet
);

export default Router;
