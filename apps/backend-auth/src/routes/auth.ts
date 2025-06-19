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
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:9002';

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('Missing required LinkedIn OAuth environment variables');
  process.exit(1);
}

console.log('Auth service starting with config:', {
  CLIENT_ID: CLIENT_ID ? '***' : 'missing',
  REDIRECT_URI,
  FRONTEND_URL
});

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

    // 3. Format user data from LinkedIn response
    const userInfo = {
      id: userData.sub,
      sub: userData.sub, // Include both id and sub for compatibility
      name: userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim() || null,
      email: userData.email,
      picture: userData.picture
    } as const;
    
    console.log('Sending user data to frontend:', userInfo);
    
    // 4. Redirect back to frontend with success and user data
    const frontendCallbackUrl = new URL(`${FRONTEND_URL}/auth/callback`);
    frontendCallbackUrl.searchParams.append('status', 'success');
    
    // Encode the user data to safely include it in the URL
    const encodedUserData = encodeURIComponent(JSON.stringify({
      ...userInfo,
      id: userInfo.sub // Ensure we have both id and sub for compatibility
    }));
    frontendCallbackUrl.searchParams.append('user', encodedUserData);
    
    console.log('Redirecting to frontend with URL:', frontendCallbackUrl.toString());
    res.redirect(frontendCallbackUrl.toString());

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
    
    // Redirect to frontend with error
    const frontendUrl = new URL('http://localhost:9002/auth/callback');
    frontendUrl.searchParams.append('status', 'error');
    frontendUrl.searchParams.append('error', error.response?.data?.error || 'auth_error');
    frontendUrl.searchParams.append('error_description', 
      error.response?.data?.error_description || 'Authentication failed');
    
    res.redirect(frontendUrl.toString());
  }
});

export default router;
