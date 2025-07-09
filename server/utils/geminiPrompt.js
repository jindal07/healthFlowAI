import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Analyzes health report using Gemini AI
 * @param {string} markdownContent - Health report in markdown format
 * @returns {Promise<string>} - AI analysis result
 */
async function analyzeHealthReport(markdownContent) {
  try {
    // Debug: Log environment variable status
    console.log('🔑 Checking API key...');
    console.log('Environment keys available:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is missing from environment variables');
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('✅ GEMINI_API_KEY found, initializing AI...');
    
    // Initialize Gemini AI with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = createHealthAnalysisPrompt(markdownContent);
    
    console.log('🧠 Sending request to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return analysis;
  } catch (error) {
    console.error('Gemini AI error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

/**
 * Creates a comprehensive prompt for health report analysis
 * @param {string} markdownContent - Health report content
 * @returns {string} - Formatted prompt for Gemini
 */
function createHealthAnalysisPrompt(markdownContent) {
  return `You are a medical report summarizer and health advisor. 

Given the following health report in markdown format, please provide a comprehensive analysis that includes:

1. **Summary**: A brief overview of the patient's overall health status
2. **Key Findings**: Important test results, both normal and abnormal values
3. **Health Indicators**: 
   - 🟢 Normal/Healthy indicators
   - 🟡 Values that need monitoring  
   - 🔴 Abnormal/Concerning values that require attention
4. **Recommendations**: Specific actionable advice including:
   - Lifestyle changes
   - Dietary suggestions
   - Exercise recommendations
   - When to follow up with healthcare providers
5. **Next Steps**: What the patient should do based on these results

Please format your response in clean markdown with appropriate headers, bullet points, and emojis for better readability. Be thorough but easy to understand for a general audience.

**Important Guidelines:**
- Explain medical terms in simple language
- Highlight urgent concerns clearly
- Provide practical, actionable advice
- Include relevant lifestyle modifications
- Suggest appropriate follow-up timeline
- Be encouraging while being honest about any concerns

**Health Report:**
\`\`\`
${markdownContent}
\`\`\`

Please provide your analysis:`;
}

/**
 * Validates if the uploaded content is a medical report
 * @param {string} markdownContent - Content to validate
 * @returns {Promise<{isValid: boolean, confidence: number, reason: string}>} - Validation result
 */
async function validateMedicalReport(markdownContent) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const validationPrompt = createMedicalValidationPrompt(markdownContent);
    
    console.log('🔍 Validating if content is a medical report...');
    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const validationText = response.text().trim();

    // Parse the validation response
    try {
      const validationResult = JSON.parse(validationText);
      return validationResult;
    } catch (parseError) {
      console.error('Failed to parse validation response:', validationText);
      // Fallback: try to determine from text content
      const isValid = validationText.toLowerCase().includes('true') || 
                     validationText.toLowerCase().includes('medical') ||
                     validationText.toLowerCase().includes('health');
      return {
        isValid,
        confidence: isValid ? 0.6 : 0.4,
        reason: isValid ? 'Content appears to be medical-related' : 'Content does not appear to be a medical report'
      };
    }
  } catch (error) {
    console.error('Medical validation error:', error);
    // If validation fails, we'll allow the document through with low confidence
    return {
      isValid: true,
      confidence: 0.3,
      reason: 'Could not validate due to technical issue'
    };
  }
}

/**
 * Creates a prompt to validate if content is a medical report
 * @param {string} markdownContent - Content to validate
 * @returns {string} - Validation prompt
 */
function createMedicalValidationPrompt(markdownContent) {
  return `You are a strict medical document classifier. Your task is to determine if the given content is DEFINITELY a medical report, health report, lab results, or any medical-related document.

Analyze the following content and respond with a JSON object containing:
- "isValid": true ONLY if this is clearly a medical/health report, false otherwise
- "confidence": a number between 0 and 1 indicating confidence level (be conservative)
- "reason": a brief explanation of your decision

MEDICAL documents MUST contain at least one of:
- Lab test results with numerical values (blood work, urine tests, etc.)
- Vital signs with measurements (blood pressure, heart rate, temperature, weight, height)
- Medical procedures, examinations, or diagnostic tests described
- Doctor's notes, medical observations, or clinical findings
- Patient medical information with specific health data
- Diagnostic imaging results (X-ray, MRI, CT scan, ultrasound)
- Prescription medications with dosages
- Medical diagnoses or health conditions
- Hospital or clinic letterhead/identification
- Medical terminology and abbreviations (CBC, HDL, LDL, BP, etc.)

NON-medical documents (return false):
- General business documents, invoices, contracts
- Personal letters, essays, or general correspondence  
- Technical manuals or user guides
- Academic papers (unless specifically medical research with patient data)
- Financial reports, bank statements, tax documents
- Legal documents, court papers, certificates
- Travel documents, tickets, itineraries
- News articles, blog posts, or general health information
- Food menus, recipes, or general wellness tips
- Insurance forms without medical data

Be VERY strict - if you're not confident it's a medical document with actual medical data, mark it as invalid.

Content to analyze (first 2000 characters):
\`\`\`
${markdownContent.substring(0, 2000)}...
\`\`\`

Respond only with valid JSON:`;
}

export {
  analyzeHealthReport,
  validateMedicalReport
};
