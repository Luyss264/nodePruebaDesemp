import { sequelize } from "../config/database.js";
import type { CreateSupplyRequestDto, RequestStatus, UpdateRequestDto } from "../types/request.types.js";
import { clinicRepository } from "../repositories/clinic.repository.js";
import { inventoryRepository } from "../repositories/inventory.repository.js";
import { medicineRepository } from "../repositories/medicine.repository.js";
import { requestRepository } from "../repositories/request.repository.js";
import { warehouseRepository } from "../repositories/warehouse.repository.js";
import { ApiError } from "../utils/ApiErrors.js";

const allowedStatuses: RequestStatus[] = ["PENDING", "APPROVED", "ASSIGNED", "COMPLETED", "CANCELLED"];
const reservedStatuses: RequestStatus[] = ["PENDING", "APPROVED", "ASSIGNED", "COMPLETED"];

function isValidStatus(status: string): status is RequestStatus {
  return allowedStatuses.includes(status as RequestStatus);
}

function reservesInventory(status: RequestStatus): boolean {
  return reservedStatuses.includes(status);
}

export class RequestService {
  public async create(data: CreateSupplyRequestDto) {
    if (!isValidStatus(data.status)) {
      throw new ApiError("Invalid request status", 400);
    }

    if (data.quantity <= 0) {
      throw new ApiError("Quantity must be greater than zero", 400);
    }

    return sequelize.transaction(async (transaction) => {
      await this.validateReferences(data.clinicId, data.medicineId, data.warehouseId);

      if (reservesInventory(data.status)) {
        const inventory = await inventoryRepository.findByWarehouseAndMedicine(
          data.warehouseId,
          data.medicineId,
          transaction
        );

        if (!inventory) {
          throw new ApiError("Medicine does not exist in the warehouse inventory", 400);
        }

        if (inventory.quantity < data.quantity) {
          throw new ApiError("Insufficient inventory", 400);
        }

        await inventoryRepository.decrease(inventory, data.quantity, transaction);
      }

      return requestRepository.create(data, transaction);
    });
  }

  public async findAll() {
    return requestRepository.findAll();
  }

  public async getById(id: number) {
    const request = await requestRepository.findById(id);

    if (!request) {
      throw new ApiError("Supply request not found", 404);
    }

    return request;
  }

  public async updateStatus(id: number, status: RequestStatus) {
    if (!isValidStatus(status)) {
      throw new ApiError("Status is not allowed", 400);
    }

    return sequelize.transaction(async (transaction) => {
      const request = await requestRepository.findById(id, transaction);

      if (!request) {
        throw new ApiError("Supply request not found", 404);
      }

      const wasReserved = request.isActive && reservesInventory(request.status);
      const willBeReserved = request.isActive && reservesInventory(status);

      if (wasReserved && !willBeReserved) {
        const inventory = await inventoryRepository.findByWarehouseAndMedicine(
          request.warehouseId,
          request.medicineId,
          transaction
        );

        if (inventory) {
          await inventoryRepository.increase(inventory, request.quantity, transaction);
        }
      }

      if (!wasReserved && willBeReserved) {
        const inventory = await inventoryRepository.findByWarehouseAndMedicine(
          request.warehouseId,
          request.medicineId,
          transaction
        );

        if (!inventory) {
          throw new ApiError("Medicine does not exist in the warehouse inventory", 400);
        }

        if (inventory.quantity < request.quantity) {
          throw new ApiError("Insufficient inventory", 400);
        }

        await inventoryRepository.decrease(inventory, request.quantity, transaction);
      }

      return requestRepository.updateStatus(request, status, transaction);
    });
  }

  public async update(id: number, data: UpdateRequestDto) {
    if (data.quantity !== undefined && data.quantity <= 0) {
      throw new ApiError("Quantity must be greater than zero", 400);
    }

    if (data.status !== undefined && !isValidStatus(data.status)) {
      throw new ApiError("Status is not allowed", 400);
    }

    return sequelize.transaction(async (transaction) => {
      const request = await requestRepository.findById(id, transaction);

      if (!request) {
        throw new ApiError("Supply request not found", 404);
      }

      const clinicId = data.clinicId ?? request.clinicId;
      const medicineId = data.medicineId ?? request.medicineId;
      const warehouseId = data.warehouseId ?? request.warehouseId;
      const quantity = data.quantity ?? request.quantity;
      const status = data.status ?? request.status;

      await this.validateReferences(clinicId, medicineId, warehouseId);

      const oldReserved = request.isActive && reservesInventory(request.status);
      const newReserved = request.isActive && reservesInventory(status);
      const inventoryChanged = request.medicineId !== medicineId || request.warehouseId !== warehouseId;
      const quantityChanged = request.quantity !== quantity;

      if (oldReserved && (!newReserved || inventoryChanged || quantityChanged)) {
        const oldInventory = await inventoryRepository.findByWarehouseAndMedicine(
          request.warehouseId,
          request.medicineId,
          transaction
        );

        if (oldInventory) {
          await inventoryRepository.increase(oldInventory, request.quantity, transaction);
        }
      }

      if (newReserved && (!oldReserved || inventoryChanged || quantityChanged)) {
        const newInventory = await inventoryRepository.findByWarehouseAndMedicine(
          warehouseId,
          medicineId,
          transaction
        );

        if (!newInventory) {
          throw new ApiError("Medicine does not exist in the warehouse inventory", 400);
        }

        if (newInventory.quantity < quantity) {
          throw new ApiError("Insufficient inventory", 400);
        }

        await inventoryRepository.decrease(newInventory, quantity, transaction);
      }

      return requestRepository.update(request, {
        clinicId,
        medicineId,
        warehouseId,
        quantity,
        status
      }, transaction);
    });
  }

  public async delete(id: number) {
    return sequelize.transaction(async (transaction) => {
      const request = await requestRepository.findById(id, transaction);

      if (!request) {
        throw new ApiError("Supply request not found", 404);
      }

      if (reservesInventory(request.status)) {
        const inventory = await inventoryRepository.findByWarehouseAndMedicine(
          request.warehouseId,
          request.medicineId,
          transaction
        );

        if (inventory) {
          await inventoryRepository.increase(inventory, request.quantity, transaction);
        }
      }

      return requestRepository.softDelete(request, transaction);
    });
  }

  public async getActiveRequests() {
    return requestRepository.findActive();
  }

  public async getClinicHistory(clinicId: number) {
    const clinic = await clinicRepository.findById(clinicId);

    if (!clinic) {
      throw new ApiError("Clinic not found", 404);
    }

    return requestRepository.findByClinic(clinicId);
  }

  private async validateReferences(clinicId: number, medicineId: number, warehouseId: number): Promise<void> {
    const [clinic, medicine, warehouse] = await Promise.all([
      clinicRepository.findById(clinicId),
      medicineRepository.findById(medicineId),
      warehouseRepository.findById(warehouseId)
    ]);

    if (!clinic) {
      throw new ApiError("Clinic does not exist", 404);
    }

    if (!medicine) {
      throw new ApiError("Medicine does not exist", 404);
    }

    if (!warehouse) {
      throw new ApiError("Warehouse does not exist", 404);
    }
  }
}

export const requestService = new RequestService();
