export interface ResponseVeterinarianDTO {
  _id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  email: string;
  phone?: string;
}

export interface ResponseMedicalReportDTO {
  _id: string;
  petId: string;
  clinicId: string;
  veterinarianId: ResponseVeterinarianDTO;
  diagnosis: string;
  treatment: string;
  date: Date;
}
