import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "../types/auth.types.js";
import { verifyAccessToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(request: Request, response: Response, next: NextFunction): void {
  try {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      response.status(401).json({ message: "Token is required" });
      return;
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      response.status(401).json({ message: "Token is required" });
      return;
    }

    request.user = verifyAccessToken(token);
    next();
  } catch {
    response.status(401).json({ message: "Token is invalid or expired" });
  }
}
