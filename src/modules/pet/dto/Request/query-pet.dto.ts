import { PetGenderEnum } from '../../enums/pet-gender.enum.js';
import { PetSpeciesEnum } from '../../enums/pet-species.enum.js';

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
  gender?: PetGenderEnum; // TODO separado por comas?
  species?: PetSpeciesEnum; // TODO separado por coms varios
}
