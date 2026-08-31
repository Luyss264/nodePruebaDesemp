import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface ClinicAttributes {
  id: number;
  name: string;
  nit: string;
  responsibleName: string;
  responsibleEmail: string;
  isActive: boolean;
}

interface ClinicCreationAttributes extends Optional<ClinicAttributes, "id" | "isActive"> {}

export class Clinic extends Model<ClinicAttributes, ClinicCreationAttributes> implements ClinicAttributes {
  declare id: number;
  declare name: string;
  declare nit: string;
  declare responsibleName: string;
  declare responsibleEmail: string;
  declare isActive: boolean;
}

Clinic.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    nit: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    responsibleName: { type: DataTypes.STRING(160), allowNull: false },
    responsibleEmail: { type: DataTypes.STRING(160), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "clinics", timestamps: true }
);
