import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Heart } from 'lucide-react';
import axios from 'axios';

const FileUpload = ({ onAnalysisStart, onAnalysisComplete, isLoading, darkMode }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      setUploadStatus('error');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setUploadStatus('error');
      return;
    }

    setError('');
    setUploadStatus('uploading');
    onAnalysisStart();

    try {
      const formData = new FormData();
      formData.append('report', file);

      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes timeout
      });

      if (response.data.success) {
        setUploadStatus('success');
        onAnalysisComplete(response.data.data);
      } else {
        throw new Error(response.data.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again with a smaller file.');
      } else if (err.response?.data?.error === 'PDF processing failed') {
        setError(`PDF Processing Error:\n\n${err.response.data.message}\n\n${err.response.data.suggestion || ''}`);
      } else if (err.response?.data?.error === 'Not a medical report') {
        setError(`${err.response.data.message}\n\n${err.response.data.suggestion || ''}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to analyze the report. Please try again.');
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl sm:rounded-3xl mobile-card text-center transition-all duration-500 ${
          dragActive
            ? darkMode
              ? 'border-purple-400 bg-purple-500/20 scale-105 shadow-purple-500/25'
              : 'border-blue-500 bg-blue-50/50 scale-105'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20'
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20'
            : darkMode
            ? 'border-slate-600 glass-card-enhanced hover:border-purple-500/50 hover:bg-purple-500/5'
            : 'border-gray-300 glass-morphism hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          disabled={isLoading}
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-blue-500"
              >
                <Loader2 className="w-full h-full" />
              </motion.div>
              
              <div>
                <h3 className={`mobile-subheading font-display font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white drop-shadow-lg' : 'text-gray-800'
                }`}>
                  Analyzing Your Report...
                </h3>
                <p className={`mobile-text transition-colors duration-300 ${
                  darkMode ? 'text-purple-200' : 'text-gray-600'
                }`}>
                  Our AI is carefully reviewing your health data
                </p>
              </div>

              {/* Progress Animation */}
              <div className={`w-full rounded-full h-2 overflow-hidden transition-colors duration-300 ${
                darkMode ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                <motion.div
                  className={`h-full ${
                    darkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ) : uploadStatus === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                  className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-green-500"
                >
                  <CheckCircle className="w-full h-full" />
                </motion.div>
                <h3 className={`mobile-subheading font-display font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Analysis Complete!
                </h3>
            </motion.div>
          ) : uploadStatus === 'error' ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >
              {error.includes('medical report') || error.includes('Medical validation') ? (
                <Heart className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />
              ) : error.includes('PDF Processing Error') || error.includes('corrupted') || error.includes('encrypted') ? (
                <FileText className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
              ) : (
                <AlertCircle className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
              )}
              <div>
                <h3 className={`mobile-subheading font-display font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {error.includes('medical report') 
                    ? 'Medical Report Required' 
                    : error.includes('PDF Processing Error') || error.includes('corrupted') || error.includes('encrypted')
                    ? 'PDF Processing Issue'
                    : 'Upload Failed'}
                </h3>
                <div className={`mobile-text mb-4 whitespace-pre-line ${
                  error.includes('medical report') 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : error.includes('PDF Processing Error')
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-500'
                }`}>
                  {error}
                </div>
                {(error.includes('medical report') || error.includes('PDF Processing Error')) && (
                  <div className={`text-sm mb-4 p-3 rounded-lg ${
                    error.includes('medical report')
                      ? darkMode ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-50 text-orange-700'
                      : darkMode ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {error.includes('medical report') ? (
                      <>
                        <p className="font-medium mb-2">✅ Examples of valid medical documents:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Blood test results and lab reports</li>
                          <li>• Health checkup reports</li>
                          <li>• Medical examination reports</li>
                          <li>• Diagnostic test results (X-ray, MRI, etc.)</li>
                          <li>• Prescription and medication reports</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <p className="font-medium mb-2">🔧 PDF Troubleshooting Tips:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Try downloading a fresh copy of your medical report</li>
                          <li>• Ensure the PDF is not password-protected</li>
                          <li>• Check that the file opens correctly in a PDF viewer</li>
                          <li>• Compress large files or try uploading fewer pages</li>
                          <li>• Contact your healthcare provider for a new copy if needed</li>
                        </ul>
                      </>
                    )}
                  </div>
                )}
                <motion.button
                  onClick={() => {
                    setUploadStatus('idle');
                    setError('');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mobile-button rounded-lg transition-colors touch-target ${
                    error.includes('medical report')
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : error.includes('PDF Processing Error')
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {error.includes('PDF Processing Error') ? 'Try Different PDF' : 'Upload Medical Report'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 500 }}
                className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 transition-colors duration-300 ${
                  dragActive 
                    ? darkMode ? 'text-purple-400' : 'text-blue-500'
                    : darkMode ? 'text-slate-400' : 'text-gray-500'
                }`}
              >
                {dragActive ? <Upload className="w-full h-full" /> : <FileText className="w-full h-full" />}
              </motion.div>

              <div>
                <h3 className={`mobile-subheading font-display font-semibold mb-3 sm:mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-white drop-shadow-lg' : 'text-gray-800'
                }`}>
                  {dragActive ? 'Drop your PDF here!' : 'Upload Your Health Report'}
                </h3>
                
                <p className={`mobile-text mb-4 sm:mb-6 transition-colors duration-300 ${
                  darkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Upload your medical report PDF for AI-powered health analysis
                </p>

                <motion.button
                  onClick={onButtonClick}
                  whileHover={{ scale: 1.05, boxShadow: darkMode ? "0 10px 25px rgba(168, 85, 247, 0.4)" : "0 10px 25px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className={`mobile-button font-semibold rounded-xl transition-all duration-300 shadow-lg touch-target ${
                    darkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                  }`}
                >
                  Choose Medical Report PDF
                </motion.button>

                <div className={`mt-4 sm:mt-6 space-y-1 sm:space-y-2 text-xs sm:text-sm transition-colors duration-300 ${
                  darkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  <p>• Upload medical reports: lab results, health checkups, test reports</p>
                  <p>• Supported format: PDF only • Max size: 10MB</p>
                  <p>• Your health data is processed securely and never stored</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FileUpload;
