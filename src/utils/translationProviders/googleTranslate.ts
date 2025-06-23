// Google Translate API provider module

export interface TranslationProvider {
  translate(text: string, from: string, to: string): Promise<string>;
  translateChunked(text: string, from: string, to: string): Promise<string>;
  name: string;
}

// Helper function to split text into chunks while preserving word boundaries
const chunkText = (text: string, maxChunkSize: number = 200): string[] => {
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

// Google Translate API call
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
    console.error('Google Translate error:', error);
    throw error; // Re-throw to handle in chunked translation
  }
};

// Enhanced translation with chunking support
const translateWithGoogleChunked = async (text: string, from: string, to: string): Promise<string> => {
  try {
    // Try single request first for shorter text
    return await translateWithGoogle(text, from, to);
  } catch (error) {
    console.log('Falling back to chunked Google translation...');
    
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

// Google Translate Provider implementation
export class GoogleTranslateProvider implements TranslationProvider {
  name = 'Google Translate';

  async translate(text: string, from: string, to: string): Promise<string> {
    return await translateWithGoogle(text, from, to);
  }

  async translateChunked(text: string, from: string, to: string): Promise<string> {
    return await translateWithGoogleChunked(text, from, to);
  }
}

// Export instance
export const googleTranslateProvider = new GoogleTranslateProvider(); 