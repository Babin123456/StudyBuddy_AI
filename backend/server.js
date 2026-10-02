/**
 * StudyBuddy AI - Express Backend Server
 * 
 * Handles file uploads, text parsing, Ollama AI generation,
 * and serves the study material API.
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { parseFile, isSupportedFile } from './utils/parser.js';
import { checkOllamaHealth, generateStudyMaterial } from './utils/ollama.js';
import { repairJSON, validateStudyMaterial } from './utils/jsonRepair.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, 'uploads');
await fs.mkdir(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (isSupportedFile(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload PDF, Markdown, or text files.'));
    }
  },
});

// ─── Routes ────────────────────────────────────────────────────

/**
 * GET /api/health
 * Check Ollama server status and available models.
 */
app.get('/api/health', async (req, res) => {
  try {
    const status = await checkOllamaHealth();
    res.json(status);
  } catch (err) {
    res.status(500).json({ healthy: false, error: err.message });
  }
});

/**
 * POST /api/generate
 * Upload a file or provide raw text, and generate study material via Ollama.
 */
app.post('/api/generate', upload.single('file'), async (req, res) => {
  let noteText = '';
  let tempFilePath = null;

  try {
    // Source 1: Uploaded file
    if (req.file) {
      tempFilePath = req.file.path;
      noteText = await parseFile(req.file.path, req.file.originalname);
    }
    // Source 2: Raw text in body
    else if (req.body.text) {
      noteText = req.body.text.trim();
    }
    // Neither provided
    else {
      return res.status(400).json({
        error: 'No content provided. Upload a file or provide text in the request body.',
      });
    }

    // Validate we have enough content
    if (noteText.length < 50) {
      return res.status(400).json({
        error: 'Content is too short (min 50 characters). Please provide more detailed notes.',
      });
    }

    console.log(`[StudyBuddy] Processing ${noteText.length} characters of notes...`);

    // Check Ollama is available
    const health = await checkOllamaHealth();
    if (!health.healthy) {
      return res.status(503).json({
        error: 'Ollama is not available. Please ensure Ollama is running locally.',
        setup: 'Run: ollama serve (then in another terminal: ollama pull gemma:2b)',
        details: health.error,
      });
    }

    // Determine model to use: prefer installed Gemma model if requested model is unavailable
    const availableGemma = health.models?.find(m => m.toLowerCase().includes('gemma'));
    const isRequestedInstalled = req.body.model && health.models?.some(m => m === req.body.model);
    const model = (isRequestedInstalled ? req.body.model : null) || process.env.OLLAMA_MODEL || availableGemma || 'gemma2:2b';
    console.log(`[StudyBuddy] Generating study material with model: ${model}`);

    // Generate via Ollama
    const rawResponse = await generateStudyMaterial(noteText, model);
    console.log(`[StudyBuddy] Raw response length: ${rawResponse.length} chars`);

    // Parse and repair JSON
    const parsed = repairJSON(rawResponse);
    
    // Validate structure
    const { data, warnings } = validateStudyMaterial(parsed);

    if (warnings.length > 0) {
      console.warn(`[StudyBuddy] Validation warnings: ${warnings.join(', ')}`);
    }

    res.json({
      success: true,
      data,
      meta: {
        model,
        inputLength: noteText.length,
        warnings,
      },
    });
  } catch (err) {
    console.error('[StudyBuddy] Generation error:', err.message);
    res.status(500).json({
      error: 'Failed to generate study material.',
      details: err.message,
    });
  } finally {
    // Clean up uploaded file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
});

/**
 * POST /api/generate-text
 * Generate study material from raw text (no file upload).
 */
app.post('/api/generate-text', async (req, res) => {
  try {
    const { text, model } = req.body;

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        error: 'Please provide at least 50 characters of study notes.',
      });
    }

    // Check Ollama is available
    const health = await checkOllamaHealth();
    if (!health.healthy) {
      return res.status(503).json({
        error: 'Ollama is not available.',
        setup: 'Run: ollama serve (then: ollama pull gemma:2b)',
        details: health.error,
      });
    }

    const availableGemma = health.models?.find(m => m.toLowerCase().includes('gemma'));
    const isRequestedInstalled = model && health.models?.some(m => m === model);
    const selectedModel = (isRequestedInstalled ? model : null) || process.env.OLLAMA_MODEL || availableGemma || 'gemma2:2b';
    console.log(`[StudyBuddy] Text generation with ${selectedModel}, ${text.length} chars`);

    const rawResponse = await generateStudyMaterial(text.trim(), selectedModel);
    const parsed = repairJSON(rawResponse);
    const { data, warnings } = validateStudyMaterial(parsed);

    res.json({ success: true, data, meta: { model: selectedModel, inputLength: text.length, warnings } });
  } catch (err) {
    console.error('[StudyBuddy] Text generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate study material.', details: err.message });
  }
});

// ─── Error Handling ────────────────────────────────────────────

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  console.error('[StudyBuddy] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start Server ──────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║          📚 StudyBuddy AI Backend                 ║
  ║          Running on http://localhost:${PORT}         ║
  ║                                                   ║
  ║   Ensure Ollama is running:  ollama serve          ║
  ║   Pull Gemma model:         ollama pull gemma:2b   ║
  ╚═══════════════════════════════════════════════════╝
  `);
});
