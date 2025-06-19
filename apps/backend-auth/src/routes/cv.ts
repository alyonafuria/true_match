import { Router, Request, Response, RequestHandler } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// IC Agent imports are commented out until we set up the canister
// import { Actor, HttpAgent } from '@dfinity/agent';
// import { idlFactory as claimsIdl } from '../../canisters/claims_canister/claims_canister.did';
// import { _SERVICE as ClaimsService } from '../../canisters/claims_canister/claims_canister.did';

// Define the router
export const cvRouter = Router();

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description?: string;
}

// Parse CV text and extract work experiences
const parseCvHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: 'No text provided' });
      return;
    }

    // Call OpenAI to parse the CV text
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that extracts work experience from CV text. 
          Return a JSON array of work experiences with the following structure for each:
          {
            "title": "Job Title",
            "company": "Company Name",
            "startDate": "YYYY-MM-DD or YYYY",
            "endDate": "YYYY-MM-DD or YYYY or null if current",
            "description": "Brief description of role"
          }
          
          Only return valid JSON, no other text.`
        },
        {
          role: 'user',
          content: `Extract work experience from this CV text: ${text}`
        }
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    // Parse the JSON response
    let workExperiences: WorkExperience[];
    try {
      const parsed = JSON.parse(content);
      workExperiences = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new Error('Failed to parse work experiences from CV');
    }

    // Mock claim data for each work experience
    const claims = workExperiences.map((exp) => ({
      id: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      verifier: 'google',
      createdAt: new Date().toISOString(),
      verifiedAt: null,
      workExperience: exp
    }));

    res.json({
      success: true,
      data: {
        workExperiences,
        claims
      }
    });
  } catch (error) {
    console.error('Error processing CV:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

// Register the route
cvRouter.post('/parse-cv', parseCvHandler);

export default cvRouter;
