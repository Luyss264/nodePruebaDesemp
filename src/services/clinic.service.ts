import type { CreateClinicDto, UpdateClinicDto } from "../types/clinic.types.js";
import { clinicRepository } from "../repositories/clinic.repository.js";
import { ApiError } from "../utils/ApiErrors.js";

export class ClinicService {
  public async create(data: CreateClinicDto) {
    const nit = data.nit.trim();
    const existingClinic = await clinicRepository.findByNit(nit);

    if (existingClinic) {
      throw new ApiError("A clinic with this NIT is already registered", 409);
    }

    return clinicRepository.create({
      ...data,
      name: data.name.trim(),
      nit,
      responsibleName: data.responsibleName.trim(),
      responsibleEmail: data.responsibleEmail.trim().toLowerCase()
    });
  }

  public async findAll() {
    return clinicRepository.findAll();
  }

  public async update(id: number, data: UpdateClinicDto) {
    const clinic = await clinicRepository.findById(id);

    if (!clinic) {
      throw new ApiError("Clinic not found", 404);
    }

    if (data.nit) {
      const duplicate = await clinicRepository.findByNit(data.nit.trim(), id);

      if (duplicate) {
        throw new ApiError("A clinic with this NIT is already registered", 409);
      }
    }

    return clinicRepository.update(clinic, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.nit !== undefined ? { nit: data.nit.trim() } : {}),
      ...(data.responsibleName !== undefined ? { responsibleName: data.responsibleName.trim() } : {}),
      ...(data.responsibleEmail !== undefined ? { responsibleEmail: data.responsibleEmail.trim().toLowerCase() } : {})
    });
  }

  public async delete(id: number) {
    const clinic = await clinicRepository.findById(id);

    if (!clinic) {
      throw new ApiError("Clinic not found", 404);
    }

    return clinicRepository.softDelete(clinic);
  }
}

export const clinicService = new ClinicService();
