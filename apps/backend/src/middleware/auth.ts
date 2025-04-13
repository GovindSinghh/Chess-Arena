import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import prisma from '../db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authenticate =(req: Request, res: Response, next: NextFunction): any => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { userId } = verifyToken(token);

    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        
        (req as AuthRequest).user = user;
        next();
      })
      .catch(err => {
        console.error('Auth error:', err);
        return res.status(401).json({ message: 'Invalid token' });
      });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};