import fs from "fs/promises";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database.js";
import { Clinic, Inventory, Medicine, User, Warehouse } from "../models/index.js";
import type { UserRole } from "../types/auth.types.js";
import { ApiError } from "../utils/ApiErrors.js";

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface SeedClinic {
  name: string;
  nit: string;
  responsibleName: string;
  responsibleEmail: string;
}

interface SeedWarehouse {
  name: string;
  location: string;
}

interface SeedMedicine {
  name: string;
  description?: string;
}

interface SeedInventory {
  warehouseName: string;
  medicineName: string;
  quantity: number;
}

interface SeedData {
  users?: SeedUser[];
  clinics?: SeedClinic[];
  warehouses?: SeedWarehouse[];
  medicines?: SeedMedicine[];
  inventories?: SeedInventory[];
}

function validateSeedData(data: unknown): SeedData {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ApiError("Seed JSON must be an object", 400);
  }

  return data as SeedData;
}

export class SeedService {
  public async processFile(filePath: string): Promise<void> {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = validateSeedData(JSON.parse(fileContent));

      await sequelize.transaction(async (transaction) => {
        for (const user of data.users ?? []) {
          const password = await bcrypt.hash(user.password, 10);
          await User.findOrCreate({
            where: { email: user.email.trim().toLowerCase() },
            defaults: {
              ...user,
              email: user.email.trim().toLowerCase(),
              password
            },
            transaction
          });
        }

        for (const clinic of data.clinics ?? []) {
          await Clinic.findOrCreate({
            where: { nit: clinic.nit.trim() },
            defaults: {
              ...clinic,
              nit: clinic.nit.trim(),
              responsibleEmail: clinic.responsibleEmail.trim().toLowerCase()
            },
            transaction
          });
        }

        for (const warehouse of data.warehouses ?? []) {
          await Warehouse.findOrCreate({
            where: { name: warehouse.name.trim() },
            defaults: { name: warehouse.name.trim(), location: warehouse.location.trim() },
            transaction
          });
        }

        for (const medicine of data.medicines ?? []) {
          await Medicine.findOrCreate({
            where: { name: medicine.name.trim() },
            defaults: {
              name: medicine.name.trim(),
              description: medicine.description?.trim() ?? null
            },
            transaction
          });
        }

        for (const inventory of data.inventories ?? []) {
          if (!Number.isInteger(inventory.quantity) || inventory.quantity < 0) {
            throw new ApiError("Seed inventory quantity cannot be negative", 400);
          }

          const warehouse = await Warehouse.findOne({
            where: { name: inventory.warehouseName.trim(), isActive: true },
            transaction
          });
          const medicine = await Medicine.findOne({
            where: { name: inventory.medicineName.trim(), isActive: true },
            transaction
          });

          if (!warehouse) {
            throw new ApiError(`Warehouse not found: ${inventory.warehouseName}`, 404);
          }

          if (!medicine) {
            throw new ApiError(`Medicine not found: ${inventory.medicineName}`, 404);
          }

          await Inventory.findOrCreate({
            where: { warehouseId: warehouse.id, medicineId: medicine.id },
            defaults: {
              warehouseId: warehouse.id,
              medicineId: medicine.id,
              quantity: inventory.quantity
            },
            transaction
          });
        }
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ApiError("File does not contain valid JSON", 400);
      }

      throw error;
    } finally {
      await fs.unlink(filePath).catch(() => undefined);
    }
  }
}

export const seedService = new SeedService();
