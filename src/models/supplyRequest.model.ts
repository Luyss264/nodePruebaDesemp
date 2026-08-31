import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";
import type { RequestStatus } from "../types/request.types.js";

interface SupplyRequestAttributes {
  id: number;
  clinicId: number;
  medicineId: number;
  warehouseId: number;
  quantity: number;
  status: RequestStatus;
  isActive: boolean;
}

interface SupplyRequestCreationAttributes extends Optional<SupplyRequestAttributes, "id" | "isActive"> {}

export class SupplyRequest extends Model<SupplyRequestAttributes, SupplyRequestCreationAttributes> implements SupplyRequestAttributes {
  declare id: number;
  declare clinicId: number;
  declare medicineId: number;
  declare warehouseId: number;
  declare quantity: number;
  declare status: RequestStatus;
  declare isActive: boolean;
}

SupplyRequest.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clinicId: { type: DataTypes.INTEGER, allowNull: false },
    medicineId: { type: DataTypes.INTEGER, allowNull: false },
    warehouseId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "ASSIGNED", "COMPLETED", "CANCELLED"),
      allowNull: false
    },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "supply_requests", timestamps: true }
);
