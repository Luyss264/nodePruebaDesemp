import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export class AuthController {
  public async register(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.register(request.body);
      response.status(201).json({ message: "User registered successfully", data: user });
    } catch (error) {
      next(error);
    }
  }

  public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const tokens = await authService.login(request.body);
      response.status(200).json({ message: "Logged in successfully", data: tokens });
    } catch (error) {
      next(error);
    }
  }

  public async refresh(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const tokens = await authService.refresh(request.body);
      response.status(200).json({ message: "Tokens refreshed successfully", data: tokens });
    } catch (error) {
      next(error);
    }
  }

  public async logout(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      if (!request.user) {
        response.status(401).json({ message: "Unauthenticated" });
        return;
      }

      await authService.logout(request.user.id);
      response.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
