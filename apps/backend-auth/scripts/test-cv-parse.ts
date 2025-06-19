import axios from 'axios';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../../../src/declarations/user/user.did.js';
import { Actor, HttpAgent } from '@dfinity/agent';

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const USER_CANISTER_ID = 'uxrrr-q7777-77774-qaaaq-cai'; // Replace with your user canister ID
const HOST = 'http://127.0.0.1:8000';

// Sample CV text for testing
const sampleCV = `
John Doe
Senior Software Engineer

EXPERIENCE

Senior Software Engineer
TechCorp, San Francisco, CA
Jan 2020 - Present
- Led a team of 5 developers to build a scalable microservices architecture
- Implemented CI/CD pipelines reducing deployment time by 60%
- Technologies: TypeScript, Node.js, React, AWS

Software Engineer
WebStart Inc, New York, NY
Jun 2017 - Dec 2019
- Developed and maintained RESTful APIs using Node.js and Express
- Improved application performance by 40% through code optimization
- Technologies: JavaScript, MongoDB, Docker

EDUCATION

B.S. in Computer Science
University of California, Berkeley
2013 - 2017
`;

async function testCVParse() {
  try {
    // Step 1: Parse CV using the backend API
    console.log('Parsing CV...');
    const parseResponse = await axios.post(`${BACKEND_URL}/api/cv/parse-cv`, {
      text: sampleCV
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token here if required
      }
    });

    console.log('CV Parse Response:', JSON.stringify(parseResponse.data, null, 2));

    // Step 2: Verify user data in the canister
    if (parseResponse.data.success && parseResponse.data.data.userProfile) {
      console.log('\nVerifying user data in canister...');
      
      // Create an agent to interact with the user canister
      const agent = new HttpAgent({ host: HOST });
      await agent.fetchRootKey(); // Only for local development
      
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: USER_CANISTER_ID,
      });
      
      // Get the first user (for testing)
      const users = await actor.getAllUsers();
      console.log('\nAll users in canister:', JSON.stringify(users, null, 2));
      
      if (users.length > 0) {
        const [principal, user] = users[0];
        console.log('\nFirst user profile:', {
          principal: principal.toText(),
          name: user.name,
          skillLevel: user.skillLevel,
          positions: user.positions
        });
      }
    }
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testCVParse();
