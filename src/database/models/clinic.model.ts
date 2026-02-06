import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database.js';

interface ClinicAttributes {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  licenseNumber: string;
}

interface ClinicCreationAttributes extends Optional<ClinicAttributes, 'id'> {}

class Clinic extends Model<ClinicAttributes, ClinicCreationAttributes> {
  // No se declaran los campos públicos aquí para evitar el "shadowing"
}

Clinic.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'clinics',
    timestamps: true,
  }
);

export default Clinic;
