import type { NextFunction, Request, Response } from "express";
import { requestService } from "../services/request.service.js";

export class RequestController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const supplyRequest = await requestService.create(request.body);
      response.status(201).json({ message: "Supply request created successfully", data: supplyRequest });
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await requestService.findAll() });
    } catch (error) {
      next(error);
    }
  }

  public async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await requestService.getById(Number(request.params.id)) });
    } catch (error) {
      next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const supplyRequest = await requestService.update(Number(request.params.id), request.body);
      response.json({ message: "Supply request updated successfully", data: supplyRequest });
    } catch (error) {
      next(error);
    }
  }

  public async updateStatus(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const supplyRequest = await requestService.updateStatus(Number(request.params.id), request.body.status);
      response.json({ message: "Status updated successfully", data: supplyRequest });
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      await requestService.delete(Number(request.params.id));
      response.json({ message: "Supply request deactivated successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async getActive(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await requestService.getActiveRequests() });
    } catch (error) {
      next(error);
    }
  }

  public async getHistory(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.json({ data: await requestService.getClinicHistory(Number(request.params.clinicId)) });
    } catch (error) {
      next(error);
    }
  }
}

export const requestController = new RequestController();
