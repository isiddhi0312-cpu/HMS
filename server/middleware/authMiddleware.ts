import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Bypass authentication for demo purposes
  // Inject a mock admin user
  req.user = {
    _id: 'mock-admin-id',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    matchPassword: async () => true
  } as any;
  
  next();
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Always allow in demo mode since we default to admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // This path might not be reachable with the mock user above, but keeping for safety
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
