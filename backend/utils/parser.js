/**
 * StudyBuddy AI - File Parser Utility
 * 
 * Extracts clean text content from PDF, Markdown, and plain text files.
 */

import pdf from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs/promises';

/**
 * Extract text content from an uploaded file.
 * Supports: .pdf, .md, .markdown, .txt, .text
 */
export async function parseFile(filePath, originalName) {
  const ext = getExtension(originalName);
  const buffer = await fs.readFile(filePath);

  switch (ext) {
    case '.pdf':
      return parsePDF(buffer);
    case '.md':
    case '.markdown':
      return parseMarkdown(buffer.toString('utf-8'));
    case '.txt':
    case '.text':
    default:
      return cleanText(buffer.toString('utf-8'));
  }
}

/**
 * Extract text from a PDF buffer using pdf-parse.
 */
async function parsePDF(buffer) {
  try {
    const data = await pdf(buffer);
    return cleanText(data.text);
  } catch (err) {
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }
}

/**
 * Parse Markdown by stripping formatting artifacts.
 */
function parseMarkdown(text) {
  let cleaned = text
    // Remove headings markers but keep the text
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks but keep content
    .replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
    })
    // Remove link syntax but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove image syntax
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove horizontal rules
    .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '')
    // Remove blockquotes markers
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '');

  return cleanText(cleaned);
}

/**
 * Clean raw text by normalizing whitespace and removing artifacts.
 */
function cleanText(text) {
  return text
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive blank lines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Remove leading/trailing whitespace per line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Final trim
    .trim();
}

/**
 * Get normalized file extension.
 */
function getExtension(filename) {
  const dot = filename.lastIndexOf('.');
  if (dot === -1) return '.txt';
  return filename.substring(dot).toLowerCase();
}

/**
 * Get supported file extensions.
 */
export const SUPPORTED_EXTENSIONS = ['.pdf', '.md', '.markdown', '.txt', '.text'];

export function isSupportedFile(filename) {
  return SUPPORTED_EXTENSIONS.includes(getExtension(filename));
}
