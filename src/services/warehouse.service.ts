import type { CreateWarehouseDto, UpdateWarehouseDto } from "../types/warehouse.types.js";
import { warehouseRepository } from "../repositories/warehouse.repository.js";
import { requestRepository } from "../repositories/request.repository.js";
import { ApiError } from "../utils/ApiErrors.js";

export class WarehouseService {
  public async create(data: CreateWarehouseDto) {
    return warehouseRepository.create({ name: data.name.trim(), location: data.location.trim() });
  }

  public async findAll() {
    return warehouseRepository.findAll();
  }

  public async update(id: number, data: UpdateWarehouseDto) {
    const warehouse = await warehouseRepository.findById(id);

    if (!warehouse) {
      throw new ApiError("Warehouse not found", 404);
    }

    return warehouseRepository.update(warehouse, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.location !== undefined ? { location: data.location.trim() } : {})
    });
  }

  public async delete(id: number) {
    const warehouse = await warehouseRepository.findById(id);

    if (!warehouse) {
      throw new ApiError("Warehouse not found", 404);
    }

    if (await requestRepository.hasActiveForWarehouse(id)) {
      throw new ApiError("Cannot deactivate a warehouse with active supply requests", 409);
    }

    return warehouseRepository.softDelete(warehouse);
  }
}

export const warehouseService = new WarehouseService();
