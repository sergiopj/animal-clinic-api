import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { IPdfRenderOptions } from './pdf-render.interface.js';
import { ResponseClinicDTO } from '../../modules/clinic/dto/Response/response-clinic.dto.js';


// TODO hacerlo multi-idioma, con traducciones para cada campo y fecha en formato local segun el idioma del front
const locale = 'es-ES'; // Spanish locale for date formatting


export const generateClinicReportPDF = async (clinic: ResponseClinicDTO, options?: IPdfRenderOptions): Promise<Buffer> => {
  // Load template and styles
  const templatePath = join(process.cwd(), 'src', 'shared', 'templates', 'pdf', 'clinic-report.hbs');
  const stylesPath = join(process.cwd(), 'src', 'shared', 'templates', 'pdf', 'clinic-report.css');
  
  const [templateContent, stylesContent] = await Promise.all([
    readFile(templatePath, 'utf-8'),
    readFile(stylesPath, 'utf-8')
  ]);
  
  const template = Handlebars.compile(templateContent);
  
  // Convert Mongoose documents to plain objects for Handlebars
  const data = {
    ...mappingClinicToTemplateData(clinic),
    styles: stylesContent // Inject CSS into template
  };
  
  const html = template(data);
  
  // Use lightweight chromium for Docker/Kubernetes deployments
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
      left: options?.margin || '15px' 
    },
    printBackground: true
  });
  
  await browser.close();
  
  return Buffer.from(pdfBuffer);
}

const mappingClinicToTemplateData = (clinic: ResponseClinicDTO) => {
    return {
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email,
        website: clinic.website,
        vatNumber: clinic.vatNumber,
        licenseNumber: clinic.licenseNumber,
        veterinarians: clinic.veterinarians?.map(vet => ({
            firstName: vet.firstName,
            lastName: vet.lastName,
            licenseNumber: vet.licenseNumber,
            email: vet.email,
            phone: vet.phone,
            experienceYears: vet.experienceYears
        })) || [],
        pets: clinic.pets?.map(pet => ({
            name: pet.name,
            species: pet.species,
            gender: pet.gender,
            birthdate: pet.birthdate
        })) || [],
        generatedDate: new Date().toLocaleDateString(locale, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        year: new Date().getFullYear()
    };
}   
