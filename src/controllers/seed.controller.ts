import type { NextFunction, Request, Response } from "express";
import { seedService } from "../services/seed.service.js";
import { ApiError } from "../utils/ApiErrors.js";

export class SeedController {
  public async upload(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      if (!request.file) {
        throw new ApiError("A JSON file must be provided", 400);
      }

      await seedService.processFile(request.file.path);
      response.status(201).json({ message: "Data loaded successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const seedController = new SeedController();
