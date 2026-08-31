import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";
import type { UserRole } from "../types/auth.types.js";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken: string | null;
  isActive: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "refreshToken" | "isActive"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare refreshToken: string | null;
  declare isActive: boolean;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM("ADMIN", "REQUEST_MANAGER"), allowNull: false },
    refreshToken: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "users", timestamps: true }
);
