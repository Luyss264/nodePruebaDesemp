import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../types/auth.types.js";
import type { RequestStatus } from "../types/request.types.js";
import { ApiError } from "../utils/ApiErrors.js";

const validRoles: UserRole[] = ["ADMIN", "REQUEST_MANAGER"];
const validStatuses: RequestStatus[] = ["PENDING", "APPROVED", "ASSIGNED", "COMPLETED", "CANCELLED"];

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function validateEmail(value: unknown): boolean {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateRegister(request: Request, response: Response, next: NextFunction): void {
  try {
    const { name, email, password, role } = request.body;

    if (!isString(name) || !validateEmail(email) || !isString(password) || password.length < 6 || !validRoles.includes(role)) {
      throw new ApiError("Invalid registration data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateLogin(request: Request, response: Response, next: NextFunction): void {
  try {
    const { email, password } = request.body;

    if (!validateEmail(email) || !isString(password)) {
      throw new ApiError("Invalid login data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateRefresh(request: Request, response: Response, next: NextFunction): void {
  try {
    if (!isString(request.body.refreshToken)) {
      throw new ApiError("refreshToken is required", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateClinic(request: Request, response: Response, next: NextFunction): void {
  try {
    const { name, nit, responsibleName, responsibleEmail } = request.body;

    if (!isString(name) || !isString(nit) || !isString(responsibleName) || !validateEmail(responsibleEmail)) {
      throw new ApiError("Invalid clinic data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateClinicUpdate(request: Request, response: Response, next: NextFunction): void {
  try {
    const { name, nit, responsibleName, responsibleEmail } = request.body;
    const hasAny = name !== undefined || nit !== undefined || responsibleName !== undefined || responsibleEmail !== undefined;
    const valid = hasAny &&
      (name === undefined || isString(name)) &&
      (nit === undefined || isString(nit)) &&
      (responsibleName === undefined || isString(responsibleName)) &&
      (responsibleEmail === undefined || validateEmail(responsibleEmail));

    if (!valid) {
      throw new ApiError("Invalid clinic update data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateWarehouse(request: Request, response: Response, next: NextFunction): void {
  try {
    const { name, location } = request.body;

    if (!isString(name) || !isString(location)) {
      throw new ApiError("Invalid warehouse data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateWarehouseUpdate(request: Request, response: Response, next: NextFunction): void {
  try {
    const { name, location } = request.body;
    const hasAny = name !== undefined || location !== undefined;

    if (!hasAny || (name !== undefined && !isString(name)) || (location !== undefined && !isString(location))) {
      throw new ApiError("Invalid warehouse update data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateMedicine(request: Request, response: Response, next: NextFunction): void {
  try {
    if (!isString(request.body.name)) {
      throw new ApiError("Medicine name is required", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateMedicineUpdate(request: Request, response: Response, next: NextFunction): void {
  try {
    if (request.body.name !== undefined && !isString(request.body.name)) {
      throw new ApiError("Medicine name is invalid", 400);
    }
    if (request.body.description !== undefined && typeof request.body.description !== "string") {
      throw new ApiError("Medicine description is invalid", 400);
    }
    if (request.body.name === undefined && request.body.description === undefined) {
      throw new ApiError("At least one field must be provided for update", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateInventory(request: Request, response: Response, next: NextFunction): void {
  try {
    const { warehouseId, medicineId, quantity } = request.body;

    if (!isPositiveInteger(warehouseId) || !isPositiveInteger(medicineId) || !isNonNegativeInteger(quantity)) {
      throw new ApiError("Invalid inventory data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateInventoryUpdate(request: Request, response: Response, next: NextFunction): void {
  try {
    if (!isNonNegativeInteger(request.body.quantity)) {
      throw new ApiError("quantity must be an integer greater than or equal to zero", 400);
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function validateCreateRequest(request: Request, response: Response, next: NextFunction): void {
  try {
    const { clinicId, medicineId, quantity, warehouseId, status } = request.body;

    if (
      !isPositiveInteger(clinicId) ||
      !isPositiveInteger(medicineId) ||
      !isPositiveInteger(quantity) ||
      !isPositiveInteger(warehouseId) ||
      !validStatuses.includes(status)
    ) {
      throw new ApiError("Invalid supply request data", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateUpdateRequest(request: Request, response: Response, next: NextFunction): void {
  try {
    const body = request.body as Record<string, unknown>;
    const hasAnyUpdatableField = ["clinicId", "medicineId", "quantity", "warehouseId", "status"]
      .some((field) => body[field] !== undefined);

    if (!hasAnyUpdatableField) {
      throw new ApiError("At least one field must be provided for update", 400);
    }

    if (body.clinicId !== undefined && !isPositiveInteger(body.clinicId)) {
      throw new ApiError("clinicId is invalid", 400);
    }
    if (body.medicineId !== undefined && !isPositiveInteger(body.medicineId)) {
      throw new ApiError("medicineId is invalid", 400);
    }
    if (body.quantity !== undefined && !isPositiveInteger(body.quantity)) {
      throw new ApiError("quantity must be an integer greater than zero", 400);
    }
    if (body.warehouseId !== undefined && !isPositiveInteger(body.warehouseId)) {
      throw new ApiError("warehouseId is invalid", 400);
    }
    if (body.status !== undefined && !validStatuses.includes(body.status as RequestStatus)) {
      throw new ApiError("Status is not allowed", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateStatus(request: Request, response: Response, next: NextFunction): void {
  try {
    if (!validStatuses.includes(request.body.status)) {
      throw new ApiError("Status is not allowed", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateNumericParam(paramName: string) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const value = Number(request.params[paramName]);

    if (!Number.isInteger(value) || value <= 0) {
      next(new ApiError("Invalid identifier", 400));
      return;
    }

    next();
  };
}

export function validateNumericId(request: Request, response: Response, next: NextFunction): void {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError("Invalid identifier", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}
