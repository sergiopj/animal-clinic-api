import type { ResponseClinicDTO } from './dto/Response/response-clinic.dto.js';

export interface ClinicReportPort {
  generateReport(clinic: ResponseClinicDTO): Promise<Buffer>;
}
