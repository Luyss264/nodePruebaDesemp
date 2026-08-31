export type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "ASSIGNED"
  | "COMPLETED"
  | "CANCELLED";

export interface CreateSupplyRequestDto {
  clinicId: number;
  medicineId: number;
  quantity: number;
  warehouseId: number;
  status: RequestStatus;
}

export interface UpdateRequestDto {
  clinicId?: number;
  medicineId?: number;
  quantity?: number;
  warehouseId?: number;
  status?: RequestStatus;
}

export interface UpdateRequestStatusDto {
  status: RequestStatus;
}
