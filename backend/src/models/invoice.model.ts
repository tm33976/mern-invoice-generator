import { Schema, model, Document, Types } from 'mongoose';

// Interface describing a single product within an invoice
interface IProduct extends Document {
  name: string;
  quantity: number;
  rate: number;
}

// Interface describing the main Invoice document
interface IInvoice extends Document {
  user: Types.ObjectId; // Reference to the user who created the invoice
  personName: string; // Name of the client/traveller
  personEmail: string; // Email of the client/traveller
  products: IProduct[];
  total: number;
  gst: number;
  grandTotal: number;
}

// Mongoose schema for a single product
const productSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
});

// Mongoose schema for the main invoice
const invoiceSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  personName: { type: String, required: true },
  personEmail: { type: String, required: true },
  products: [productSchema],
  total: { type: Number, required: true },
  gst: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Invoice model
export const Invoice = model<IInvoice>('Invoice', invoiceSchema);
