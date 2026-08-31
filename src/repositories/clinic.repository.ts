import { Op } from "sequelize";
import { Clinic } from "../models/index.js";
import type { CreateClinicDto, UpdateClinicDto } from "../types/clinic.types.js";

export class ClinicRepository {
  public async create(data: CreateClinicDto): Promise<Clinic> {
    return Clinic.create(data);
  }

  public async findAll(): Promise<Clinic[]> {
    return Clinic.findAll({ where: { isActive: true }, order: [["id", "ASC"]] });
  }

  public async findById(id: number): Promise<Clinic | null> {
    return Clinic.findOne({ where: { id, isActive: true } });
  }

  public async findByNit(nit: string, excludingId?: number): Promise<Clinic | null> {
    return Clinic.findOne({
      where: {
        nit,
        ...(excludingId ? { id: { [Op.ne]: excludingId } } : {})
      }
    });
  }

  public async update(clinic: Clinic, data: UpdateClinicDto): Promise<Clinic> {
    return clinic.update(data);
  }

  public async softDelete(clinic: Clinic): Promise<Clinic> {
    return clinic.update({ isActive: false });
  }
}

export const clinicRepository = new ClinicRepository();
