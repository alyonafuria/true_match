import { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = Router();

// Get environment variables
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('Missing required LinkedIn OAuth environment variables');
  process.exit(1);
}

// Start OAuth flow - redirect to LinkedIn
router.get('/linkedin', (_req: Request, res: Response): void => {
  console.log('Initiating LinkedIn OAuth with:', { CLIENT_ID, REDIRECT_URI });
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email`;
  console.log('Redirecting to:', authUrl);
  res.redirect(authUrl);
});

// OAuth callback - exchange code for token and get user data
router.get('/linkedin/callback', async (req: Request, res: Response): Promise<void> => {
  console.log('Received LinkedIn callback with query:', req.query);
  try {
    const code = req.query.code as string;
    if (!code) {
      console.error('No code provided in callback');
      res.status(400).send('No code provided');
      return;
    }
    console.log('Received authorization code, exchanging for token...');

    // 1. Exchange code for access token
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    console.log('Requesting access token with params:', {
      grant_type: 'authorization_code',
      code: code ? '***' : 'undefined',
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET ? '***' : 'undefined'
    });

    let tokenRes;
    try {
      tokenRes = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    } catch (error: any) {
      console.error('Token exchange error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }

    const accessToken = tokenRes.data.access_token;
    console.log('Access token received');

    // 2. Get user info using OpenID Connect
    const userInfoRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userData = userInfoRes.data;
    console.log('User data received:', userData);

    // 3. Return minimal user data needed for ICP Internet Identity
    res.json({
      id: userData.sub,        // Unique LinkedIn user ID
      email: userData.email    // User's verified email address
    });

  } catch (error: any) {
    console.error('Auth error:', {
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      },
      stack: error.stack
    });
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.error_description || 'Authentication failed';
    res.status(status).json({ 
      error: error.response?.data?.error || 'auth_error',
      error_description: message
    });
  }
});

export default router;
