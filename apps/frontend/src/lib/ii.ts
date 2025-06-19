import { AuthClient } from "@dfinity/auth-client";
import { Ed25519KeyIdentity } from "@dfinity/identity";

// Helper function to create a deterministic seed from LinkedIn ID and email
async function createSeedFromUserData(id: string, email: string): Promise<Uint8Array> {
  // Combine ID and email with a separator that won't appear in the data
  const combined = `${id}:${email}`;
  
  // Encode the string to a buffer
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  
  // Hash the data using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert buffer to Uint8Array and take first 32 bytes
  const hashArray = new Uint8Array(hashBuffer);
  return hashArray.slice(0, 32);
}

// Store the mapping between LinkedIn ID and ICP principal
const LINKEDIN_TO_ICP_MAP = 'linkedinToIcpMap';

/**
 * Gets the stored ICP principal for a LinkedIn user
 */
function getStoredPrincipal(linkedInId: string): string | null {
  if (typeof window === 'undefined') return null;
  const map = JSON.parse(localStorage.getItem(LINKEDIN_TO_ICP_MAP) || '{}');
  return map[linkedInId] || null;
}

/**
 * Stores the mapping between LinkedIn ID and ICP principal
 */
function storePrincipalMapping(linkedInId: string, principal: string): void {
  if (typeof window === 'undefined') return;
  const map = JSON.parse(localStorage.getItem(LINKEDIN_TO_ICP_MAP) || '{}');
  map[linkedInId] = principal;
  localStorage.setItem(LINKEDIN_TO_ICP_MAP, JSON.stringify(map));
}

export async function loginWithII(
  onPrincipal: (principal: string) => void,
  linkedInUser: { id: string; email: string }
): Promise<void> {
  try {
    console.log('Initiating II login for LinkedIn user:', linkedInUser.id);
    
    // Check if we already have a principal for this LinkedIn user
    const storedPrincipal = getStoredPrincipal(linkedInUser.id);
    if (storedPrincipal) {
      console.log('Found existing ICP principal for user:', storedPrincipal);
      onPrincipal(storedPrincipal);
      return;
    }
    
    // Create a deterministic identity based on LinkedIn user data
    const seed = await createSeedFromUserData(linkedInUser.id, linkedInUser.email);
    const identity = Ed25519KeyIdentity.generate(seed);
    
    // Create auth client with the generated identity
    const authClient = await AuthClient.create({
      identity,
      idleOptions: {
        disableIdle: true,
      },
    });
    
    // Check if we need to authenticate
    if (!(await authClient.isAuthenticated())) {
      // If not authenticated, trigger the II flow with redirect
      // Get the Internet Identity URL from environment variables
      const iiCanisterId = process.env.NEXT_PUBLIC_II_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
      const isLocalDevelopment = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_IC_HOST;
      
      const identityProvider = isLocalDevelopment 
        ? `http://${iiCanisterId}.localhost:4943`
        : 'https://identity.ic0.app';
      
      console.log('Using Internet Identity provider:', identityProvider);
      
      await authClient.login({
        identityProvider,
        onSuccess: () => {
          const principal = authClient.getIdentity().getPrincipal().toString();
          console.log("✅ II login successful with principal:", principal);
          
          // Store the mapping for future logins
          storePrincipalMapping(linkedInUser.id, principal);
          console.log('Stored ICP principal mapping for LinkedIn user:', linkedInUser.id);
          
          onPrincipal(principal);
        },
        onError: (error) => {
          console.error("II login error:", error);
          throw new Error(`II login failed: ${error}`);
        },
        // Use redirect instead of popup
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=0,height=0,left=-1000,top=-1000'
      });
    } else {
      // Already authenticated
      const principal = authClient.getIdentity().getPrincipal().toString();
      onPrincipal(principal);
    }
  } catch (error) {
    console.error("Error in loginWithII:", error);
    throw error;
  }
}
