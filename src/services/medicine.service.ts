import type { CreateMedicineDto, UpdateMedicineDto } from "../types/medicine.types.js";
import { medicineRepository } from "../repositories/medicine.repository.js";
import { ApiError } from "../utils/ApiErrors.js";

export class MedicineService {
  public async create(data: CreateMedicineDto) {
    return medicineRepository.create({
      name: data.name.trim(),
      ...(data.description !== undefined ? { description: data.description.trim() } : {})
    });
  }

  public async findAll() {
    return medicineRepository.findAll();
  }

  public async update(id: number, data: UpdateMedicineDto) {
    const medicine = await medicineRepository.findById(id);

    if (!medicine) {
      throw new ApiError("Medicine not found", 404);
    }

    return medicineRepository.update(medicine, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.description !== undefined ? { description: data.description.trim() } : {})
    });
  }

  public async delete(id: number) {
    const medicine = await medicineRepository.findById(id);

    if (!medicine) {
      throw new ApiError("Medicine not found", 404);
    }

    return medicineRepository.softDelete(medicine);
  }
}

export const medicineService = new MedicineService();
