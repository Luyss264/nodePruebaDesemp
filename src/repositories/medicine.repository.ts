import { Medicine } from "../models/index.js";
import type { CreateMedicineDto, UpdateMedicineDto } from "../types/medicine.types.js";

export class MedicineRepository {
  public async create(data: CreateMedicineDto): Promise<Medicine> {
    return Medicine.create(data);
  }

  public async findAll(): Promise<Medicine[]> {
    return Medicine.findAll({ where: { isActive: true }, order: [["id", "ASC"]] });
  }

  public async findById(id: number): Promise<Medicine | null> {
    return Medicine.findOne({ where: { id, isActive: true } });
  }

  public async update(medicine: Medicine, data: UpdateMedicineDto): Promise<Medicine> {
    return medicine.update(data);
  }

  public async softDelete(medicine: Medicine): Promise<Medicine> {
    return medicine.update({ isActive: false });
  }
}

export const medicineRepository = new MedicineRepository();
