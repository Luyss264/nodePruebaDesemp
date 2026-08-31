import jwt, { type JwtPayload as JsonWebTokenPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload, UserRole } from "../types/auth.types.js";
import { ApiError } from "./ApiErrors.js";

function isUserRole(role: unknown): role is UserRole {
  return role === "ADMIN" || role === "REQUEST_MANAGER";
}

function parsePayload(payload: string | JsonWebTokenPayload): JwtPayload {
  if (typeof payload === "string") {
    throw new ApiError("Invalid token", 401);
  }

  if (!Number.isInteger(payload.id) || typeof payload.email !== "string" || !isUserRole(payload.role)) {
    throw new ApiError("Invalid token", 401);
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role
  };
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn
  });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return parsePayload(jwt.verify(token, env.jwtAccessSecret));
}

export function verifyRefreshToken(token: string): JwtPayload {
  return parsePayload(jwt.verify(token, env.jwtRefreshSecret));
}
