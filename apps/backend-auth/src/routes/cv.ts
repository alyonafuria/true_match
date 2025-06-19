import { Router, Request, Response, RequestHandler } from 'express';
import OpenAI from 'openai';
import { userService } from '../services/userService';
import { Principal } from '@dfinity/principal';

// Define the router
export const cvRouter = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
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
    const principal = (req as any).user?.principal;

    if (!text) {
      res.status(400).json({ error: 'No text provided' });
      return;
    }

    if (!principal) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Call OpenAI to parse the CV text
    const prompt = `Extract work experience from this CV text and return a JSON array with the following structure for each job:
    [
      {
        "title": "Job Title",
        "company": "Company Name",
        "startDate": "YYYY-MM-DD or YYYY",
        "endDate": "YYYY-MM-DD or YYYY or null if current",
        "description": "Brief description of role"
      }
    ]
    
    CV text: ${text}
    
    Only return valid JSON, no other text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that extracts work experience from CV text in JSON format.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.2,
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

    try {
      console.log('Parsing work experiences for principal:', principal);
      
      // Register or update the user with their skill level
      const skillLevel = workExperiences[0]?.title || 'Professional';
      console.log('Registering/updating user with skill level:', skillLevel);
      
      await userService.registerUser(principal, 'User', skillLevel);

      // Add each position to the user's profile
      for (const exp of workExperiences) {
        console.log('Adding position:', exp);
        
        // Calculate duration in months (approximate)
        const startDate = exp.startDate ? new Date(exp.startDate) : new Date();
        const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
        const durationMonths = exp.endDate 
          ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
          : 12; // Default to 1 year if no end date

        await userService.addPosition(principal, {
          company: exp.company,
          role: exp.title,
          duration: Math.max(1, Math.round(durationMonths)), // Ensure at least 1 month
          verified: null,
          reviewed: null,
        });
      }

      // Get the updated user profile
      const userProfile = await userService.getUserProfile(principal);
      console.log('Successfully updated user profile:', userProfile);

      res.json({
        success: true,
        data: {
          workExperiences,
          userProfile
        }
      });
    } catch (error) {
      console.error('Error saving to user canister:', error);
      throw new Error('Failed to save work experiences to user profile');
    }
  } catch (error) {
    console.error('Error processing CV:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

// Register the route with no authentication for now
cvRouter.post('/parse-cv', parseCvHandler);

export default cvRouter;
