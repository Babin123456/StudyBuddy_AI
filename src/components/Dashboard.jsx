import { motion } from 'framer-motion';
import {
  Brain,
  Layers,
  GraduationCap,
  ArrowLeft,
  FileText,
  Sparkles,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard({ studyData, onNavigate, onReset }) {
  const cards = [
    {
      id: 'quiz',
      icon: Brain,
      title: 'Quiz Mode',
      description: `${studyData.mcqs.length} multiple choice questions to test your knowledge`,
      color: 'from-brand-400 to-brand-600',
      bgColor: 'bg-brand-500/10',
      borderColor: 'border-brand-500/15',
      count: studyData.mcqs.length,
      label: 'questions',
    },
    {
      id: 'flashcards',
      icon: Layers,
      title: 'Flashcards',
      description: `${studyData.flashcards.length} interactive flip cards for quick concept review`,
      color: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/15',
      count: studyData.flashcards.length,
      label: 'cards',
    },
    {
      id: 'viva',
      icon: GraduationCap,
      title: 'Mock Viva',
      description: `${studyData.viva_questions.length} open-ended questions with model answers`,
      color: 'from-warning to-danger',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/15',
      count: studyData.viva_questions.length,
      label: 'questions',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-accent-400 mb-4">
          <Sparkles className="w-4 h-4" />
          Study Material Ready
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">
          {studyData.title}
        </h2>
        <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
          {studyData.summary}
        </p>
      </motion.div>

      {/* Stats Strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass text-xs sm:text-sm"
          >
            <card.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40" />
            <span className="text-white/60 font-medium">{card.count}</span>
            <span className="text-white/30">{card.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Mode Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-3"
      >
        {cards.map((card) => (
          <motion.button
            key={card.id}
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(card.id)}
            className={`glass rounded-2xl p-6 text-left card-hover group relative overflow-hidden noise`}
          >
            {/* Gradient orb */}
            <div
              className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-linear-to-br ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`}
            />

            <div
              className={`w-14 h-14 rounded-2xl ${card.bgColor} border ${card.borderColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
            >
              <card.icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
            </div>

            <h3 className="text-lg font-bold text-white/90 mb-2 group-hover:text-white transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors">
              {card.description}
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-brand-300/60 group-hover:text-brand-300 transition-colors">
              Start →
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Upload New */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-10"
      >
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 border border-white/5 hover:border-white/15 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Upload Different Notes
        </button>
      </motion.div>
    </div>
  );
}
