import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { Moon, Sun, Heart } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(true); // Dark mode as default
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize dark mode on component mount
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute inset-0 transition-all duration-700 ${
          darkMode 
            ? 'bg-[radial-gradient(circle_at_25%_25%,rgba(139,92,246,0.3)_0%,transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]'
        }`} />
        <div className={`absolute inset-0 transition-all duration-700 ${
          darkMode 
            ? 'bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.2)_0%,transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1)_0%,transparent_50%)]'
        }`} />
        <div className={`absolute inset-0 transition-all duration-700 ${
          darkMode 
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05)_0%,transparent_50%)]'
        }`} />
      </div>

      {/* Animated particles for dark mode */}
      {darkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float opacity-60" style={{top: '20%', left: '10%', animationDelay: '0s'}} />
          <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" style={{top: '60%', left: '80%', animationDelay: '2s'}} />
          <div className="absolute w-1 h-1 bg-pink-400 rounded-full animate-float opacity-60" style={{top: '40%', left: '60%', animationDelay: '1s'}} />
          <div className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-float opacity-60" style={{top: '80%', left: '20%', animationDelay: '3s'}} />
        </div>
      )}

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex justify-between items-center mobile-container py-4 sm:py-6 md:py-8"
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 shadow-lg animate-pulse-glow">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gradient-dark">
              HealthFlow AI
            </h1>
            <p className={`text-xs sm:text-sm transition-colors duration-300 ${
              darkMode ? 'text-purple-300' : 'text-gray-600'
            }`}>
              Smart Medical Analysis
            </p>
          </div>
        </motion.div>

        <motion.button
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 sm:p-3 rounded-full glass-card-enhanced touch-target transition-all duration-500 ${
            darkMode 
              ? 'hover:bg-purple-500/20 hover:shadow-purple-500/25' 
              : 'hover:bg-black/10'
          }`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 drop-shadow-lg" />
          ) : (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          )}
        </motion.button>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 mobile-container pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {!analysisResult && !isLoading && (
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className={`mobile-heading font-display font-bold mb-4 sm:mb-6 transition-colors duration-500 ${
                darkMode ? 'text-white drop-shadow-lg' : 'text-gray-800'
              }`}>
                Transform Your Health Reports
              </h2>
              <p className={`mobile-text mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${
                darkMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Get instant AI-powered insights from your medical reports. 
                Secure, private, and beautifully presented for easy understanding.
              </p>
              
              {/* Features */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: "🔒", title: "100% Private", desc: "No data stored, processed in memory" },
                  { icon: "🧠", title: "AI-Powered", desc: "Advanced analysis using Google Gemini" },
                  { icon: "⚡", title: "Instant Results", desc: "Get insights in seconds, not days" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className={`mobile-card glass-card-enhanced transition-all duration-500 touch-target group ${
                      darkMode 
                        ? 'hover:bg-purple-500/10 hover:border-purple-400/30 hover:shadow-purple-500/20' 
                        : 'hover:bg-white/30'
                    }`}
                  >
                    <div className={`text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <h3 className={`text-lg sm:text-xl font-display font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-white group-hover:text-purple-200' : 'text-gray-800'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`mobile-text transition-colors duration-300 ${
                      darkMode ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-600'
                    }`}>
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* File Upload Component */}
          {!analysisResult && (
            <FileUpload 
              onAnalysisStart={handleAnalysisStart}
              onAnalysisComplete={handleAnalysisComplete}
              isLoading={isLoading}
              darkMode={darkMode}
            />
          )}

          {/* Results Display */}
          {analysisResult && (
            <ResultDisplay 
              result={analysisResult}
              onReset={handleReset}
              darkMode={darkMode}
            />
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`relative z-10 text-center py-8 transition-colors duration-500 ${
          darkMode ? 'text-slate-400' : 'text-gray-600'
        }`}
      >
        <p className="text-xs sm:text-sm">
          Built with ❤️ using React, Tailwind CSS, and Framer Motion
        </p>
        <p className={`text-xs sm:text-sm mt-2 opacity-75 transition-colors duration-500 ${
          darkMode ? 'text-slate-500' : 'text-gray-500'
        }`}>
          Your health data is processed securely and never stored
        </p>
      </motion.footer>
    </div>
  );
}

export default App;
