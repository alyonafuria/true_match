import { Router } from 'express';
import { uploadSingle, handleFileUpload } from '../utils/fileUpload';
import { Request, Response } from 'express';
import path from 'path';

const router = Router();

// Upload CV endpoint
router.post('/cv', uploadSingle('cv'), (req: Request, res: Response) => {
  try {
    const fileInfo = handleFileUpload(req);
    
    // In a real app, you would save file metadata to a database here
    // and process the CV (e.g., extract text, parse information, etc.)
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: fileInfo.originalname,
        size: fileInfo.size,
        type: fileInfo.mimetype,
        url: `/uploads/${path.basename(fileInfo.path)}`
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error uploading file'
    });
  }
});

// Get uploaded file
router.get('/uploads/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads', filename);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).json({ success: false, message: 'File not found' });
    }
  });
});

export default router;
