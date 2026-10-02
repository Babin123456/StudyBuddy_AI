import { motion } from 'framer-motion';
import { AlertTriangle, Terminal, ExternalLink, RefreshCw } from 'lucide-react';

export default function OllamaAlert({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-8 p-6 rounded-2xl border border-danger/20 bg-danger/5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-danger" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-danger mb-2">Ollama Not Detected</h3>
          <p className="text-white/60 text-sm mb-4">
            StudyBuddy AI requires Ollama running locally to generate study material.
            You can still try the app with sample data, but AI generation won't work until Ollama is set up.
          </p>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-900/50 border border-white/5">
              <Terminal className="w-4 h-4 text-brand-300 shrink-0" />
              <div>
                <p className="text-xs text-white/40 mb-0.5">Step 1: Install Ollama</p>
                <code className="text-sm text-brand-300 font-mono">
                  Visit ollama.com/download
                </code>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-900/50 border border-white/5">
              <Terminal className="w-4 h-4 text-brand-300 shrink-0" />
              <div>
                <p className="text-xs text-white/40 mb-0.5">Step 2: Pull the Gemma model</p>
                <code className="text-sm text-brand-300 font-mono">
                  ollama pull gemma:2b
                </code>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-900/50 border border-white/5">
              <Terminal className="w-4 h-4 text-brand-300 shrink-0" />
              <div>
                <p className="text-xs text-white/40 mb-0.5">Step 3: Run Ollama server</p>
                <code className="text-sm text-brand-300 font-mono">
                  ollama serve
                </code>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
            <a
              href="https://ollama.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Download Ollama
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
