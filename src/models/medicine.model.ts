import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface MedicineAttributes {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

interface MedicineCreationAttributes extends Optional<MedicineAttributes, "id" | "description" | "isActive"> {}

export class Medicine extends Model<MedicineAttributes, MedicineCreationAttributes> implements MedicineAttributes {
  declare id: number;
  declare name: string;
  declare description: string | null;
  declare isActive: boolean;
}

Medicine.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "medicines", timestamps: true }
);
