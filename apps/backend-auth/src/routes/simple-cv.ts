import { Router, Request, Response } from 'express';

const router = Router();

router.post('/parse', (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    
    // Just return a simple response with the first 100 chars of the text
    return res.json({
      success: true,
      received: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      length: text.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in simple CV endpoint:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
