import type { NextFunction, Request, Response } from "express";
import { warehouseService } from "../services/warehouse.service.js";

export class WarehouseController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const warehouse = await warehouseService.create(request.body);
      response.status(201).json({ message: "Warehouse created successfully", data: warehouse });
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await warehouseService.findAll() });
    } catch (error) {
      next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const warehouse = await warehouseService.update(Number(request.params.id), request.body);
      response.json({ message: "Warehouse updated successfully", data: warehouse });
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      await warehouseService.delete(Number(request.params.id));
      response.json({ message: "Warehouse deactivated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const warehouseController = new WarehouseController();
