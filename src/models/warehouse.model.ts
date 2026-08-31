import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface WarehouseAttributes {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, "id" | "isActive"> {}

export class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
  declare id: number;
  declare name: string;
  declare location: string;
  declare isActive: boolean;
}

Warehouse.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    location: { type: DataTypes.STRING(160), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "warehouses", timestamps: true }
);
