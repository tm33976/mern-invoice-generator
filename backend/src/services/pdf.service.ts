import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Helper function to format the date as DD/MM/YY
const getFormattedDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

export const generatePdf = async (invoiceData: any) => {
  const templatePath = path.join(__dirname, '../templates/invoice.template.html');
  let html = fs.readFileSync(templatePath, 'utf-8');

  const currentDate = getFormattedDate();

  let productRows = '';
  for (const product of invoiceData.products) {
    const totalAmount = product.quantity * product.rate;
    productRows += `
      <tr>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>₹${product.rate.toFixed(2)}</td>
        <td class="text-right">₹${totalAmount.toFixed(2)}</td>
      </tr>
    `;
  }

  // Use a global regex replace (/.../g) to catch all instances of the placeholder
  html = html.replace(/{{personName}}/g, invoiceData.personName);
  html = html.replace(/{{personEmail}}/g, invoiceData.personEmail);
  html = html.replace(/{{currentDate}}/g, currentDate);
  html = html.replace('<!-- PRODUCTS_ROW_PLACEHOLDER -->', productRows);
  html = html.replace(/{{total}}/g, invoiceData.total.toFixed(2));
  html = html.replace(/{{gst}}/g, invoiceData.gst.toFixed(2));
  html = html.replace(/{{grandTotal}}/g, invoiceData.grandTotal.toFixed(2));

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({ 
    format: 'A4', 
    printBackground: true 
  });
  
  await browser.close();

  return pdfBuffer;
};
