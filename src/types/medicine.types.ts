export interface CreateMedicineDto {
  name: string;
  description?: string;
}

export interface UpdateMedicineDto {
  name?: string;
  description?: string;
}
