import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database.js';
import { PetSpecies } from './enums/pet-species.enum.js';
import { PetGender } from './enums/pet-gender.enum.js';

interface PetAttributes {
  id: number;
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  birthdate: Date;
  weight?: number;
  color?: string;
  notes?: string;
  isVaccinated?: boolean;
  isSterilized?: boolean;
  clinicId: number;
}

interface PetCreationAttributes extends Optional<PetAttributes, 'id'> {}

class Pet extends Model<PetAttributes, PetCreationAttributes> {
  // No se declaran los campos públicos aquí
}

Pet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    species: {
      type: DataTypes.ENUM(...Object.values(PetSpecies)),
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(PetGender)),
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isVaccinated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSterilized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clinics',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'pets',
    timestamps: true,
  }
);

export default Pet;
