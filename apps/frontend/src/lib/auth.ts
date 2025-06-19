import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, Identity } from '@dfinity/agent';
import axios from 'axios';

// Configuration
export const II_CANISTER_ID = process.env.NEXT_PUBLIC_II_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Determine the identity provider URL based on the environment
const getIdentityProvider = () => {
  if (process.env.NODE_ENV === 'production') {
    return `https://identity.ic0.app`;
  } else {
    // For local development, use the local replica
    return `http://${II_CANISTER_ID}.localhost:4943`;
  }
};

const IDENTITY_PROVIDER = getIdentityProvider();

interface AuthResponse {
  success: boolean;
  token?: string;
  principal?: string;
  error?: string;
}

// Store the current session
export interface Session {
  identity: Identity;
  principal: string;
  token?: string;
}

let currentSession: Session | null = null;

// Initialize the auth client
let authClient: AuthClient | null = null;

export async function getAuthClient(): Promise<AuthClient> {
  if (!authClient) {
    authClient = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 30, // 30 minutes
        disableDefaultIdleCallback: true,
      },
    });
  }
  return authClient;
}

export async function loginWithII(): Promise<Session> {
  try {
    const client = await getAuthClient();
    
    // Start the login process
    await new Promise<void>((resolve, reject) => {
      client.login({
        identityProvider: `${IDENTITY_PROVIDER}/#authorize`,
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
        // For local development, we need to set the windowOpenerFeatures
        windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100"
      });
    });

    // Get the identity and principal
    const identity = client.getIdentity();
    const principal = identity.getPrincipal().toText();

    // Create a session
    const session: Session = { identity, principal };
    
    // Verify with backend
    const response = await verifyWithBackend(identity, principal);
    
    if (response.success && response.token) {
      session.token = response.token;
      currentSession = session;
      return session;
    } else {
      throw new Error(response.error || 'Failed to verify with backend');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

async function verifyWithBackend(identity: Identity, principal: string): Promise<AuthResponse> {
  try {
    // In a real app, you would sign a message with the identity
    // For simplicity, we're just sending the principal
    const response = await axios.post(`${BACKEND_URL}/api/ii/verify`, {
      principal,
      // Add any additional verification data here
    });
    
    return response.data;
  } catch (error) {
    console.error('Backend verification failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function logout(): Promise<void> {
  const client = await getAuthClient();
  await client.logout();
  currentSession = null;
  // Clear any stored tokens
  localStorage.removeItem('auth_token');
  // Redirect to home page
  window.location.href = '/';
}

export async function checkAuth(): Promise<{ isAuthenticated: boolean; principal: string | null }> {
  try {
    const client = await getAuthClient();
    const isAuthenticated = await client.isAuthenticated();
    
    if (isAuthenticated) {
      const identity = client.getIdentity();
      const principal = identity.getPrincipal().toText();
      
      // Verify with backend
      const response = await verifyWithBackend(identity, principal);
      
      if (response.success) {
        currentSession = { identity, principal, token: response.token };
        return { isAuthenticated: true, principal };
      }
    }
    
    return { isAuthenticated: false, principal: null };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { isAuthenticated: false, principal: null };
  }
}

export function getCurrentSession(): Session | null {
  return currentSession;
}

export function isAuthenticated(): boolean {
  return currentSession !== null;
}
