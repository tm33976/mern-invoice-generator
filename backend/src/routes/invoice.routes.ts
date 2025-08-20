import { Router } from 'express';
import { createInvoiceAndGeneratePdf } from '../controllers/invoice.controller';
import { protect } from '../middleware/auth.middleware';

// Create a new router instance
const router = Router();

// Define the route for generating a PDF.
// The 'protect' middleware will run first to ensure the user is authenticated.
router.post('/generate-pdf', protect, createInvoiceAndGeneratePdf);

// Export the router
export default router;
