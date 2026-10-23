import type { ClinicReportPort } from '../../../modules/clinic/clinic-report.port.js';
import type { PetReportPort } from '../../../modules/pet/pet-report.port.js';

import {
  generateClinicDetailReportPDF,
  generatePetClinicalHistoryReportPDF,
} from './pdf-render-report.js';

export class ClinicPdfReportAdapter implements ClinicReportPort {
  public generateReport(
    clinic: Parameters<ClinicReportPort['generateReport']>[0]
  ): Promise<Buffer> {
    return generateClinicDetailReportPDF(clinic);
  }
}

export class PetPdfReportAdapter implements PetReportPort {
  public generateReport(pet: Parameters<PetReportPort['generateReport']>[0]): Promise<Buffer> {
    return generatePetClinicalHistoryReportPDF(pet);
  }
}
