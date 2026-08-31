import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface InventoryAttributes {
  id: number;
  warehouseId: number;
  medicineId: number;
  quantity: number;
  isActive: boolean;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, "id" | "isActive"> {}

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  declare id: number;
  declare warehouseId: number;
  declare medicineId: number;
  declare quantity: number;
  declare isActive: boolean;
}

Inventory.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    warehouseId: { type: DataTypes.INTEGER, allowNull: false },
    medicineId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  {
    sequelize,
    tableName: "inventories",
    timestamps: true,
    indexes: [{ unique: true, fields: ["warehouseId", "medicineId"] }]
  }
);
