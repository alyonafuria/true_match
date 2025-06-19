import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { Principal } from '@dfinity/principal';
import jwt from 'jsonwebtoken';

const router = Router();

// JWT secret - in production, use a proper secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface IIAuthRequest extends Request {
  body: {
    principal: string;
    // Add any additional verification data here
  };
}

// Verify II authentication
router.post('/verify', (async (req: IIAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { principal } = req.body;
    
    if (!principal) {
      return res.status(400).json({ error: 'Missing principal' });
    }

    // Validate the principal format
    try {
      Principal.fromText(principal);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid principal format' });
    }

    // In a real implementation, you would:
    // 1. Verify any signatures
    // 2. Check if the principal is allowed
    // 3. Create a session in your database

    // Create a JWT token
    const token = jwt.sign(
      { 
        principal,
        // Add any additional claims here
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );
    
    // Set the token in an HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    
    res.json({ 
      success: true, 
      token,
      principal
    });
    
  } catch (error) {
    console.error('II verification error:', error);
    next(error);
  }
}) as RequestHandler);

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { principal: string };
    (req as any).user = { principal: decoded.principal };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default router;
