/**
 * StudyBuddy AI - Ollama API Wrapper
 * 
 * Handles communication with the local Ollama server running Gemma.
 * Includes health checks, prompt construction, and response parsing.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'gemma:2b';

/**
 * Check if Ollama server is running and accessible.
 */
export async function checkOllamaHealth() {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { healthy: false, error: `Ollama returned status ${res.status}` };
    
    const data = await res.json();
    const models = data.models?.map(m => m.name) || [];
    const hasGemma = models.some(m => m.toLowerCase().includes('gemma'));
    
    return {
      healthy: true,
      models,
      hasGemma,
      message: hasGemma
        ? 'Ollama is running with Gemma model available.'
        : `Ollama is running but Gemma not found. Available models: ${models.join(', ')}. Run: ollama pull gemma:2b`,
    };
  } catch (err) {
    return {
      healthy: false,
      error: `Cannot connect to Ollama at ${OLLAMA_BASE_URL}. Ensure Ollama is running: "ollama serve"`,
    };
  }
}

/**
 * Build the prompt that forces Gemma to output structured JSON.
 */
function buildStudyPrompt(noteText) {
  // Truncate extremely long notes to stay within context window
  const maxChars = 6000;
  const truncated = noteText.length > maxChars
    ? noteText.substring(0, maxChars) + '\n\n[... notes truncated for processing ...]'
    : noteText;

  return `You are an expert educational AI tutor. Analyze the following study notes and generate structured study material.

CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. No markdown, no explanations, no text before or after the JSON. Just the raw JSON object.

The JSON object must have this EXACT structure:
{
  "title": "A descriptive title for this study session",
  "summary": "A brief 2-3 sentence summary of the key topics covered",
  "mcqs": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_index": 0,
      "explanation": "Why this answer is correct",
      "hint": "A helpful hint without giving away the answer"
    }
  ],
  "flashcards": [
    {
      "concept": "The term or concept name",
      "definition": "Clear definition or explanation",
      "key_takeaway": "The most important thing to remember"
    }
  ],
  "viva_questions": [
    {
      "question": "An open-ended exam-style question",
      "ideal_answer": "A comprehensive model answer",
      "follow_up_hint": "A hint for deeper understanding"
    }
  ]
}

Generate exactly 5 MCQs, 5 flashcards, and 3 viva questions based on the notes below.

--- STUDY NOTES START ---
${truncated}
--- STUDY NOTES END ---

Remember: Output ONLY the JSON object. No other text.`;
}

/**
 * Send a generation request to Ollama and return the raw text response.
 */
export async function generateStudyMaterial(noteText, model = DEFAULT_MODEL) {
  const prompt = buildStudyPrompt(noteText);

  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.3,
        top_p: 0.9,
        num_predict: 4096,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama API error (${res.status}): ${errText}`);
  }

  const data = await res.json();

  if (!data.response) {
    throw new Error('Ollama returned an empty response. The model may still be loading.');
  }

  return data.response;
}
