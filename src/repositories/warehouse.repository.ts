import { Warehouse } from "../models/index.js";
import type { CreateWarehouseDto, UpdateWarehouseDto } from "../types/warehouse.types.js";

export class WarehouseRepository {
  public async create(data: CreateWarehouseDto): Promise<Warehouse> {
    return Warehouse.create(data);
  }

  public async findAll(): Promise<Warehouse[]> {
    return Warehouse.findAll({ where: { isActive: true }, order: [["id", "ASC"]] });
  }

  public async findById(id: number): Promise<Warehouse | null> {
    return Warehouse.findOne({ where: { id, isActive: true } });
  }

  public async update(warehouse: Warehouse, data: UpdateWarehouseDto): Promise<Warehouse> {
    return warehouse.update(data);
  }

  public async softDelete(warehouse: Warehouse): Promise<Warehouse> {
    return warehouse.update({ isActive: false });
  }
}

export const warehouseRepository = new WarehouseRepository();
