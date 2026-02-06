import Pet from '../../database/models/pet.model.js';
import Clinic from '../../database/models/clinic.model.js';
import { FindOptions } from 'sequelize';

const findAll = async (options?: FindOptions): Promise<Pet[]> => {
  return Pet.findAll({
    ...options,
    include: [{ model: Clinic, as: 'clinic' }],
  });
};

const findById = async (id: number): Promise<Pet | null> => {
  return Pet.findByPk(id, {
    include: [{ model: Clinic, as: 'clinic' }],
  });
};

const create = async (data: any): Promise<Pet> => {
  return Pet.create(data);
};

export default {
  findAll,
  findById,
  create,
};
