export interface CreateInventoryDto {
  warehouseId: number;
  medicineId: number;
  quantity: number;
}

export interface UpdateInventoryDto {
  quantity?: number;
}
