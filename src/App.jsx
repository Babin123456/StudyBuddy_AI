import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

import Navbar from './components/Navbar';
import UploadScreen from './components/UploadScreen';
import Dashboard from './components/Dashboard';
import QuizPlayer from './components/QuizPlayer';
import FlashcardDeck from './components/FlashcardDeck';
import MockViva from './components/MockViva';
import OllamaAlert from './components/OllamaAlert';
import LoadingScreen from './components/LoadingScreen';
import { checkHealth } from './services/api';
import { sampleStudyData } from './data/sampleData';

/**
 * App screens:
 *  - 'upload'     → File upload / text paste
 *  - 'dashboard'  → Mode selection after generation
 *  - 'quiz'       → Quiz player
 *  - 'flashcards' → Flashcard deck
 *  - 'viva'       → Mock viva mode
 */
export default function App() {
  const [screen, setScreen] = useState('upload');
  const [studyData, setStudyData] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check Ollama health on mount
  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    try {
      const status = await checkHealth();
      setOllamaStatus(status);
      if (status.healthy) {
        toast.success('Ollama connected successfully!', {
          icon: '🟢',
          style: {
            background: 'oklch(0.18 0.02 275)',
            color: 'oklch(0.92 0.01 280)',
            border: '1px solid oklch(1 0 0 / 0.08)',
          },
        });
      }
    } catch (err) {
      setOllamaStatus({ healthy: false, error: err.message });
    }
  };

  const handleGenerated = (data) => {
    setStudyData(data);
    setScreen('dashboard');
    toast.success('Study material generated!', {
      icon: '🎉',
      style: {
        background: 'oklch(0.18 0.02 275)',
        color: 'oklch(0.92 0.01 280)',
        border: '1px solid oklch(1 0 0 / 0.08)',
      },
    });
  };

  const handleDemoMode = () => {
    setStudyData(sampleStudyData);
    setScreen('dashboard');
    toast('Loaded sample study material for demo', {
      icon: '📚',
      style: {
        background: 'oklch(0.18 0.02 275)',
        color: 'oklch(0.92 0.01 280)',
        border: '1px solid oklch(1 0 0 / 0.08)',
      },
    });
  };

  const handleReset = () => {
    setStudyData(null);
    setScreen('upload');
  };

  const handleNavigate = (mode) => {
    setScreen(mode);
  };

  const handleBackToDashboard = () => {
    setScreen('dashboard');
  };

  // Page transition wrapper
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeInOut' },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Navbar ollamaStatus={ollamaStatus} />

      {/* Ollama Alert */}
      {ollamaStatus && !ollamaStatus.healthy && screen === 'upload' && (
        <OllamaAlert onRetry={checkOllamaStatus} />
      )}

      {/* Back Button (when not on upload/dashboard) */}
      {(screen === 'quiz' || screen === 'flashcards' || screen === 'viva') && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-all mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </motion.button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" {...pageTransition}>
              <LoadingScreen />
            </motion.div>
          ) : screen === 'upload' ? (
            <motion.div key="upload" {...pageTransition}>
              <UploadScreen
                onGenerated={handleGenerated}
                ollamaHealthy={ollamaStatus?.healthy}
                onDemo={handleDemoMode}
              />
            </motion.div>
          ) : screen === 'dashboard' ? (
            <motion.div key="dashboard" {...pageTransition}>
              <Dashboard
                studyData={studyData}
                onNavigate={handleNavigate}
                onReset={handleReset}
              />
            </motion.div>
          ) : screen === 'quiz' ? (
            <motion.div key="quiz" {...pageTransition}>
              <QuizPlayer
                mcqs={studyData.mcqs}
                onBack={handleBackToDashboard}
              />
            </motion.div>
          ) : screen === 'flashcards' ? (
            <motion.div key="flashcards" {...pageTransition}>
              <FlashcardDeck
                flashcards={studyData.flashcards}
                onBack={handleBackToDashboard}
              />
            </motion.div>
          ) : screen === 'viva' ? (
            <motion.div key="viva" {...pageTransition}>
              <MockViva
                vivaQuestions={studyData.viva_questions}
                onBack={handleBackToDashboard}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-white/20 border-t border-white/5">
        <p>
          StudyBuddy AI · Built for Hacktoberfest 2026 ·{' '}
          <span className="text-brand-400/40">Powered by Gemma via Ollama</span>
        </p>
      </footer>
    </div>
  );
}
