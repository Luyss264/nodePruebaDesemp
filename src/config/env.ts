import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

interface Environment {
  nodeEnv: string;
  port: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresIn: SignOptions["expiresIn"];
  jwtRefreshExpiresIn: SignOptions["expiresIn"];
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

function getPositiveNumberEnv(name: string): number {
  const value = Number(getRequiredEnv(name));

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer`);
  }

  return value;
}

function getJwtExpiration(name: string): SignOptions["expiresIn"] {
  return getRequiredEnv(name) as SignOptions["expiresIn"];
}

export const env: Environment = {
  nodeEnv: getRequiredEnv("NODE_ENV"),
  port: getPositiveNumberEnv("PORT"),
  dbHost: getRequiredEnv("DB_HOST"),
  dbPort: getPositiveNumberEnv("DB_PORT"),
  dbName: getRequiredEnv("DB_NAME"),
  dbUser: getRequiredEnv("DB_USER"),
  dbPassword: getRequiredEnv("DB_PASSWORD"),
  jwtAccessSecret: getRequiredEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: getRequiredEnv("JWT_REFRESH_SECRET"),
  jwtAccessExpiresIn: getJwtExpiration("JWT_ACCESS_EXPIRES_IN"),
  jwtRefreshExpiresIn: getJwtExpiration("JWT_REFRESH_EXPIRES_IN")
};
