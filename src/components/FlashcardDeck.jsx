import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  Lightbulb,
  Repeat,
} from 'lucide-react';

export default function FlashcardDeck({ flashcards, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const card = flashcards[currentIndex];
  const total = flashcards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setDirection(1);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i + 1), 100);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i - 1), 100);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      rotateY: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      rotateY: 0,
    }),
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white/90">Flashcards</h2>
            <p className="text-sm text-white/40">
              Card {currentIndex + 1} of {total}
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white/70 border border-white/5 hover:border-white/15 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-8">
        {flashcards.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsFlipped(false);
              setDirection(i > currentIndex ? 1 : -1);
              setTimeout(() => setCurrentIndex(i), 100);
            }}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'w-8 bg-accent-400'
                : 'w-2 bg-white/10 hover:bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Flashcard */}
      <div className="perspective mb-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              onClick={handleFlip}
              className="cursor-pointer select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleFlip();
              }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="preserve-3d relative w-full"
                style={{ minHeight: '300px' }}
              >
                {/* Front */}
                <div
                  className="backface-hidden absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center text-center noise"
                >
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-400/20 to-accent-400/20 flex items-center justify-center mb-6">
                    <Lightbulb className="w-6 h-6 text-brand-300" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-4 font-medium">
                    Concept
                  </p>
                  <h3 className="text-2xl font-bold gradient-text mb-4">
                    {card.concept}
                  </h3>
                  <p className="text-sm text-white/30 mt-auto flex items-center gap-2">
                    <Repeat className="w-4 h-4" />
                    Tap to reveal definition
                  </p>
                </div>

                {/* Back */}
                <div
                  className="backface-hidden rotate-y-180 absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.20 0.04 270 / 0.8), oklch(0.18 0.04 260 / 0.8))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid oklch(1 0 0 / 0.1)',
                  }}
                >
                  <p className="text-xs uppercase tracking-widest text-accent-400/60 mb-4 font-medium">
                    Definition
                  </p>
                  <p className="text-base text-white/80 leading-relaxed mb-6">
                    {card.definition}
                  </p>
                  <div className="w-full px-4 py-3 rounded-xl bg-accent-500/10 border border-accent-500/15">
                    <p className="text-xs text-accent-400/60 mb-1 font-medium">
                      💡 Key Takeaway
                    </p>
                    <p className="text-sm text-accent-400/90 font-medium">
                      {card.key_takeaway}
                    </p>
                  </div>
                  <p className="text-sm text-white/30 mt-auto flex items-center gap-2 pt-4">
                    <Repeat className="w-4 h-4" />
                    Tap to see concept
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: currentIndex > 0 ? 1.05 : 1 }}
          whileTap={{ scale: currentIndex > 0 ? 0.95 : 1 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            currentIndex > 0
              ? 'glass text-white/70 hover:text-white'
              : 'bg-white/3 text-white/15 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <div className="px-6 py-2 rounded-xl glass text-sm text-white/50">
          {currentIndex + 1} / {total}
        </div>

        <motion.button
          whileHover={{ scale: currentIndex < total - 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentIndex < total - 1 ? 0.95 : 1 }}
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            currentIndex < total - 1
              ? 'glass text-white/70 hover:text-white'
              : 'bg-white/3 text-white/15 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-white/20 mt-6">
        Click the card to flip · Use arrows or buttons to navigate
      </p>
    </div>
  );
}
