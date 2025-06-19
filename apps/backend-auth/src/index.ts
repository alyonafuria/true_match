import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import { cvRouter } from './routes/cv';
import iiAuthRouter from './routes/ii-auth';
import { authenticateToken } from './routes/ii-auth';

dotenv.config();

// Log environment variables for debugging
console.log('Environment Variables:', {
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV || 'development'
});

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:9002', // Frontend development server
  'http://localhost:3000', // Next.js dev server
  'http://localhost:8000', // Local IC replica
  'https://identity.ic0.app', // Internet Identity canister
  'https://identity.internetcomputer.org', // Internet Identity production
  // Add other allowed origins as needed
];

// Log allowed origins for debugging
console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('Request with no origin - allowing');
      return callback(null, true);
    }
    
    // Check if origin is in the allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.startsWith(allowedOrigin.replace('*', ''))
    );

    if (isAllowed) {
      console.log(`Allowed CORS for origin: ${origin}`);
      return callback(null, true);
    } else {
      console.log(`Blocked CORS for origin: ${origin}`);
      const msg = `The CORS policy for this site does not allow access from the specified Origin (${origin}).`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Referer',
    'User-Agent'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 600, // 10 minutes
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// File upload routes
app.use('/api', uploadRoutes);

// CV parsing route
app.use('/api', cvRouter);

// II Authentication routes
app.use('/api/ii', iiAuthRouter);

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        principal: string;
      };
    }
  }
}

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: req.user
  });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Auth routes
app.use('/auth', authRoutes);

// Routes
app.get('/', (_req, res) => {
  res.send(`
    <h1>TrueMatch API</h1>
    <p>Welcome to the TrueMatch API</p>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/auth/linkedin">Login with LinkedIn</a></li>
      <li>POST /api/cv - Upload a CV (PDF only, max 5MB)</li>
      <li>GET /uploads/:filename - Get an uploaded file</li>
    </ul>
  `);
});

app.use('/auth', authRoutes);

// Simple error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
