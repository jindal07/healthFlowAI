import express from 'express';
import multer from 'multer';
import { convertPdfToMarkdown } from '../utils/pdfToMarkdown.js';
import { analyzeHealthReport, validateMedicalReport } from '../utils/geminiPrompt.js';

const router = express.Router();

// Configure multer for in-memory file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// POST /api/analyze - Upload and analyze PDF health report
router.post('/analyze', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a PDF file'
      });
    }

    console.log(`📄 Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);

    // Step 1: Convert PDF to Markdown
    let markdownContent;
    try {
      markdownContent = await convertPdfToMarkdown(req.file.buffer);
    } catch (pdfError) {
      console.error('PDF conversion failed:', pdfError.message);
      return res.status(400).json({
        error: 'PDF processing failed',
        message: pdfError.message,
        suggestion: 'Please ensure you upload a valid, unprotected PDF medical report. If the issue persists, try downloading a fresh copy of your medical report.'
      });
    }
    
    if (!markdownContent || markdownContent.trim().length === 0) {
      return res.status(400).json({
        error: 'PDF conversion failed',
        message: 'Could not extract any readable text from the PDF file. The PDF may be image-based, corrupted, or empty.',
        suggestion: 'Please ensure your medical report contains readable text (not just images) and try uploading again.'
      });
    }

    console.log(`📝 Extracted ${markdownContent.length} characters from PDF`);

    // Step 2: Validate if this is a medical report
    console.log('🔍 Validating medical content...');
    const validation = await validateMedicalReport(markdownContent);
    
    console.log(`📊 Validation result: isValid=${validation.isValid}, confidence=${validation.confidence}, reason="${validation.reason}"`);
    
    // Enhanced validation criteria - require higher confidence for medical content
    if (!validation.isValid || validation.confidence < 0.6) {
      console.log(`❌ Medical validation failed: ${validation.reason} (confidence: ${validation.confidence})`);
      return res.status(400).json({
        error: 'Not a medical report',
        message: `This document doesn't appear to be a medical report. ${validation.reason}. Please upload a valid medical document such as lab results, health checkup reports, or medical test results.`,
        suggestion: 'Make sure you upload a PDF containing medical test results, lab reports, health checkups, diagnostic imaging results, or other medical documentation.',
        validationDetails: {
          confidence: validation.confidence,
          reason: validation.reason
        }
      });
    }

    console.log(`✅ Medical validation passed (confidence: ${validation.confidence})`);

    // Additional content length check for medical reports
    if (markdownContent.length < 100) {
      console.log(`⚠️ Content too short for medical analysis: ${markdownContent.length} characters`);
      return res.status(400).json({
        error: 'Insufficient content',
        message: 'The document appears to contain very little text. Medical reports typically contain detailed information about tests, results, and recommendations.',
        suggestion: 'Please ensure you upload a complete medical report with sufficient detail for analysis.'
      });
    }

    // Step 3: Analyze with Gemini AI
    const analysis = await analyzeHealthReport(markdownContent);

    if (!analysis) {
      return res.status(500).json({
        error: 'AI analysis failed',
        message: 'Could not generate health report analysis'
      });
    }

    console.log('🧠 AI analysis completed successfully');

    // Step 4: Return the results
    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        extractedText: markdownContent,
        analysis: analysis,
        processedAt: new Date().toISOString(),
        validationScore: validation.confidence
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error.message.includes('Only PDF files are allowed')) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only PDF files are allowed'
      });
    }

    res.status(500).json({
      error: 'Processing failed',
      message: error.message || 'An error occurred while processing your health report'
    });
  }
});

export default router;
