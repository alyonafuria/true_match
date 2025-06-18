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

export async function loginWithII(
  onPrincipal: (principal: string) => void,
  linkedInUser: { id: string; email: string }
) {
  try {
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
      // If not authenticated, trigger the II flow
      await authClient.login({
        identityProvider: "http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai",
        onSuccess: () => {
          const principal = identity.getPrincipal().toString();
          console.log("✅ II login successful");
          onPrincipal(principal);
        },
      });
      return;
    }
    
    // If already authenticated, use the existing identity
    const principal = identity.getPrincipal().toString();
    console.log("🔑 Using existing identity");
    onPrincipal(principal);
    
  } catch (error) {
    console.error("Error in II login:", error);
    throw error;
  }
}