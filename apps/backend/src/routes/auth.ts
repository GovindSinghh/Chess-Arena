import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { signupSchema, loginSchema, hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { AuthRequest } from '../middleware/auth';
import { authenticate } from '../middleware/auth';
import { ZodError } from 'zod';

// Create a router with explicit typing
const router: Router = Router();

// Signup route
router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({
        message: 'User already exists'
      });
      return;
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password);
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        provider: 'EMAIL'
      },
      select: {
        id: true,
        email: true,
        username: true,
        rating: true
      }
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
      return;
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      res.status(401).json({
        message: 'No user found'
      });
      return;
    }

    // Verify password
    const isValidPassword = await comparePasswords(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      res.status(401).json({
        message: 'Invalid email or password'
      });
      return;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        rating: user.rating
      },
      token
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get current user route
router.get('/me', authenticate, (req: Request, res: Response, next: NextFunction):void=> {
  try {
    const authReq = req as unknown as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    res.json({ user: authReq.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

export const authRouter = router;