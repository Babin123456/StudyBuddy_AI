import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send,
  Eye,
  EyeOff,
  Lightbulb,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

export default function MockViva({ vivaQuestions, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  const question = vivaQuestions[currentIndex];
  const total = vivaQuestions.length;

  const handleSubmitAnswer = () => {
    if (userAnswer.trim().length === 0) return;
    setSubmitted(true);
    setShowIdealAnswer(true);
    setCompletedQuestions((prev) => new Set([...prev, currentIndex]));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer('');
      setShowIdealAnswer(false);
      setShowFollowUp(false);
      setSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setUserAnswer('');
      setShowIdealAnswer(false);
      setShowFollowUp(false);
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-brand-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white/90">Mock Viva</h2>
            <p className="text-sm text-white/40">
              Question {currentIndex + 1} of {total} ·{' '}
              {completedQuestions.size} answered
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {vivaQuestions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i === currentIndex
                ? 'bg-brand-400'
                : completedQuestions.has(i)
                  ? 'bg-success/60'
                  : 'bg-white/8'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question */}
          <div className="glass rounded-2xl p-8 mb-6 relative noise">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-400/20 to-brand-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-brand-300" />
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-widest mb-2 font-medium">
                  Examiner asks
                </p>
                <h3 className="text-lg font-semibold text-white/90 leading-relaxed">
                  {question.question}
                </h3>
              </div>
            </div>
          </div>

          {/* Answer Input */}
          <div className="glass rounded-2xl p-6 mb-6 relative noise">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3 font-medium">
              Your Answer
            </p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here... Think carefully about the key concepts and explain them clearly."
              disabled={submitted}
              className={`w-full h-36 px-4 py-3 rounded-xl input-viva-textarea text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all leading-relaxed ${
                submitted ? 'opacity-70' : ''
              }`}
            />

            {!submitted ? (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-white/20">
                  {userAnswer.length} characters
                </p>
                <motion.button
                  whileHover={{ scale: userAnswer.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: userAnswer.trim() ? 0.98 : 1 }}
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim()}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    userAnswer.trim()
                      ? 'bg-linear-to-r from-brand-500 to-brand-600 text-white glow-brand'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-3 text-sm text-success"
              >
                <CheckCircle2 className="w-4 h-4" />
                Answer submitted — compare with the model answer below
              </motion.div>
            )}
          </div>

          {/* Ideal Answer */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Toggle Ideal Answer */}
                <div className="glass rounded-2xl p-6 relative noise">
                  <button
                    onClick={() => setShowIdealAnswer(!showIdealAnswer)}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      {showIdealAnswer ? (
                        <EyeOff className="w-4 h-4 text-success" />
                      ) : (
                        <Eye className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-success">
                        {showIdealAnswer ? 'Hide' : 'Show'} Model Answer
                      </p>
                      <p className="text-xs text-white/30">
                        Compare your response with the ideal answer
                      </p>
                    </div>
                  </button>

                  <AnimatePresence>
                    {showIdealAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/5"
                      >
                        <p className="text-sm text-white/70 leading-relaxed">
                          {question.ideal_answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Follow-up Hint */}
                <div className="glass rounded-2xl p-6 relative noise">
                  <button
                    onClick={() => setShowFollowUp(!showFollowUp)}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warning">
                        Follow-up Hint
                      </p>
                      <p className="text-xs text-white/30">
                        Deepen your understanding
                      </p>
                    </div>
                  </button>

                  <AnimatePresence>
                    {showFollowUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/5"
                      >
                        <p className="text-sm text-warning/80 leading-relaxed">
                          💡 {question.follow_up_hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8">
            <motion.button
              whileHover={{ scale: currentIndex > 0 ? 1.02 : 1 }}
              whileTap={{ scale: currentIndex > 0 ? 0.95 : 1 }}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentIndex > 0
                  ? 'glass text-white/60 hover:text-white/90'
                  : 'bg-white/3 text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            {currentIndex < total - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-linear-to-r from-brand-500 to-brand-600 text-white"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-linear-to-r from-brand-500 to-accent-500 text-white"
              >
                <GraduationCap className="w-4 h-4" />
                Back to Dashboard
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
