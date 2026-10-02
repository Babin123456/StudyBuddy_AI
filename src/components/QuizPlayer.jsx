import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  Trophy,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';

export default function QuizPlayer({ mcqs, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = mcqs[currentIndex];
  const totalQuestions = mcqs.length;
  const progress = ((currentIndex) / totalQuestions) * 100;

  const handleSelect = (index) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === question.correct_answer_index;
    if (isCorrect) setScore((s) => s + 1);

    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentIndex, selected: selectedOption, correct: isCorrect },
    ]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
      setShowHint(false);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setShowHint(false);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  const getOptionStyle = (index) => {
    const base =
      'w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 flex items-start gap-3';

    if (!showResult) {
      return `${base} ${
        selectedOption === index
          ? 'border-brand-400/50 bg-brand-500/10 text-white'
          : 'border-white/8 bg-white/3 text-white/70 hover:border-white/15 hover:bg-white/5'
      }`;
    }

    if (index === question.correct_answer_index) {
      return `${base} border-success/40 bg-success/10 text-success`;
    }
    if (index === selectedOption && index !== question.correct_answer_index) {
      return `${base} border-danger/40 bg-danger/10 text-danger`;
    }
    return `${base} border-white/5 bg-white/2 text-white/30`;
  };

  const letterLabels = ['A', 'B', 'C', 'D'];

  // ─── Score Summary ─────────────────────────────────────
  if (quizComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const emoji =
      percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪';
    const message =
      percentage >= 80
        ? 'Outstanding! You really know your stuff!'
        : percentage >= 60
          ? 'Good job! A few more reviews and you\'ll ace it.'
          : percentage >= 40
            ? 'Getting there! Keep studying these topics.'
            : 'Don\'t worry! Review the material and try again.';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto px-4"
      >
        <div className="glass rounded-2xl p-8 text-center relative noise">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-linear-to-br from-brand-400 to-accent-500 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold gradient-text mb-2">Quiz Complete!</h2>
          <p className="text-white/50 text-lg mb-6">{message}</p>

          <div className="text-6xl mb-2">{emoji}</div>

          <div className="flex items-center justify-center gap-8 my-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{score}</p>
              <p className="text-sm text-white/40">Correct</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{totalQuestions}</p>
              <p className="text-sm text-white/40">Total</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className={`text-4xl font-bold ${
                percentage >= 60 ? 'text-success' : 'text-warning'
              }`}>
                {percentage}%
              </p>
              <p className="text-sm text-white/40">Score</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full h-3 rounded-full bg-white/5 mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                percentage >= 80
                  ? 'bg-linear-to-r from-success to-accent-500'
                  : percentage >= 60
                    ? 'bg-linear-to-r from-brand-400 to-brand-500'
                    : 'bg-linear-to-r from-warning to-danger'
              }`}
            />
          </div>

          {/* Review answers */}
          <div className="space-y-2 mb-6 text-left">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                  a.correct
                    ? 'bg-success/5 border border-success/10'
                    : 'bg-danger/5 border border-danger/10'
                }`}
              >
                {a.correct ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-danger shrink-0" />
                )}
                <span className="text-white/60 truncate">
                  Q{i + 1}: {mcqs[i].question}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-all font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── Question Card ─────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/40">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-brand-300 font-medium">
            Score: {score}/{currentIndex > 0 || showResult ? currentIndex + (showResult ? 1 : 0) : 0}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            animate={{ width: `${((currentIndex + (showResult ? 1 : 0)) / totalQuestions) * 100}%` }}
            className="h-full rounded-full bg-linear-to-r from-brand-500 to-accent-500"
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Navigator Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {mcqs.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'w-6 bg-brand-400'
                : i < currentIndex
                  ? answers[i]?.correct
                    ? 'bg-success/60'
                    : 'bg-danger/60'
                  : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-2xl p-8 relative noise"
        >
          {/* Question */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-brand-300" />
            </div>
            <h3 className="text-lg font-semibold text-white/90 leading-relaxed">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                whileHover={!showResult ? { scale: 1.01 } : {}}
                whileTap={!showResult ? { scale: 0.99 } : {}}
                onClick={() => handleSelect(i)}
                className={getOptionStyle(i)}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    showResult && i === question.correct_answer_index
                      ? 'bg-success/20 text-success'
                      : showResult && i === selectedOption
                        ? 'bg-danger/20 text-danger'
                        : selectedOption === i
                          ? 'bg-brand-500/20 text-brand-300'
                          : 'bg-white/5 text-white/40'
                  }`}
                >
                  {letterLabels[i]}
                </span>
                <span className="text-sm leading-relaxed">{option}</span>
                {showResult && i === question.correct_answer_index && (
                  <CheckCircle2 className="w-5 h-5 text-success ml-auto shrink-0" />
                )}
                {showResult &&
                  i === selectedOption &&
                  i !== question.correct_answer_index && (
                    <XCircle className="w-5 h-5 text-danger ml-auto shrink-0" />
                  )}
              </motion.button>
            ))}
          </div>

          {/* Hint Toggle */}
          {!showResult && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-sm text-warning/70 hover:text-warning transition-all mb-4"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>
          )}

          <AnimatePresence>
            {showHint && !showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-3 rounded-xl bg-warning/5 border border-warning/10 text-sm text-warning/80 mb-4"
              >
                💡 {question.hint}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    selectedOption === question.correct_answer_index
                      ? 'bg-success/10 border border-success/20 text-success'
                      : 'bg-danger/10 border border-danger/20 text-danger'
                  }`}
                >
                  {selectedOption === question.correct_answer_index ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Correct! Well done!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Incorrect. The answer is {letterLabels[question.correct_answer_index]}.
                    </>
                  )}
                </div>

                {/* Explanation Toggle */}
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 text-sm text-brand-300/70 hover:text-brand-300 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </button>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-3 rounded-xl bg-brand-500/5 border border-brand-500/10 text-sm text-white/60 leading-relaxed"
                    >
                      {question.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
            {!showResult ? (
              <motion.button
                whileHover={{ scale: selectedOption !== null ? 1.02 : 1 }}
                whileTap={{ scale: selectedOption !== null ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedOption !== null
                    ? 'bg-linear-to-r from-brand-500 to-brand-600 text-white glow-brand'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Submit Answer
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-linear-to-r from-brand-500 to-accent-500 text-white glow-brand"
              >
                {currentIndex < totalQuestions - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    See Results
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
