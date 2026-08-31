import type { NextFunction, Request, Response } from "express";
import { medicineService } from "../services/medicine.service.js";

export class MedicineController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const medicine = await medicineService.create(request.body);
      response.status(201).json({ message: "Medicine created successfully", data: medicine });
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await medicineService.findAll() });
    } catch (error) {
      next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const medicine = await medicineService.update(Number(request.params.id), request.body);
      response.json({ message: "Medicine updated successfully", data: medicine });
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      await medicineService.delete(Number(request.params.id));
      response.json({ message: "Medicine deactivated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const medicineController = new MedicineController();
