import { readFile } from 'fs/promises';
import { join } from 'path';

import Handlebars from 'handlebars';

import type { AIResponseDTO } from '../../../modules/ai/ai-query.model.js';
import { ResponseClinicDTO } from '../../../modules/clinic/dto/Response/response-clinic.dto.js';
import { ResponsePetDTO } from '../../../modules/pet/dto/Response/response-pet.dto.js';
import { getPdfBuffer, generatedDate } from '../../pdf-render/utils/pdf-render-utils.js';
import { IPdfRenderOptions } from '../pdf-render.interface.js';

// TODO hacerlo multi-idioma, con traducciones para cada campo y fecha en formato local segun el idioma del front
const locale = 'es-ES'; // Spanish locale for date formatting
const codification = 'utf-8'; // Ensure UTF-8 encoding for special characters

export const generateClinicDetailReportPDF = async (
  clinic: ResponseClinicDTO,
  options?: IPdfRenderOptions
): Promise<Buffer> => {
  // Load template and styles
  const templatePath = join(
    process.cwd(),
    'src',
    'shared',
    'templates',
    'pdf',
    'clinic',
    'clinic-detail',
    'clinic-detail-report.hbs'
  );
  const stylesPath = join(
    process.cwd(),
    'src',
    'shared',
    'templates',
    'pdf',
    'clinic',
    'clinic-detail',
    'clinic-detail-report.css'
  );

  const [templateContent, stylesContent] = await Promise.all([
    readFile(templatePath, codification),
    readFile(stylesPath, codification),
  ]);

  const template = Handlebars.compile(templateContent);

  // Convert Mongoose documents to plain objects for Handlebars
  const data = {
    ...mappingClinicToTemplateData(clinic),
    styles: stylesContent, // Inject CSS into template
  };

  const html = template(data);

  return Buffer.from(await getPdfBuffer(html, options));
};

const mappingClinicToTemplateData = (clinic: ResponseClinicDTO) => {
  return {
    name: clinic.name,
    address: clinic.address,
    phone: clinic.phone,
    email: clinic.email,
    website: clinic.website,
    vatNumber: clinic.vatNumber,
    licenseNumber: clinic.licenseNumber,
    veterinarians:
      clinic.veterinarians?.map((vet) => ({
        firstName: vet.firstName,
        lastName: vet.lastName,
        licenseNumber: vet.licenseNumber,
        email: vet.email,
        phone: vet.phone,
      })) || [],
    pets:
      clinic.pets?.map((pet) => ({
        name: pet.name,
        species: pet.species,
        gender: pet.gender,
        birthdate: pet.birthdate,
      })) || [],
    generatedDate: new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    year: new Date().getFullYear(),
  };
};

export const generatePetClinicalHistoryReportPDF = async (
  pet: ResponsePetDTO,
  options?: IPdfRenderOptions
): Promise<Buffer> => {
  // Load template and styles
  const templatePath = join(
    process.cwd(),
    'src',
    'shared',
    'templates',
    'pdf',
    'pet',
    'pet-clinical-history',
    'pet-clinical-history-report.hbs'
  );
  const stylesPath = join(
    process.cwd(),
    'src',
    'shared',
    'templates',
    'pdf',
    'pet',
    'pet-clinical-history',
    'pet-clinical-history-report.css'
  );

  const [templateContent, stylesContent] = await Promise.all([
    readFile(templatePath, codification),
    readFile(stylesPath, codification),
  ]);

  const template = Handlebars.compile(templateContent);

  const data = {
    pet: mappingPetToTemplateData(pet),
    generatedDate,
    year: new Date().getFullYear(),
    styles: stylesContent,
  };

  const html = template(data);

  return Buffer.from(await getPdfBuffer(html, options));
};

const mappingPetToTemplateData = (pet: ResponsePetDTO) => {
  return {
    name: pet.name,
    breed: pet.breed,
    species: pet.species,
    gender: pet.gender,
    birthdate: pet.birthdate,
    weight: pet.weight,
    color: pet.color,
    notes: pet.notes,
    isVaccinated: pet.isVaccinated,
    isSterilized: pet.isSterilized,
    medicalReport:
      pet.medicalReport?.map((report) => ({
        date: new Date(report.date).toLocaleDateString(locale),
        diagnosis: report.diagnosis,
        treatment: report.treatment,
        veterinarian: {
          firstName: report.veterinarianId.firstName,
          lastName: report.veterinarianId.lastName,
          licenseNumber: report.veterinarianId.licenseNumber,
          email: report.veterinarianId.email,
          phone: report.veterinarianId.phone,
        },
      })) || [],
  };
};

export const generatePetCareReportPDF = async (
  pet: ResponsePetDTO,
  analysis: AIResponseDTO,
  options?: IPdfRenderOptions
): Promise<Buffer> => {
  const templatePath = join(
    process.cwd(),
    'src',
    'shared',
    'templates',
    'pdf',
    'pet',
    'pet-care-report',
    'pet-care-report.hbs'
  );
  const stylesPath = join(
    process.cwd(),
    'src',
    'shared',
    'templates',
    'pdf',
    'pet',
    'pet-care-report',
    'pet-care-report.css'
  );

  const [templateContent, stylesContent] = await Promise.all([
    readFile(templatePath, codification),
    readFile(stylesPath, codification),
  ]);
  const template = Handlebars.compile(templateContent);
  const html = template({
    pet: mappingPetToTemplateData(pet),
    analysis,
    generatedDate: new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    year: new Date().getFullYear(),
    styles: stylesContent,
  });

  return Buffer.from(await getPdfBuffer(html, options));
};
