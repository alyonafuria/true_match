import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../../src/declarations/user/user.did.js';
import { _SERVICE } from '../../../../src/declarations/user/user.did';

// Get the canister ID from environment variables or use the local one
const USER_CANISTER_ID = process.env.USER_CANISTER_ID || 'lqy7q-dh777-77777-aaaaq-cai';
const HOST = process.env.IC_HOST || 'http://127.0.0.1:8000';

export interface Position {
  company: string;
  role: string;
  duration: number;
  verified: boolean | null;
  reviewed: boolean | null;
}

export interface User {
  name: string;
  skillLevel: string;
  positions: Position[];
}

// Create an actor to interact with the user canister
const createActor = async (identity?: any) => {
  const agent = new HttpAgent({ 
    host: HOST,
    ...(identity && { identity })
  });

  // Fetch root key for local development
  if (HOST.includes('localhost') || HOST.includes('127.0.0.1')) {
    await agent.fetchRootKey();
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: USER_CANISTER_ID,
  });
};

export const userService = {
  // Register a new user or update existing user
  async registerUser(principal: string, name: string, skillLevel: string): Promise<void> {
    const actor = await createActor();
    const principalId = Principal.fromText(principal);
    await actor.registerUser(name, skillLevel);
  },

  // Add a position to a user's profile
  async addPosition(principal: string, position: Position): Promise<void> {
    const actor = await createActor();
    const principalId = Principal.fromText(principal);
    
    // Convert the position to the format expected by the canister
    const canisterPosition = {
      company: position.company,
      role: position.role,
      duration: BigInt(position.duration),
      verified: position.verified === null ? [] : [position.verified],
      reviewed: position.reviewed === null ? [] : [position.reviewed],
    };

    await actor.addPosition(canisterPosition);
  },

  // Get a user's profile
  async getUserProfile(principal: string): Promise<User | null> {
    const actor = await createActor();
    const principalId = Principal.fromText(principal);
    const profile = await actor.getMyProfile();
    
    if (!profile) return null;

    // Define the position type from the canister
    type CanisterPosition = {
      company: string;
      role: string;
      duration: bigint;
      verified: Array<boolean>;
      reviewed: Array<boolean>;
    };

    // Convert the canister's profile format to our frontend format
    return {
      name: profile.name,
      skillLevel: profile.skillLevel,
      positions: (profile.positions as unknown as CanisterPosition[]).map((p: CanisterPosition) => ({
        company: p.company,
        role: p.role,
        duration: Number(p.duration),
        verified: p.verified.length > 0 ? p.verified[0] : null,
        reviewed: p.reviewed.length > 0 ? p.reviewed[0] : null,
      })),
    };
  },

  // Get all users (for admin/dashboard purposes)
  async getAllUsers(): Promise<Array<{ principal: string; user: User }>> {
    const actor = await createActor();
    const users = await actor.getAllUsers();
    
    return users.map(([principal, user]: [Principal, any]) => ({
      principal: principal.toText(),
      user: {
        name: user.name,
        skillLevel: user.skillLevel,
        positions: user.positions.map((p: any) => ({
          company: p.company,
          role: p.role,
          duration: Number(p.duration),
          verified: p.verified.length > 0 ? p.verified[0] : null,
          reviewed: p.reviewed.length > 0 ? p.reviewed[0] : null,
        })),
      },
    }));
  },

  // Verify or review a position
  async verifyPosition(
    targetPrincipal: string,
    index: number,
    field: 'verified' | 'reviewed',
    value: boolean
  ): Promise<void> {
    const actor = await createActor();
    const principal = Principal.fromText(targetPrincipal);
    await actor.verifyPosition(principal, BigInt(index), field, value);
  },
};

export default userService;
