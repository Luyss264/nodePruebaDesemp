export interface CreateClinicDto {
  name: string;
  nit: string;
  responsibleName: string;
  responsibleEmail: string;
}

export interface UpdateClinicDto {
  name?: string;
  nit?: string;
  responsibleName?: string;
  responsibleEmail?: string;
}
