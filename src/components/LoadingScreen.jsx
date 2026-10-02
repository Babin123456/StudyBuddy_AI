import { motion } from 'framer-motion';
import { Loader2, Brain, Sparkles } from 'lucide-react';

const loadingMessages = [
  'Reading your notes...',
  'Analyzing key concepts...',
  'Generating quiz questions...',
  'Crafting flashcards...',
  'Preparing viva questions...',
  'Polishing study material...',
];

export default function LoadingScreen() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-10 text-center relative overflow-hidden noise"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 left-0 w-1/2 h-full bg-linear-to-r from-transparent via-brand-500/5 to-transparent skew-x-12"
          />
        </div>

        {/* Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-2xl bg-linear-to-br from-brand-400/20 to-accent-400/20 flex items-center justify-center mx-auto mb-8 relative"
        >
          <Brain className="w-9 h-9 text-brand-300" />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-5 h-5 text-accent-400" />
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <h3 className="text-xl font-bold gradient-text mb-3">
          Generating Study Material
        </h3>
        <p className="text-white/40 text-sm mb-8">
          This may take a moment while the local AI processes your notes...
        </p>

        {/* Animated loader */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
          <motion.span
            className="text-sm text-white/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Processing with Gemma AI...
          </motion.span>
        </div>

        {/* Skeleton cards */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="skeleton w-8 h-8 rounded-lg"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
              <div className="flex-1 space-y-1.5">
                <div
                  className="skeleton h-3 rounded"
                  style={{
                    width: `${70 + i * 10}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
                <div
                  className="skeleton h-2 rounded"
                  style={{
                    width: `${40 + i * 15}%`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
