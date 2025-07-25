// Microsoft Azure Translate API provider module

import { TranslationProvider } from './googleTranslate';

// Custom HTTP Error class for handling specific status codes
export class HTTPError extends Error {
  public status: number;
  public statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.name = 'HTTPError';
    this.status = status;
    this.statusText = statusText;
  }

  // Check if it's a 4xx client error
  is4xx(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

// Azure Translate configuration
interface AzureTranslateConfig {
  subscriptionKey?: string;
  endpoint?: string;
  region?: string;
}

// Default configuration - can be overridden by environment variables
const defaultConfig: AzureTranslateConfig = {
  subscriptionKey: process.env.REACT_APP_AZURE_TRANSLATE_KEY || '2FUc4XluY5ZOhhPGbFc19A45x3BZFfxJYg5OxO8NJMC1UyVmz99RJQQJ99BFACGhslBXJ3w3AAAbACOG1wrs',
  endpoint: process.env.REACT_APP_AZURE_TRANSLATE_ENDPOINT || 'https://api.cognitive.microsofttranslator.com',
  region: process.env.REACT_APP_AZURE_TRANSLATE_REGION || 'centralindia'
};

// Azure Translate API response interface
interface AzureTranslateResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
}

// Azure Translate API call
const translateWithAzure = async (
  text: string, 
  from: string, 
  to: string, 
  config: AzureTranslateConfig = defaultConfig
): Promise<string> => {
  if (!config.subscriptionKey) {
    throw new Error('Azure Translate subscription key is required. Set REACT_APP_AZURE_TRANSLATE_KEY environment variable.');
  }

  try {
    const url = `${config.endpoint}/translate?api-version=3.0&from=${from}&to=${to}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'Ocp-Apim-Subscription-Region': config.region || 'global',
        'Content-Type': 'application/json',
        'X-ClientTraceId': generateUUID()
      },
      body: JSON.stringify([{ text: text }])
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Throw specific HTTPError for better error handling
      throw new HTTPError(
        response.status,
        response.statusText,
        `Azure Translate API error (${response.status}): ${errorText}`
      );
    }

    const data: AzureTranslateResponse[] = await response.json();
    
    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      return data[0].translations[0].text;
    }
    
    throw new Error('Invalid Azure Translate API response format');
  } catch (error) {
    console.error('Azure Translate error:', error);
    throw error;
  }
};

// Helper function to generate UUID for Azure API tracking
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Chunked translation for Azure (similar to Google but using Azure API)
const translateWithAzureChunked = async (
  text: string, 
  from: string, 
  to: string,
  config: AzureTranslateConfig = defaultConfig
): Promise<string> => {
  // For now, Azure supports longer texts in single requests than Google
  // So we'll try single-shot first, with chunking as fallback
  try {
    return await translateWithAzure(text, from, to, config);
  } catch (error) {
    // If it's a 4xx error, propagate it immediately for fallback to Google
    if (error instanceof HTTPError && error.is4xx()) {
      console.log(`Azure chunked translation failed with 4xx error (${error.status}), propagating for fallback...`);
      throw error;
    }
    
    console.log('Azure single-shot failed, falling back to chunking...');
    
    // Simple chunking - split by sentences and translate individually
    const sentences = text.split(/([.!?।॥]\s*)/);
    const translatedSentences: string[] = [];
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (!sentence) {
        translatedSentences.push('');
        continue;
      }
      
      try {
        const translated = await translateWithAzure(sentence, from, to, config);
        translatedSentences.push(translated);
        
        // Small delay to respect rate limits
        if (i < sentences.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (chunkError) {
        console.error(`Error translating sentence ${i + 1}:`, chunkError);
        
        // If it's a 4xx error, stop chunking and propagate for fallback
        if (chunkError instanceof HTTPError && chunkError.is4xx()) {
          console.log(`Azure chunk failed with 4xx error (${chunkError.status}), stopping chunking and propagating for fallback...`);
          throw chunkError;
        }
        
        // For other errors, keep original text for that chunk and continue
        translatedSentences.push(sentence);
      }
    }
    
    return translatedSentences.join(' ');
  }
};

// Azure Translate Provider implementation
export class AzureTranslateProvider implements TranslationProvider {
  name = 'Microsoft Azure Translate';
  private config: AzureTranslateConfig;

  constructor(config: AzureTranslateConfig = defaultConfig) {
    this.config = config;
  }

  async translate(text: string, from: string, to: string): Promise<string> {
    return await translateWithAzure(text, from, to, this.config);
  }

  async translateChunked(text: string, from: string, to: string): Promise<string> {
    return await translateWithAzureChunked(text, from, to, this.config);
  }

  // Method to update configuration
  updateConfig(newConfig: Partial<AzureTranslateConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Method to check if Azure is properly configured
  isConfigured(): boolean {
    return !!this.config.subscriptionKey;
  }
}

// Export instance
export const azureTranslateProvider = new AzureTranslateProvider(); 