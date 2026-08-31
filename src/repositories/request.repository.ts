import { Transaction } from "sequelize";
import { Clinic, Medicine, SupplyRequest, Warehouse } from "../models/index.js";
import type { CreateSupplyRequestDto, RequestStatus, UpdateRequestDto } from "../types/request.types.js";

export class RequestRepository {
  public async create(data: CreateSupplyRequestDto, transaction?: Transaction): Promise<SupplyRequest> {
    return SupplyRequest.create(data, { transaction });
  }

  public async findAll(): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: { isActive: true },
      include: [Clinic, Medicine, Warehouse],
      order: [["id", "DESC"]]
    });
  }

  public async findById(id: number, transaction?: Transaction): Promise<SupplyRequest | null> {
    return SupplyRequest.findOne({
      where: { id, isActive: true },
      include: [Clinic, Medicine, Warehouse],
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined
    });
  }

  public async update(
    request: SupplyRequest,
    data: UpdateRequestDto,
    transaction?: Transaction
  ): Promise<SupplyRequest> {
    return request.update(data, { transaction });
  }

  public async updateStatus(
    request: SupplyRequest,
    status: RequestStatus,
    transaction?: Transaction
  ): Promise<SupplyRequest> {
    return request.update({ status }, { transaction });
  }

  public async softDelete(request: SupplyRequest, transaction?: Transaction): Promise<SupplyRequest> {
    return request.update({ isActive: false }, { transaction });
  }

  public async findActive(): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: { isActive: true, status: ["PENDING", "APPROVED", "ASSIGNED"] },
      include: [Clinic, Medicine, Warehouse],
      order: [["id", "DESC"]]
    });
  }

  public async findByClinic(clinicId: number): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: { clinicId, isActive: true },
      include: [Clinic, Medicine, Warehouse],
      order: [["id", "DESC"]]
    });
  }
}

export const requestRepository = new RequestRepository();
