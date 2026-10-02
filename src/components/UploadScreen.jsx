import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  FileType,
  Sparkles,
  Loader2,
  X,
  BookOpen,
  Wand2,
  AlertCircle,
} from 'lucide-react';
import { generateFromFile, generateFromText } from '../services/api';
import { sampleNotes } from '../data/sampleData';

export default function UploadScreen({ onGenerated, ollamaHealthy, onDemo }) {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' | 'text'

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md', '.markdown'],
      'text/plain': ['.txt', '.text'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors?.[0]?.message || 'Invalid file';
      setError(msg);
    },
  });

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      let result;
      if (mode === 'upload' && file) {
        result = await generateFromFile(file);
      } else if (mode === 'text' && textInput.trim().length >= 50) {
        result = await generateFromText(textInput.trim());
      } else {
        setError('Please provide a file or at least 50 characters of text.');
        setIsGenerating(false);
        return;
      }

      if (result.success && result.data) {
        onGenerated(result.data);
      } else {
        setError(result.error || 'Failed to generate study material.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSampleNotes = () => {
    setMode('text');
    setTextInput(sampleNotes);
    setError('');
  };

  const fileIcon = (name) => {
    if (name?.endsWith('.pdf')) return <FileType className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const canGenerate =
    (mode === 'upload' && file) || (mode === 'text' && textInput.trim().length >= 50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-3xl mx-auto px-4"
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-brand-300 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Local AI</span>
        </motion.div>
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="gradient-text">Transform Your Notes</span>
          <br />
          <span className="text-white/90">Into Study Power</span>
        </h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Upload your lecture notes and let AI generate interactive quizzes,
          flashcards, and mock viva questions — all running locally on your machine.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setMode('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === 'upload'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
              : 'text-white/40 hover:text-white/60 border border-transparent'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
        <button
          onClick={() => setMode('text')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === 'text'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
              : 'text-white/40 hover:text-white/60 border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>
      </div>

      {/* Content Area */}
      <div className="glass rounded-2xl p-8 relative noise">
        <AnimatePresence mode="wait">
          {mode === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Drop Zone */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'dropzone-active border-brand-400 bg-brand-500/5'
                    : 'border-white/10 hover:border-brand-500/30 hover:bg-brand-500/5'
                }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-brand-300" />
                  </div>
                  <div>
                    <p className="text-white/80 font-medium mb-1">
                      {isDragActive
                        ? 'Drop your file here...'
                        : 'Drag & drop your study notes'}
                    </p>
                    <p className="text-white/40 text-sm">
                      Supports PDF, Markdown, and plain text files (max 10MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-white/5 text-white/50 text-sm hover:bg-white/10 hover:text-white/70 transition-all border border-white/5"
                  >
                    Browse Files
                  </button>
                </motion.div>
              </div>

              {/* Selected File */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-500/10 border border-brand-500/20"
                  >
                    <div className="text-brand-300">{fileIcon(file.name)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{file.name}</p>
                      <p className="text-xs text-white/40">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setError('');
                }}
                placeholder="Paste your lecture notes, textbook excerpts, or study material here... (minimum 50 characters)"
                className="w-full h-56 px-5 py-4 rounded-2xl input-notes-textarea text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all font-mono leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-white/30">
                  {textInput.length} characters
                  {textInput.length > 0 && textInput.length < 50 && (
                    <span className="text-warning"> · min 50 required</span>
                  )}
                </p>
                <button
                  onClick={loadSampleNotes}
                  className="flex items-center gap-2 text-xs text-brand-300/60 hover:text-brand-300 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Load sample notes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: canGenerate && !isGenerating ? 1.02 : 1 }}
          whileTap={{ scale: canGenerate && !isGenerating ? 0.98 : 1 }}
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className={`w-full mt-6 py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all ${
            canGenerate && !isGenerating
              ? 'bg-linear-to-r from-brand-500 to-accent-500 text-white glow-brand hover:shadow-lg hover:shadow-brand-500/20'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Study Material...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Study Material
            </>
          )}
        </motion.button>

        {!ollamaHealthy && (
          <div className="mt-4 space-y-3">
            <p className="text-center text-xs text-warning/60">
              ⚠️ Ollama is offline — generation will fail.
            </p>
            <button
              onClick={onDemo}
              className="w-full py-3 rounded-xl border border-accent-500/30 bg-accent-500/10 text-accent-400 font-medium text-sm hover:bg-accent-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Try Demo Mode (Sample ML Notes)
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
