/**
 * StudyBuddy AI - API Service Layer
 * 
 * Handles all communication with the backend server.
 */

const API_BASE = '/api';

/**
 * Check if Ollama is running and healthy.
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

/**
 * Upload a file and generate study material.
 */
export async function generateFromFile(file, model = 'gemma:2b') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', model);

  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || err.details || `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * Generate study material from raw text.
 */
export async function generateFromText(text, model = 'gemma:2b') {
  const res = await fetch(`${API_BASE}/generate-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || err.details || `Server error: ${res.status}`);
  }

  return res.json();
}
