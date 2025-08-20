import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import our route handlers
import authRoutes from './routes/auth.routes';
import invoiceRoutes from './routes/invoice.routes';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for our frontend
app.use(cors());
// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// --- API Routes ---
// All routes related to authentication will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
// All routes related to invoices will be prefixed with /api/invoices
app.use('/api/invoices', invoiceRoutes);

// --- Database Connection and Server Startup ---
mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('MongoDB connected successfully.');
        // Start the server only after a successful database connection
        app.listen(PORT, () => 
            console.log(`Server is running on http://localhost:${PORT}`)
        );
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process with an error code
    });
