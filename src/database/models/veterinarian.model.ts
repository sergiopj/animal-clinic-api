import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database.js';

interface VeterinarianAttributes {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialties?: string[];
  phone?: string;
  email: string;
  clinicId: number;
}

interface VeterinarianCreationAttributes extends Optional<VeterinarianAttributes, 'id'> {}

class Veterinarian extends Model<VeterinarianAttributes, VeterinarianCreationAttributes> {
  // No se declaran los campos públicos aquí
}

Veterinarian.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
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
    tableName: 'veterinarians',
    timestamps: true,
  }
);

export default Veterinarian;
