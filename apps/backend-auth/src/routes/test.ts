import { Router } from 'express';

export const testRouter = Router();

testRouter.post('/test', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    return res.json({
      success: true,
      received: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      length: text.length
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default testRouter;
