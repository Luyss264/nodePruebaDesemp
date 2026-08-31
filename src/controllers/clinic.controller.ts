import type { NextFunction, Request, Response } from "express";
import { clinicService } from "../services/clinic.service.js";

export class ClinicController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const clinic = await clinicService.create(request.body);
      response.status(201).json({ message: "Clinic created successfully", data: clinic });
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await clinicService.findAll() });
    } catch (error) {
      next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const clinic = await clinicService.update(Number(request.params.id), request.body);
      response.json({ message: "Clinic updated successfully", data: clinic });
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      await clinicService.delete(Number(request.params.id));
      response.json({ message: "Clinic deactivated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const clinicController = new ClinicController();
