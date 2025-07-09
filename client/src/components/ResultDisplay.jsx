import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ArrowLeft, 
  FileText, 
  Brain, 
  Download, 
  Share2, 
  Calendar,
  User,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ResultDisplay = ({ result, onReset, darkMode }) => {
  const [activeTab, setActiveTab] = useState('analysis');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadReport = async () => {
    try {
      // Create a container for the content to be converted to PDF
      const contentElement = document.createElement('div');
      contentElement.innerHTML = `
        <div style="padding: 40px; font-family: 'Exo 2', sans-serif; background: white; color: #333;">
          <h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin-bottom: 10px;">Health Report Analysis</h1>
          <p style="color: #6b7280; margin-bottom: 30px;">Generated on ${formatDate(result.processedAt)}</p>
          <p style="color: #6b7280; margin-bottom: 30px;">Report: ${result.filename}</p>
          <div style="line-height: 1.6;">
            ${result.analysis.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </div>
        </div>
      `;
      
      // Temporarily add to DOM for rendering
      contentElement.style.position = 'absolute';
      contentElement.style.left = '-9999px';
      contentElement.style.width = '800px';
      document.body.appendChild(contentElement);
      
      // Convert to canvas
      const canvas = await html2canvas(contentElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      // Remove temporary element
      document.body.removeChild(contentElement);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`health-analysis-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to markdown download
      const element = document.createElement('a');
      const file = new Blob([result.analysis], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `health-analysis-${new Date().getTime()}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Health Report Analysis',
          text: 'Check out my health report analysis',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(result.analysis);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 space-y-6 sm:space-y-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6"
      >
        {/* Title and Meta Info */}
        <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2.5 sm:p-3 rounded-lg glass-morphism transition-all duration-200 flex-shrink-0 ${
              darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          
          <div className="min-w-0 flex-1">
            <h1 className={`text-xl sm:text-3xl lg:text-4xl font-bold font-display mb-1 sm:mb-2 leading-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Analysis Results
            </h1>
            
            <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate font-medium">{result.filename}</span>
              </div>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{new Date(result.processedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <motion.button
            onClick={downloadReport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg glass-morphism transition-all duration-200 text-xs sm:text-sm font-medium ${
              darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-700'
            }`}
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>PDF</span>
          </motion.button>

          <motion.button
            onClick={shareReport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg glass-morphism transition-all duration-200 text-xs sm:text-sm font-medium ${
              darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-700'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Share</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`flex rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
      >
        {[
          { id: 'analysis', label: 'AI Analysis', icon: Brain }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 ${
              activeTab === tab.id
                ? darkMode 
                  ? 'bg-gray-700 text-blue-400 shadow-lg' 
                  : 'bg-white text-blue-600 shadow-md'
                : darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm sm:text-base">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key="analysis"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`glass-card rounded-2xl p-3 sm:p-6 lg:p-10 ${
            darkMode ? 'bg-gray-800/40' : 'bg-white/60'
          }`}
        >
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className={`text-xl sm:text-2xl lg:text-4xl font-bold font-display mb-4 sm:mb-6 leading-tight ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className={`text-lg sm:text-xl lg:text-3xl font-semibold font-display mb-3 sm:mb-4 mt-6 sm:mt-8 leading-tight ${
                    darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className={`text-base sm:text-lg lg:text-2xl font-semibold font-display mb-2 sm:mb-3 mt-4 sm:mt-6 leading-tight ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className={`text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 list-none">
                    {children}
                  </ul>
                ),
                li: ({ children }) => {
                  const text = children?.toString() || '';
                  let icon = Activity;
                  let colorClass = 'text-blue-500';
                  
                  if (text.includes('🟢') || text.includes('Normal') || text.includes('Good')) {
                    icon = CheckCircle;
                    colorClass = 'text-green-500';
                  } else if (text.includes('🔴') || text.includes('High') || text.includes('Abnormal') || text.includes('Critical')) {
                    icon = AlertTriangle;
                    colorClass = 'text-red-500';
                  } else if (text.includes('🟡') || text.includes('Monitor') || text.includes('Watch')) {
                    icon = TrendingUp;
                    colorClass = 'text-yellow-500';
                  }
                  
                  const IconComponent = icon;
                  
                  return (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors duration-200 ${
                        darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${colorClass} flex-shrink-0`} />
                      <span className={`text-xs sm:text-sm lg:text-base leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {children}
                      </span>
                    </motion.li>
                  );
                },
                strong: ({ children }) => (
                  <strong className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {children}
                  </strong>
                ),
                code: ({ children }) => (
                  <code className={`px-2 py-1 rounded text-sm font-mono ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className={`border-l-4 border-blue-500 pl-4 py-2 my-4 italic ${
                    darkMode ? 'bg-blue-900/20 text-gray-300' : 'bg-blue-50 text-gray-600'
                  }`}>
                    {children}
                  </blockquote>
                ),
              }}
            >
              {result.analysis}
            </ReactMarkdown>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultDisplay;
