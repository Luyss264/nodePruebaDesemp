import type { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ValidationError, UniqueConstraintError } from "sequelize";
import { ApiError } from "../utils/ApiErrors.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next): void => {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof MulterError) {
    response.status(400).json({ message: "Error uploading file" });
    return;
  }

  if (error instanceof UniqueConstraintError) {
    response.status(409).json({ message: "A record with this unique value already exists" });
    return;
  }

  if (error instanceof ValidationError) {
    response.status(400).json({ message: error.errors[0]?.message ?? "Invalid data" });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Internal server error" });
};
