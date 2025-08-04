// Language detection and chunk-based translation utilities

import { translateText } from './translator';

// Language detection based on Unicode ranges
export const detectLanguage = (text: string): string => {
  if (!text.trim()) return 'unknown';

  // Language counters
  const languageCharCounts: { [key: string]: number } = {
    en: 0,        // English
    hi: 0,        // Hindi/Devanagari
    kn: 0,        // Kannada
    ta: 0,        // Tamil
    te: 0,        // Telugu
    bn: 0,        // Bengali
    gu: 0,        // Gujarati
    ml: 0,        // Malayalam
    or: 0,        // Odia
    pa: 0,        // Punjabi
    sa: 0,        // Sanskrit (using Devanagari)
    mr: 0,        // Marathi (using Devanagari)
    ne: 0,        // Nepali (using Devanagari)
    brahmi: 0     // Brahmi
  };

  let arabicDigits = 0;
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

    // Arabic digits (0-9) - will be assigned to context later
    if (codePoint >= 0x0030 && codePoint <= 0x0039) {
      arabicDigits++;
    }
    // English (Basic Latin letters)
    else if ((codePoint >= 0x0041 && codePoint <= 0x005A) || (codePoint >= 0x0061 && codePoint <= 0x007A)) {
      languageCharCounts.en++;
    }
    // Hindi/Devanagari (U+0900–U+097F) - also used by Marathi, Nepali, Sanskrit
    else if (codePoint >= 0x0900 && codePoint <= 0x097F) {
      languageCharCounts.hi++;
    }
    // Bengali (U+0980–U+09FF)
    else if (codePoint >= 0x0980 && codePoint <= 0x09FF) {
      languageCharCounts.bn++;
    }
    // Gujarati (U+0A80–U+0AFF)
    else if (codePoint >= 0x0A80 && codePoint <= 0x0AFF) {
      languageCharCounts.gu++;
    }
    // Punjabi/Gurmukhi (U+0A00–U+0A7F)
    else if (codePoint >= 0x0A00 && codePoint <= 0x0A7F) {
      languageCharCounts.pa++;
    }
    // Odia (U+0B00–U+0B7F)
    else if (codePoint >= 0x0B00 && codePoint <= 0x0B7F) {
      languageCharCounts.or++;
    }
    // Tamil (U+0B80–U+0BFF)
    else if (codePoint >= 0x0B80 && codePoint <= 0x0BFF) {
      languageCharCounts.ta++;
    }
    // Telugu (U+0C00–U+0C7F)
    else if (codePoint >= 0x0C00 && codePoint <= 0x0C7F) {
      languageCharCounts.te++;
    }
    // Kannada (U+0C80–U+0CFF)
    else if (codePoint >= 0x0C80 && codePoint <= 0x0CFF) {
      languageCharCounts.kn++;
    }
    // Malayalam (U+0D00–U+0D7F)
    else if (codePoint >= 0x0D00 && codePoint <= 0x0D7F) {
      languageCharCounts.ml++;
    }
    // Brahmi (U+11000–U+1107F)
    else if (codePoint >= 0x11000 && codePoint <= 0x1107F) {
      languageCharCounts.brahmi++;
    }
  }

  if (totalChars === 0) return 'unknown';

  // If text is only Arabic digits, default to English
  if (arabicDigits === totalChars) {
    return 'en';
  }

  // Find the dominant script and assign Arabic digits to that context
  let dominantLanguage = 'en';
  let maxCount = languageCharCounts.en;
  
  for (const [lang, count] of Object.entries(languageCharCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantLanguage = lang;
    }
  }
  
  // Add Arabic digits to dominant language context
  languageCharCounts[dominantLanguage] += arabicDigits;

  // Calculate percentages and find the best match
  let bestLanguage = 'en';
  let bestPercentage = 0;
  
  for (const [lang, count] of Object.entries(languageCharCounts)) {
    const percentage = count / totalChars;
    if (percentage > bestPercentage && percentage > 0.3) { // 30% threshold
      bestPercentage = percentage;
      bestLanguage = lang;
    }
  }

  // If no language meets the 30% threshold, return the one with most characters
  if (bestPercentage <= 0.3) {
    let maxChars = 0;
    for (const [lang, count] of Object.entries(languageCharCounts)) {
      if (count > maxChars) {
        maxChars = count;
        bestLanguage = lang;
      }
    }
  }

  return bestLanguage;
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

// Translate mixed-language text to Hindi chunk by chunk
export const translateMixedTextToHindi = async (text: string): Promise<string> => {
  if (!text.trim()) return '';

  try {
    const chunks = splitTextIntoLanguageChunks(text);
    const translatedChunks: string[] = [];

    for (const chunk of chunks) {
      if (chunk.language === 'hi') {
        // Already in Hindi, no translation needed
        translatedChunks.push(chunk.text);
      } else if (chunk.language === 'brahmi') {
        // Convert Brahmi to Hindi (Devanagari)
        const translated = await translateText(chunk.text, chunk.language, 'hi');
        translatedChunks.push(translated);
      } else {
        // Translate other languages to Hindi
        const translated = await translateText(chunk.text, chunk.language, 'hi');
        translatedChunks.push(translated);
      }
    }

    return translatedChunks.join('');
  } catch (error) {
    console.error('Mixed text translation to Hindi failed:', error);
    throw error;
  }
};

// Get language statistics for debugging/info purposes
export const getLanguageStats = (text: string): { [key: string]: number } => {
  const chunks = splitTextIntoLanguageChunks(text);
  const stats: { [key: string]: number } = {};

  chunks.forEach(chunk => {
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'hi': 'Hindi',
      'kn': 'Kannada',
      'ta': 'Tamil',
      'te': 'Telugu',
      'bn': 'Bengali',
      'gu': 'Gujarati',
      'ml': 'Malayalam',
      'or': 'Odia',
      'pa': 'Punjabi',
      'sa': 'Sanskrit',
      'mr': 'Marathi',
      'ne': 'Nepali',
      'brahmi': 'Brahmi'
    };
    
    const lang = languageNames[chunk.language] || 'Unknown';
    stats[lang] = (stats[lang] || 0) + chunk.text.trim().length;
  });

  return stats;
}; 