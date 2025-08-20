import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

// Extend the Express Request type to include our custom 'user' property
interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Check for the token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our secret key
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // 3. Get user from the token's ID and attach it to the request object
      // We exclude the password when fetching the user data
      req.user = await User.findById(decoded.id).select('-password');
      
      // 4. Move on to the next step (the actual route logic)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
