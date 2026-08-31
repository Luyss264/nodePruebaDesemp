import type { CreateInventoryDto, UpdateInventoryDto } from "../types/inventory.types.js";
import { inventoryRepository } from "../repositories/inventory.repository.js";
import { medicineRepository } from "../repositories/medicine.repository.js";
import { requestRepository } from "../repositories/request.repository.js";
import { warehouseRepository } from "../repositories/warehouse.repository.js";
import { ApiError } from "../utils/ApiErrors.js";

export class InventoryService {
  public async create(data: CreateInventoryDto) {
    if (data.quantity < 0) {
      throw new ApiError("Inventory quantity cannot be negative", 400);
    }

    const [warehouse, medicine, duplicate] = await Promise.all([
      warehouseRepository.findById(data.warehouseId),
      medicineRepository.findById(data.medicineId),
      inventoryRepository.findByWarehouseAndMedicine(data.warehouseId, data.medicineId)
    ]);

    if (!warehouse) {
      throw new ApiError("Warehouse does not exist", 404);
    }

    if (!medicine) {
      throw new ApiError("Medicine does not exist", 404);
    }

    if (duplicate) {
      throw new ApiError("An inventory record for this medicine already exists in this warehouse", 409);
    }

    return inventoryRepository.create(data);
  }

  public async findAll() {
    return inventoryRepository.findAll();
  }

  public async update(id: number, data: UpdateInventoryDto) {
    if (data.quantity !== undefined && data.quantity < 0) {
      throw new ApiError("Inventory quantity cannot be negative", 400);
    }

    const inventory = await inventoryRepository.findById(id);

    if (!inventory) {
      throw new ApiError("Inventory record not found", 404);
    }

    return inventoryRepository.update(inventory, data);
  }

  public async delete(id: number) {
    const inventory = await inventoryRepository.findById(id);

    if (!inventory) {
      throw new ApiError("Inventory record not found", 404);
    }

    if (await requestRepository.hasActiveForInventory(inventory.warehouseId, inventory.medicineId)) {
      throw new ApiError("Cannot deactivate inventory with active supply requests", 409);
    }

    return inventoryRepository.softDelete(inventory);
  }
}

export const inventoryService = new InventoryService();
