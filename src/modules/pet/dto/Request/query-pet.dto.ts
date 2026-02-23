import { PetGender, PetSpecies } from "../../pet.index.js";

export interface PetQueryParams {
  // Offset-based pagination
  page?: string | number;
  limit?: string | number;
  
  // Cursor-based pagination
  cursor?: string;
  
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | string;
  
  // Filters
  name?: string;
  gender?: PetGender; // TODO separado por comas?
  species?: PetSpecies; // TODO separado por coms varios  
}
