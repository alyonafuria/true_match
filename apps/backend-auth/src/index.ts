import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

// Log environment variables for debugging
console.log('Environment Variables:', {
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV || 'development'
});

const app = express();

// Basic CORS for local development
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.send(`
    <h1>LinkedIn OAuth Example</h1>
    <p>To test the LinkedIn OAuth flow, visit:</p>
    <a href="/auth/linkedin">Login with LinkedIn</a>
    <p>Or make a GET request to: <code>http://localhost:3001/auth/linkedin</code></p>
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
