import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

// Create a new router instance
const router = Router();

// Define the routes and associate them with controller functions
router.post('/register', register);
router.post('/login', login);

// Export the router to be used in our main server file
export default router;
