import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * Converts PDF buffer to clean Markdown text with robust error handling
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} - Cleaned markdown content
 */
async function convertPdfToMarkdown(pdfBuffer) {
  try {
    // Try primary PDF parsing with options
    console.log('🔄 Attempting primary PDF parsing...');
    const pdfData = await pdf(pdfBuffer, {
      // PDF parsing options for better compatibility
      max: 0, // Parse all pages
      version: 'v1.10.100'
    });
    
    let text = pdfData.text;

    if (!text || text.trim().length === 0) {
      throw new Error('No text extracted from PDF');
    }

    console.log(`✅ Primary parsing successful. Extracted ${text.length} characters`);
    
    // Clean up the extracted text and convert to markdown-friendly format
    text = cleanExtractedText(text);
    
    return text;
  } catch (error) {
    console.error('Primary PDF conversion failed:', error.message);
    
    // Try fallback parsing methods
    return await tryFallbackParsing(pdfBuffer, error);
  }
}

/**
 * Fallback PDF parsing methods for problematic PDFs
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {Error} originalError - Original parsing error
 * @returns {Promise<string>} - Extracted text or error
 */
async function tryFallbackParsing(pdfBuffer, originalError) {
  const fallbackMethods = [
    // Method 1: Try with different PDF-parse options
    async () => {
      console.log('🔄 Trying fallback method 1: Relaxed parsing...');
      return await pdf(pdfBuffer, {
        max: 50, // Limit pages
        normalizeWhitespace: true,
        disableCombineTextItems: true
      });
    },
    
    // Method 2: Try parsing first few pages only
    async () => {
      console.log('🔄 Trying fallback method 2: Limited pages...');
      return await pdf(pdfBuffer, {
        max: 5, // Only first 5 pages
        normalizeWhitespace: false
      });
    },
    
    // Method 3: Basic extraction without options
    async () => {
      console.log('🔄 Trying fallback method 3: Basic extraction...');
      return await pdf(pdfBuffer);
    }
  ];

  for (let i = 0; i < fallbackMethods.length; i++) {
    try {
      const pdfData = await fallbackMethods[i]();
      let text = pdfData?.text || '';
      
      if (text && text.trim().length > 0) {
        console.log(`✅ Fallback method ${i + 1} successful. Extracted ${text.length} characters`);
        return cleanExtractedText(text);
      }
    } catch (fallbackError) {
      console.log(`❌ Fallback method ${i + 1} failed:`, fallbackError.message);
      continue;
    }
  }

  // If all methods fail, provide helpful error message
  console.error('❌ All PDF parsing methods failed');
  
  // Analyze the error type and provide specific guidance
  const errorMessage = analyzeErrorAndProvideGuidance(originalError);
  throw new Error(errorMessage);
}

/**
 * Analyzes PDF parsing errors and provides user-friendly guidance
 * @param {Error} error - Original parsing error
 * @returns {string} - User-friendly error message
 */
function analyzeErrorAndProvideGuidance(error) {
  const errorMsg = error.message?.toLowerCase() || '';
  
  if (errorMsg.includes('bad xref') || errorMsg.includes('xref')) {
    return 'This PDF file appears to be corrupted or has structural issues. Please try:\n• Re-downloading the PDF from the original source\n• Asking your healthcare provider for a fresh copy\n• Converting the PDF to a new PDF file using a PDF editor';
  }
  
  if (errorMsg.includes('encrypted') || errorMsg.includes('password')) {
    return 'This PDF file is password-protected or encrypted. Please:\n• Remove password protection from the PDF\n• Save an unprotected copy of your medical report\n• Contact your healthcare provider for an unprotected version';
  }
  
  if (errorMsg.includes('invalid') || errorMsg.includes('format')) {
    return 'This file may not be a valid PDF or may be corrupted. Please:\n• Verify the file is a genuine PDF medical report\n• Try downloading the report again\n• Check if the file opens correctly in a PDF viewer';
  }
  
  if (errorMsg.includes('memory') || errorMsg.includes('size')) {
    return 'The PDF file is too large or complex to process. Please:\n• Try compressing the PDF file\n• Use a smaller file (under 10MB)\n• Split multi-page reports into smaller sections';
  }
  
  // Generic fallback message
  return 'Unable to process this PDF file. This could be due to:\n• File corruption or damage\n• Unsupported PDF format\n• Complex document structure\n\nPlease try uploading a different medical report or contact support if the issue persists.';
}

/**
 * Cleans and formats extracted PDF text
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned and formatted text
 */
function cleanExtractedText(text) {
  if (!text) return '';

  // Remove excessive whitespace and normalize line breaks
  text = text.replace(/\s+/g, ' ').trim();
  
  // Split into paragraphs based on common patterns
  text = text.replace(/\.\s+([A-Z])/g, '.\n\n$1');
  
  // Format common medical report sections
  text = text.replace(/\b(PATIENT|NAME|DOB|DATE OF BIRTH|AGE|GENDER|SEX|TEST DATE|REPORT DATE|DOCTOR|PHYSICIAN):\s*/gi, '\n\n**$1:** ');
  
  // Format test results and values
  text = text.replace(/\b([A-Z][A-Za-z\s]+):\s*([0-9.,]+)\s*([a-zA-Z%/]+)?\s*(Normal|Abnormal|High|Low|Critical)?\b/g, '\n- **$1:** $2 $3 $4');
  
  // Format reference ranges
  text = text.replace(/\(Ref[^)]*\)/gi, ' *(Reference Range)*');
  text = text.replace(/Reference\s+Range[^0-9]*([0-9.-]+)\s*-?\s*([0-9.-]+)/gi, ' *(Normal: $1-$2)*');
  
  // Format common sections
  text = text.replace(/\b(COMPLETE BLOOD COUNT|CBC|LIPID PROFILE|LIVER FUNCTION|KIDNEY FUNCTION|THYROID FUNCTION|DIABETES|BLOOD SUGAR|CHOLESTEROL|HEMOGLOBIN|BLOOD PRESSURE)\b/gi, '\n\n## $1\n');
  
  // Clean up multiple newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // Add markdown headers for likely report sections
  text = text.replace(/^([A-Z\s]{5,})$/gm, '## $1');
  
  return text.trim();
}

export {
  convertPdfToMarkdown
};
