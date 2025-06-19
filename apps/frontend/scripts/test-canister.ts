import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../src/declarations/user/user.did';
import { AuthClient } from '@dfinity/auth-client';

async function testCanister() {
  try {
    console.log('Initializing auth client...');
    const authClient = await AuthClient.create();
    
    if (!await authClient.isAuthenticated()) {
      console.log('Please authenticate first');
      await authClient.login({
        identityProvider: 'http://localhost:8000?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai',
        onSuccess: () => console.log('Login successful'),
      });
      return;
    }

    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ 
      host: 'http://localhost:8000',
      identity 
    });
    
    // For local development, fetch the root key
    await agent.fetchRootKey();
    
    const canisterId = 'lqy7q-dh777-77777-aaaaq-cai';
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });

    console.log('Registering test user...');
    await actor.registerUser('Test User', 'Professional');
    console.log('User registered successfully');

    console.log('Adding test position...');
    const position = {
      company: 'Test Company',
      role: 'Test Role',
      duration: 12n, // 1 year in months
      verified: [],
      reviewed: []
    };
    
    const result = await actor.addPosition(position);
    console.log('Position added:', result);

    console.log('Fetching user profile...');
    const profile = await actor.getMyProfile();
    console.log('User profile:', JSON.stringify(profile, null, 2));
    
  } catch (error) {
    console.error('Error in testCanister:', error);
  }
}

testCanister();
