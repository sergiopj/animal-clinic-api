import { readFile } from 'fs/promises';
import { join } from 'path';

import chromium from '@sparticuz/chromium';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer-core';

import { ResponseClinicDTO } from '../../modules/clinic/dto/Response/response-clinic.dto.js';
import { ResponsePetDTO } from '../../modules/pet/dto/Response/response-pet.dto.js';

import { IPdfRenderOptions } from './pdf-render.interface.js';

const locale = 'es-ES'; // Spanish locale for date formatting

export const generatePetClinicalHistoryPDF = async (
  clinic: ResponseClinicDTO,
  pet: ResponsePetDTO,
  options?: IPdfRenderOptions
): Promise<Buffer> => {
  // Cargar plantilla y estilos
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
    'pet-clinical-history-report.style.css'
  );

  const [templateContent, stylesContent] = await Promise.all([
    readFile(templatePath, 'utf-8'),
    readFile(stylesPath, 'utf-8'),
  ]);

  const template = Handlebars.compile(templateContent);

  // Mapear datos al formato que espera la plantilla
  const data = {
    clinic: mappingClinicToTemplateData(clinic),
    pet: mappingPetToTemplateData(pet),
    generatedDate: new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    year: new Date().getFullYear(),
    styles: stylesContent, // Inyectar CSS
  };

  const html = template(data);

  // Usar Chromium ligero para despliegues en Docker/Kubernetes
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });

  const pdfBuffer = await page.pdf({
    format: options?.format || 'A4',
    landscape: options?.orientation === 'landscape',
    margin: {
      top: options?.margin || '15px',
      right: options?.margin || '15px',
      bottom: options?.margin || '15px',
      left: options?.margin || '15px',
    },
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
};

// Mapea los datos de la clínica a un formato simple para la plantilla
const mappingClinicToTemplateData = (clinic: ResponseClinicDTO) => {
  return {
    name: clinic.name,
    address: clinic.address,
    phone: clinic.phone,
    email: clinic.email,
  };
};

// Mapea los datos de la mascota a un formato simple para la plantilla
const mappingPetToTemplateData = (pet: ResponsePetDTO) => {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed || 'No especificada',
    gender: pet.gender,
    birthdate: new Date(pet.birthdate).toLocaleDateString(locale),
    weight: pet.weight || 'No registrado',
    color: pet.color || 'No registrado',
    notes: pet.notes,
    isVaccinated: pet.isVaccinated,
    isSterilized: pet.isSterilized,
    medicalReport:
      pet.medicalReport?.map((report) => ({
        ...report,
        date: new Date(report.date).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        veterinarian: {
          firstName: report.veterinarianId.firstName,
          lastName: report.veterinarianId.lastName,
        },
      })) || [],
  };
};
