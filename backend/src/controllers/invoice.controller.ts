import { Response } from 'express';
import { Invoice } from '../models/invoice.model';
import { generatePdf } from '../services/pdf.service';

// Extend the Express Request type to include our custom 'user' property
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create a new invoice and generate a PDF
// @route   POST /api/invoices/generate-pdf
export const createInvoiceAndGeneratePdf = async (req: AuthRequest, res: Response) => {
  const { personName, personEmail, products } = req.body;

  // Basic validation
  if (!personName || !personEmail || !products || products.length === 0) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // 1. Calculate totals
    const total = products.reduce((acc: number, item: any) => acc + item.quantity * item.rate, 0);
    const gst = total * 0.18; // 18% GST
    const grandTotal = total + gst;

    // 2. Create and save the new invoice to the database
    const invoice = new Invoice({
      user: req.user._id, // The ID of the logged-in user from the 'protect' middleware
      personName,
      personEmail,
      products,
      total,
      gst,
      grandTotal,
    });
    const savedInvoice = await invoice.save();

    // 3. Prepare data for the PDF template
    const pdfData = {
      userName: req.user.name, // Logged-in user's name
      ...savedInvoice.toObject()
    };
    
    // 4. Generate the PDF
    const pdfBuffer = await generatePdf(pdfData);

    // 5. Send the PDF back to the client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating invoice' });
  }
};
