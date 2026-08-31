import type { NextFunction, Request, Response } from "express";
import { inventoryService } from "../services/inventory.service.js";

export class InventoryController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await inventoryService.create(request.body);
      response.status(201).json({ message: "Inventory record created successfully", data: inventory });
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await inventoryService.findAll() });
    } catch (error) {
      next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await inventoryService.update(Number(request.params.id), request.body);
      response.json({ message: "Inventory updated successfully", data: inventory });
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      await inventoryService.delete(Number(request.params.id));
      response.json({ message: "Inventory record deactivated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
