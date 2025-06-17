// Translation utility functions extracted from Translator component

// Helper function to split text into chunks while preserving word boundaries
const chunkText = (text: string, maxChunkSize: number = 1500): string[] => {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.split(/([.!?।॥]\s*)/); // Split on sentence boundaries including Hindi punctuation
  
  let currentChunk = '';
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    
    // If adding this sentence would exceed the limit, save current chunk and start new one
    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  // If we still have chunks that are too large, split them by words
  const finalChunks: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length <= maxChunkSize) {
      finalChunks.push(chunk);
    } else {
      // Split by words if sentence splitting wasn't enough
      const words = chunk.split(/(\s+)/);
      let wordChunk = '';
      
      for (const word of words) {
        if (wordChunk.length + word.length > maxChunkSize && wordChunk.length > 0) {
          finalChunks.push(wordChunk.trim());
          wordChunk = word;
        } else {
          wordChunk += word;
        }
      }
      
      if (wordChunk.trim().length > 0) {
        finalChunks.push(wordChunk.trim());
      }
    }
  }
  
  return finalChunks.filter(chunk => chunk.length > 0);
};

// Helper function to add delay between requests
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Google Translate API call with better error handling
const translateWithGoogle = async (text: string, from: string, to: string): Promise<string> => {
  try {
    // Check if text is too long for a single request
    const encodedText = encodeURIComponent(text);
    const baseUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=`;
    const fullUrl = baseUrl + encodedText;
    
    // If URL is too long, reject and let chunking handle it
    if (fullUrl.length > 1800) { // Conservative limit
      throw new Error('Text too long for single request');
    }

    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response structures
    if (data && data[0] && Array.isArray(data[0])) {
      // Multiple translation segments
      return data[0].map((segment: any[]) => segment[0]).join('');
    } else if (data && data[0] && data[0][0]) {
      // Single translation segment
      return data[0][0][0];
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Translation error:', error);
    throw error; // Re-throw to handle in chunked translation
  }
};

// Enhanced translation with chunking support
const translateWithGoogleChunked = async (text: string, from: string, to: string): Promise<string> => {
  try {
    // Try single request first for shorter text
    return await translateWithGoogle(text, from, to);
  } catch (error) {
    console.log('Falling back to chunked translation...');
    
    // Chunk the text and translate each chunk
    const chunks = chunkText(text);
    const translatedChunks: string[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      try {
        const translatedChunk = await translateWithGoogle(chunks[i], from, to);
        translatedChunks.push(translatedChunk);
        
        // Add delay between requests to avoid rate limiting
        if (i < chunks.length - 1) {
          await delay(500); // 500ms delay between chunks
        }
      } catch (chunkError) {
        console.error(`Error translating chunk ${i + 1}:`, chunkError);
        // If chunk translation fails, keep original text for that chunk
        translatedChunks.push(chunks[i]);
      }
    }
    
    return translatedChunks.join(' ');
  }
};

// Convert Devanagari script to Brahmi script
const devanagariToBrahmi = (text: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i);
    if (!codePoint) continue;

    // Handle space explicitly
    if (codePoint === 0x20) {
      result += ' '; // Keep spaces as spaces
      continue;
    }

    // Handle surrogate pairs - if this is a high surrogate, skip the next character
    if (codePoint > 0xFFFF) {
      i++; // Skip the low surrogate
    }

    switch (codePoint) {
      case 0x902: result += String.fromCodePoint(0x11001); break;
      case 0x905: result += String.fromCodePoint(0x11005); break; // A
      case 0x906: result += String.fromCodePoint(0x11006); break; // AA
      case 0x907: result += String.fromCodePoint(0x11007); break; // I
      case 0x908: result += String.fromCodePoint(0x11008); break; // II
      case 0x909: result += String.fromCodePoint(0x11009); break; // U
      case 0x90a: result += String.fromCodePoint(0x1100A); break; // UU
      case 0x90b: result += String.fromCodePoint(0x1100B); break; // Vocalic R
      case 0x90c: result += String.fromCodePoint(0x1100D); break; // Vocalic L
      case 0x90f: result += String.fromCodePoint(0x1100F); break; // E
      case 0x910: result += String.fromCodePoint(0x11010); break; // AI
      case 0x913: result += String.fromCodePoint(0x11011); break; // O
      case 0x914: result += String.fromCodePoint(0x11012); break; // AU
      case 0x915: result += String.fromCodePoint(0x11013); break; // KA
      case 0x916: result += String.fromCodePoint(0x11014); break; // KHA
      case 0x917: result += String.fromCodePoint(0x11015); break; // GA
      case 0x918: result += String.fromCodePoint(0x11016); break; // GHA
      case 0x919: result += String.fromCodePoint(0x11017); break; // NGA
      case 0x91a: result += String.fromCodePoint(0x11018); break; // CA
      case 0x91b: result += String.fromCodePoint(0x11019); break; // CHA
      case 0x91c: result += String.fromCodePoint(0x1101A); break; // JA
      case 0x91d: result += String.fromCodePoint(0x1101B); break; // JHA
      case 0x91e: result += String.fromCodePoint(0x1101C); break; // NYA
      case 0x91f: result += String.fromCodePoint(0x1101D); break; // TTA
      case 0x920: result += String.fromCodePoint(0x1101E); break; // TTHA
      case 0x921: result += String.fromCodePoint(0x1101F); break; // DDA
      case 0x922: result += String.fromCodePoint(0x11020); break; // DDHA
      case 0x923: result += String.fromCodePoint(0x11021); break; // NNA
      case 0x924: result += String.fromCodePoint(0x11022); break; // TA
      case 0x925: result += String.fromCodePoint(0x11023); break; // THA
      case 0x926: result += String.fromCodePoint(0x11024); break; // DA
      case 0x927: result += String.fromCodePoint(0x11025); break; // DHA
      case 0x928: result += String.fromCodePoint(0x11026); break; // NA
      case 0x92a: result += String.fromCodePoint(0x11027); break; // PA
      case 0x92b: result += String.fromCodePoint(0x11028); break; // PHA
      case 0x92c: result += String.fromCodePoint(0x11029); break; // BA
      case 0x92d: result += String.fromCodePoint(0x1102A); break; // BHA
      case 0x92e: result += String.fromCodePoint(0x1102B); break; // MA
      case 0x92f: result += String.fromCodePoint(0x1102C); break; // YA
      case 0x930: result += String.fromCodePoint(0x1102D); break; // RA
      case 0x932: result += String.fromCodePoint(0x1102E); break; // LA
      case 0x933: result += String.fromCodePoint(0x11034); break; // LLA
      case 0x935: result += String.fromCodePoint(0x1102F); break; // VA
      case 0x936: result += String.fromCodePoint(0x11030); break; // SHA
      case 0x937: result += String.fromCodePoint(0x11031); break; // SSA
      case 0x938: result += String.fromCodePoint(0x11032); break; // SA
      case 0x939: result += String.fromCodePoint(0x11033); break; // HA
      case 0x93e: result += String.fromCodePoint(0x11038); break; // AA
      case 0x93f: result += String.fromCodePoint(0x1103A); break; // I
      case 0x940: result += String.fromCodePoint(0x1103B); break; // II
      case 0x941: result += String.fromCodePoint(0x1103C); break; // U
      case 0x942: result += String.fromCodePoint(0x1103D); break; // UU
      case 0x943: result += String.fromCodePoint(0x1103E); break; // R
      case 0x944: result += String.fromCodePoint(0x1103F); break; // RR
      case 0x962: result += String.fromCodePoint(0x11040); break; // L
      case 0x963: result += String.fromCodePoint(0x11041); break; // LL
      case 0x947: result += String.fromCodePoint(0x11042); break; // E
      case 0x948: result += String.fromCodePoint(0x11043); break; // AI
      case 0x94b: result += String.fromCodePoint(0x11044); break; // O
      case 0x94c: result += String.fromCodePoint(0x11045); break; // AU
      case 0x94d: result += String.fromCodePoint(0x11046); break; // virama
      case 0x964: result += String.fromCodePoint(0x11047); break; // danda
      case 0x965: result += String.fromCodePoint(0x11048); break; // double danda
      case 0x966: result += String.fromCodePoint(0x11066); break; // 0
      case 0x967: result += String.fromCodePoint(0x11067); break; // 1
      case 0x968: result += String.fromCodePoint(0x11068); break; // 2
      case 0x969: result += String.fromCodePoint(0x11069); break; // 3
      case 0x96a: result += String.fromCodePoint(0x1106A); break; // 4
      case 0x96b: result += String.fromCodePoint(0x1106B); break; // 5
      case 0x96c: result += String.fromCodePoint(0x1106C); break; // 6
      case 0x96d: result += String.fromCodePoint(0x1106D); break; // 7
      case 0x96e: result += String.fromCodePoint(0x1106E); break; // 8
      case 0x96f: result += String.fromCodePoint(0x1106F); break; // 9
      default: result += String.fromCodePoint(codePoint); break;
    }
  }
  return result;
};

// Convert Brahmi script to Devanagari script
const brahmiToDevanagari = (text: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i);
    if (!codePoint) continue;

    // Handle space explicitly
    if (codePoint === 0x20) {
      result += ' '; // Keep spaces as spaces
      continue;
    }

    // Handle surrogate pairs - if this is a high surrogate, skip the next character
    if (codePoint > 0xFFFF) {
      i++; // Skip the low surrogate
    }

    switch (codePoint) {
      case 0x11001: result += String.fromCodePoint(0x902); break;
      case 0x11005: result += String.fromCodePoint(0x905); break; // A
      case 0x11006: result += String.fromCodePoint(0x906); break; // AA
      case 0x11007: result += String.fromCodePoint(0x907); break; // I
      case 0x11008: result += String.fromCodePoint(0x908); break; // II
      case 0x11009: result += String.fromCodePoint(0x909); break; // U
      case 0x1100a: result += String.fromCodePoint(0x90A); break; // UU
      case 0x1100b: result += String.fromCodePoint(0x90B); break; // Vocalic R
      case 0x1100d: result += String.fromCodePoint(0x90C); break; // Vocalic L
      case 0x1100f: result += String.fromCodePoint(0x90F); break; // E
      case 0x11010: result += String.fromCodePoint(0x910); break; // AI
      case 0x11011: result += String.fromCodePoint(0x913); break; // O
      case 0x11012: result += String.fromCodePoint(0x914); break; // AU
      case 0x11013: result += String.fromCodePoint(0x915); break; // KA
      case 0x11014: result += String.fromCodePoint(0x916); break; // KHA
      case 0x11015: result += String.fromCodePoint(0x917); break; // GA
      case 0x11016: result += String.fromCodePoint(0x918); break; // GHA
      case 0x11017: result += String.fromCodePoint(0x919); break; // NGA
      case 0x11018: result += String.fromCodePoint(0x91A); break; // CA
      case 0x11019: result += String.fromCodePoint(0x91B); break; // CHA
      case 0x1101a: result += String.fromCodePoint(0x91C); break; // JA
      case 0x1101b: result += String.fromCodePoint(0x91D); break; // JHA
      case 0x1101c: result += String.fromCodePoint(0x91E); break; // NYA
      case 0x1101d: result += String.fromCodePoint(0x91F); break; // TTA
      case 0x1101e: result += String.fromCodePoint(0x920); break; // TTHA
      case 0x1101f: result += String.fromCodePoint(0x921); break; // DDA
      case 0x11020: result += String.fromCodePoint(0x922); break; // DDHA
      case 0x11021: result += String.fromCodePoint(0x923); break; // NNA
      case 0x11022: result += String.fromCodePoint(0x924); break; // TA
      case 0x11023: result += String.fromCodePoint(0x925); break; // THA
      case 0x11024: result += String.fromCodePoint(0x926); break; // DA
      case 0x11025: result += String.fromCodePoint(0x927); break; // DHA
      case 0x11026: result += String.fromCodePoint(0x928); break; // NA
      case 0x11027: result += String.fromCodePoint(0x92A); break; // PA
      case 0x11028: result += String.fromCodePoint(0x92B); break; // PHA
      case 0x11029: result += String.fromCodePoint(0x92C); break; // BA
      case 0x1102a: result += String.fromCodePoint(0x92D); break; // BHA
      case 0x1102b: result += String.fromCodePoint(0x92E); break; // MA
      case 0x1102c: result += String.fromCodePoint(0x92F); break; // YA
      case 0x1102d: result += String.fromCodePoint(0x930); break; // RA
      case 0x1102e: result += String.fromCodePoint(0x932); break; // LA
      case 0x11034: result += String.fromCodePoint(0x933); break; // LLA
      case 0x1102f: result += String.fromCodePoint(0x935); break; // VA
      case 0x11030: result += String.fromCodePoint(0x936); break; // SHA
      case 0x11031: result += String.fromCodePoint(0x937); break; // SSA
      case 0x11032: result += String.fromCodePoint(0x938); break; // SA
      case 0x11033: result += String.fromCodePoint(0x939); break; // HA
      case 0x11038: result += String.fromCodePoint(0x93E); break; // AA
      case 0x1103a: result += String.fromCodePoint(0x93F); break; // I
      case 0x1103b: result += String.fromCodePoint(0x940); break; // II
      case 0x1103c: result += String.fromCodePoint(0x941); break; // U
      case 0x1103d: result += String.fromCodePoint(0x942); break; // UU
      case 0x1103e: result += String.fromCodePoint(0x943); break; // R
      case 0x1103f: result += String.fromCodePoint(0x944); break; // RR
      case 0x11040: result += String.fromCodePoint(0x962); break; // L
      case 0x11041: result += String.fromCodePoint(0x963); break; // LL
      case 0x11042: result += String.fromCodePoint(0x947); break; // E
      case 0x11043: result += String.fromCodePoint(0x948); break; // AI
      case 0x11044: result += String.fromCodePoint(0x94B); break; // O
      case 0x11045: result += String.fromCodePoint(0x94C); break; // AU
      case 0x11046: result += String.fromCodePoint(0x94D); break; // virama
      case 0x11047: result += String.fromCodePoint(0x964); break; // danda
      case 0x11048: result += String.fromCodePoint(0x965); break; // double danda
      case 0x11066: result += String.fromCodePoint(0x966); break; // 0
      case 0x11067: result += String.fromCodePoint(0x967); break; // 1
      case 0x11068: result += String.fromCodePoint(0x968); break; // 2
      case 0x11069: result += String.fromCodePoint(0x969); break; // 3
      case 0x1106a: result += String.fromCodePoint(0x96A); break; // 4
      case 0x1106b: result += String.fromCodePoint(0x96B); break; // 5
      case 0x1106c: result += String.fromCodePoint(0x96C); break; // 6
      case 0x1106d: result += String.fromCodePoint(0x96D); break; // 7
      case 0x1106e: result += String.fromCodePoint(0x96E); break; // 8
      case 0x1106f: result += String.fromCodePoint(0x96F); break; // 9
      default: result += String.fromCodePoint(codePoint); break;
    }
  }
  return result;
};

/**
 * Main translation function that handles text translation between different languages including Brahmi script
 * @param inputText - The text to translate
 * @param sourceLanguage - The source language code (e.g., 'hi', 'en', 'brahmi')
 * @param targetLanguage - The target language code (e.g., 'hi', 'en', 'brahmi')
 * @returns Promise<string> - The translated text
 */
export const translateText = async (
  inputText: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  if (!inputText.trim()) {
    return '';
  }

  try {
    let translated = '';
    
    if (sourceLanguage === 'brahmi') {
      // Input is Brahmi: convert to Devanagari first, then Google translate to target
      const devanagariText = brahmiToDevanagari(inputText);
      if (targetLanguage === 'brahmi') {
        // Brahmi to Brahmi (no change needed)
        translated = inputText;
      } else if (['hi', 'sa', 'mr', 'ne'].includes(targetLanguage)) {
        // Brahmi to Devanagari-based languages
        translated = devanagariText;
      } else {
        // Brahmi to other languages via Google Translate
        translated = await translateWithGoogleChunked(devanagariText, 'hi', targetLanguage);
      }
    } else if (targetLanguage === 'brahmi') {
      // Output is Brahmi: Google translate to Hindi first, then convert to Brahmi
      if (['hi', 'sa', 'mr', 'ne'].includes(sourceLanguage)) {
        // Direct Devanagari to Brahmi conversion
        translated = devanagariToBrahmi(inputText);
      } else {
        // Other languages to Brahmi via Google Translate to Hindi
        const hindiText = await translateWithGoogleChunked(inputText, sourceLanguage, 'hi');
        translated = devanagariToBrahmi(hindiText);
      }
    } else {
      // Neither input nor output is Brahmi: use Google Translate directly
      translated = await translateWithGoogleChunked(inputText, sourceLanguage, targetLanguage);
    }
    
    return translated;
  } catch (error) {
    console.error('Translation failed:', error);
    throw new Error('Translation failed');
  }
};

// Export individual functions for direct use if needed
export { devanagariToBrahmi, brahmiToDevanagari }; 