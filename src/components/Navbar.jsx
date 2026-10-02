import { motion } from 'framer-motion';
import { BookOpen, Cpu, Sparkles } from 'lucide-react';

export default function Navbar({ ollamaStatus }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-strong sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden glass p-1 flex items-center justify-center shadow-lg border border-white/10 group cursor-pointer">
              <img 
                src="/favicon.svg" 
                alt="StudyBuddy AI Logo" 
                className="w-full h-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-300"
              />
            </div>
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-400 ring-2 ring-background"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">StudyBuddy AI</h1>
            <p className="text-xs text-white/40">Local AI Study Companion</p>
          </div>
        </div>

        {/* Ollama Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
            <Cpu className="w-3.5 h-3.5 text-brand-300" />
            <span className="text-white/60">Powered by Gemma</span>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              ollamaStatus?.healthy
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-danger/10 text-danger border border-danger/20'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                ollamaStatus?.healthy
                  ? 'bg-success animate-pulse-glow'
                  : 'bg-danger'
              }`}
            />
            {ollamaStatus?.healthy ? 'Ollama Online' : 'Ollama Offline'}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
