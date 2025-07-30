// Language detection and chunk-based translation utilities

import { translateText } from './translator';

// Language detection based on Unicode ranges
export const detectLanguage = (text: string): string => {
  if (!text.trim()) return 'unknown';

  let englishChars = 0;
  let hindiChars = 0;
  let brahmiChars = 0;
  let arabicDigits = 0;
  let devanagariDigits = 0;
  let brahmiDigits = 0;
  let totalChars = 0;

  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i);
    if (!codePoint) continue;

    // Skip whitespace and punctuation (but not digits)
    if (codePoint <= 0x0020 || (codePoint >= 0x0021 && codePoint <= 0x002F) || 
        (codePoint >= 0x003A && codePoint <= 0x0040) || 
        (codePoint >= 0x005B && codePoint <= 0x0060) || 
        (codePoint >= 0x007B && codePoint <= 0x007F)) {
      continue;
    }

    totalChars++;

    // Arabic digits (0-9)
    if (codePoint >= 0x0030 && codePoint <= 0x0039) {
      arabicDigits++;
    }
    // Devanagari digits (०-९)
    else if (codePoint >= 0x0966 && codePoint <= 0x096F) {
      devanagariDigits++;
      hindiChars++; // Count as Hindi
    }
    // Brahmi digits (𑁦-𑁯)
    else if (codePoint >= 0x11066 && codePoint <= 0x1106F) {
      brahmiDigits++;
      brahmiChars++; // Count as Brahmi
    }
    // English (Basic Latin letters)
    else if ((codePoint >= 0x0041 && codePoint <= 0x005A) || (codePoint >= 0x0061 && codePoint <= 0x007A)) {
      englishChars++;
    }
    // Hindi/Devanagari (excluding digits which are handled above)
    else if (codePoint >= 0x0900 && codePoint <= 0x097F && !(codePoint >= 0x0966 && codePoint <= 0x096F)) {
      hindiChars++;
    }
    // Brahmi (excluding digits which are handled above)
    else if (codePoint >= 0x11000 && codePoint <= 0x1107F && !(codePoint >= 0x11066 && codePoint <= 0x1106F)) {
      brahmiChars++;
    }
  }

  if (totalChars === 0) return 'unknown';

  // If text is only Arabic digits, we need context - default to English for standalone numbers
  if (arabicDigits === totalChars) {
    return 'en';
  }

  // Add Arabic digits to the dominant script context
  if (hindiChars > englishChars && hindiChars > brahmiChars) {
    // Hindi context - treat Arabic digits as part of Hindi
    hindiChars += arabicDigits;
  } else if (brahmiChars > englishChars && brahmiChars > hindiChars) {
    // Brahmi context - treat Arabic digits as part of Brahmi
    brahmiChars += arabicDigits;
  } else {
    // English context or default - treat Arabic digits as part of English
    englishChars += arabicDigits;
  }

  // Calculate percentages
  const englishPercentage = englishChars / totalChars;
  const hindiPercentage = hindiChars / totalChars;
  const brahmiPercentage = brahmiChars / totalChars;

  // Return the language with highest percentage (minimum 30% threshold)
  if (brahmiPercentage > 0.3) return 'brahmi';
  if (hindiPercentage > 0.3) return 'hi';
  if (englishPercentage > 0.3) return 'en';

  // If no clear majority, return the one with most characters
  if (brahmiChars >= hindiChars && brahmiChars >= englishChars) return 'brahmi';
  if (hindiChars >= englishChars) return 'hi';
  return 'en';
};

// Text chunk with its detected language
interface TextChunk {
  text: string;
  language: string;
  startIndex: number;
  endIndex: number;
}

// Split text into chunks based on language changes
export const splitTextIntoLanguageChunks = (text: string): TextChunk[] => {
  if (!text.trim()) return [];

  const chunks: TextChunk[] = [];
  let currentChunk = '';
  let currentLanguage = '';
  let chunkStartIndex = 0;

  // Process text word by word to detect language changes
  const words = text.split(/(\s+)/); // Split but keep separators
  let wordIndex = 0;

  for (const word of words) {
    const wordLanguage = detectLanguage(word);
    
    // If it's just whitespace, add to current chunk without changing language
    if (wordLanguage === 'unknown' || /^\s+$/.test(word)) {
      currentChunk += word;
      wordIndex += word.length;
      continue;
    }

    // If language changed or this is the first word
    if (currentLanguage !== wordLanguage) {
      // Save previous chunk if it exists
      if (currentChunk && currentLanguage) {
        chunks.push({
          text: currentChunk,
          language: currentLanguage,
          startIndex: chunkStartIndex,
          endIndex: wordIndex
        });
      }

      // Start new chunk
      currentChunk = word;
      currentLanguage = wordLanguage;
      chunkStartIndex = wordIndex;
    } else {
      // Same language, add to current chunk
      currentChunk += word;
    }

    wordIndex += word.length;
  }

  // Add the last chunk
  if (currentChunk && currentLanguage) {
    chunks.push({
      text: currentChunk,
      language: currentLanguage,
      startIndex: chunkStartIndex,
      endIndex: text.length
    });
  }

  return chunks;
};

// Translate mixed-language text to Brahmi chunk by chunk
export const translateMixedTextToBrahmi = async (text: string): Promise<string> => {
  if (!text.trim()) return '';

  try {
    const chunks = splitTextIntoLanguageChunks(text);
    const translatedChunks: string[] = [];

    for (const chunk of chunks) {
      if (chunk.language === 'brahmi') {
        // Already in Brahmi, no translation needed
        translatedChunks.push(chunk.text);
      } else {
        // Translate to Brahmi
        const translated = await translateText(chunk.text, chunk.language, 'brahmi');
        translatedChunks.push(translated);
      }
    }

    return translatedChunks.join('');
  } catch (error) {
    console.error('Mixed text translation failed:', error);
    throw error;
  }
};

// Get language statistics for debugging/info purposes
export const getLanguageStats = (text: string): { [key: string]: number } => {
  const chunks = splitTextIntoLanguageChunks(text);
  const stats: { [key: string]: number } = {};

  chunks.forEach(chunk => {
    const lang = chunk.language === 'en' ? 'English' : 
                 chunk.language === 'hi' ? 'Hindi' : 
                 chunk.language === 'brahmi' ? 'Brahmi' : 'Unknown';
    stats[lang] = (stats[lang] || 0) + chunk.text.trim().length;
  });

  return stats;
}; 