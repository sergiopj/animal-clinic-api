// TODO hacerlo multi-idioma, con traducciones para cada campo y fecha en formato local segun el idioma del front
const locale = 'es-ES'; // Spanish locale for date formatting
const codification = 'utf-8'; // Ensure UTF-8 encoding for special characters
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { IPdfRenderOptions } from '../pdf-render.interface.js';



export const getPdfBuffer = async (html: string, options?: IPdfRenderOptions): Promise<Buffer> => {
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
  


export const startChromium = async () => {
    return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });
}

export const generatePdfBuffer = async (html: string, options?: IPdfRenderOptions): Promise<Buffer> => {
  const browser = await startChromium();
  
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


export const generatedDate = new Date().toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});
