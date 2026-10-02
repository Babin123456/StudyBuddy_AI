/**
 * StudyBuddy AI - JSON Repair Utility
 * 
 * Handles cases where Gemma outputs conversational markdown
 * around the JSON payload, extracting and repairing the JSON.
 */

/**
 * Attempts to extract and repair JSON from a potentially messy LLM response.
 * Handles markdown code fences, conversational prefixes/suffixes, and common
 * JSON formatting issues from open-weight models.
 */
export function repairJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty or invalid response from AI model');
  }

  let text = rawText.trim();

  // Step 1: Strip markdown code fences (```json ... ``` or ``` ... ```)
  const codeFenceRegex = /```(?:json)?\s*\n?([\s\S]*?)```/;
  const fenceMatch = text.match(codeFenceRegex);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Step 2: Try direct parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // Continue with repair
  }

  // Step 3: Find the outermost JSON object { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {
      // Continue with deeper repair
    }

    // Step 4: Try to fix common issues
    let fixed = candidate
      // Fix trailing commas before closing brackets/braces
      .replace(/,\s*([\]}])/g, '$1')
      // Fix single quotes to double quotes (naive but covers many cases)
      .replace(/'/g, '"')
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, (match) => {
        if (match === '\n' || match === '\r' || match === '\t') return match;
        return '';
      })
      // Fix unescaped newlines in strings
      .replace(/(?<=:\s*"[^"]*)\n([^"]*")/g, '\\n$1');

    try {
      return JSON.parse(fixed);
    } catch (e) {
      // Last resort: try to fix missing quotes around keys
      fixed = fixed.replace(/(\{|,)\s*(\w+)\s*:/g, '$1"$2":');
      try {
        return JSON.parse(fixed);
      } catch (finalError) {
        throw new Error(
          `Failed to parse AI response as JSON after repair attempts. ` +
          `Raw response starts with: "${rawText.substring(0, 200)}..."`
        );
      }
    }
  }

  // Step 5: Check if it's a JSON array
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const candidate = text.substring(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {
      // Give up
    }
  }

  throw new Error(
    `Could not find valid JSON in AI response. ` +
    `Response starts with: "${rawText.substring(0, 200)}..."`
  );
}

/**
 * Validates the parsed study material JSON structure.
 * Returns the validated object or throws with specific missing field info.
 */
export function validateStudyMaterial(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string') {
    data.title = 'Study Session';
  }

  if (!data.summary || typeof data.summary !== 'string') {
    data.summary = 'AI-generated study material from your notes.';
  }

  // Validate MCQs
  if (!Array.isArray(data.mcqs)) {
    errors.push('Missing or invalid "mcqs" array');
    data.mcqs = [];
  } else {
    data.mcqs = data.mcqs.map((q, i) => ({
      question: q.question || `Question ${i + 1}`,
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options.map(String)
        : ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer_index: typeof q.correct_answer_index === 'number'
        ? Math.min(3, Math.max(0, q.correct_answer_index))
        : 0,
      explanation: q.explanation || 'No explanation provided.',
      hint: q.hint || 'Review the relevant section in your notes.',
    }));
  }

  // Validate Flashcards
  if (!Array.isArray(data.flashcards)) {
    errors.push('Missing or invalid "flashcards" array');
    data.flashcards = [];
  } else {
    data.flashcards = data.flashcards.map((f, i) => ({
      concept: f.concept || `Concept ${i + 1}`,
      definition: f.definition || 'Definition not provided.',
      key_takeaway: f.key_takeaway || f.keyTakeaway || 'Review this concept.',
    }));
  }

  // Validate Viva Questions
  if (!Array.isArray(data.viva_questions)) {
    // Try alternate key names
    if (Array.isArray(data.vivaQuestions)) {
      data.viva_questions = data.vivaQuestions;
      delete data.vivaQuestions;
    } else if (Array.isArray(data.viva)) {
      data.viva_questions = data.viva;
      delete data.viva;
    } else {
      errors.push('Missing or invalid "viva_questions" array');
      data.viva_questions = [];
    }
  }
  
  data.viva_questions = data.viva_questions.map((v, i) => ({
    question: v.question || `Viva Question ${i + 1}`,
    ideal_answer: v.ideal_answer || v.idealAnswer || 'Answer not provided.',
    follow_up_hint: v.follow_up_hint || v.followUpHint || 'Think deeper about this topic.',
  }));

  return { data, warnings: errors };
}
