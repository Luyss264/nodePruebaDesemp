import { Transaction } from "sequelize";
import { Inventory, Medicine, Warehouse } from "../models/index.js";
import type { CreateInventoryDto, UpdateInventoryDto } from "../types/inventory.types.js";

export class InventoryRepository {
  public async create(data: CreateInventoryDto, transaction?: Transaction): Promise<Inventory> {
    return Inventory.create(data, { transaction });
  }

  public async findAll(): Promise<Inventory[]> {
    return Inventory.findAll({
      where: { isActive: true },
      include: [Warehouse, Medicine],
      order: [["id", "ASC"]]
    });
  }

  public async findById(id: number, transaction?: Transaction): Promise<Inventory | null> {
    return Inventory.findOne({
      where: { id, isActive: true },
      include: [Warehouse, Medicine],
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined
    });
  }

  public async findByWarehouseAndMedicine(
    warehouseId: number,
    medicineId: number,
    transaction?: Transaction
  ): Promise<Inventory | null> {
    return Inventory.findOne({
      where: { warehouseId, medicineId, isActive: true },
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined
    });
  }

  public async update(inventory: Inventory, data: UpdateInventoryDto): Promise<Inventory> {
    return inventory.update(data);
  }

  public async softDelete(inventory: Inventory): Promise<Inventory> {
    return inventory.update({ isActive: false });
  }

  public async increase(inventory: Inventory, quantity: number): Promise<Inventory> {
    return inventory.update({ quantity: inventory.quantity + quantity });
  }

  public async decrease(inventory: Inventory, quantity: number): Promise<Inventory> {
    if (inventory.quantity < quantity) {
      throw new Error("INVENTORY_INSUFFICIENT");
    }

    return inventory.update({ quantity: inventory.quantity - quantity });
  }
}

export const inventoryRepository = new InventoryRepository();
