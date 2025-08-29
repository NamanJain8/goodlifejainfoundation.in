// Translation Service Manager - handles multiple translation providers with fallback

import { TranslationProvider } from './googleTranslate';
import { googleTranslateProvider } from './googleTranslate';

export type ProviderName = 'google';

export interface TranslationServiceConfig {
  primaryProvider: ProviderName;
  fallbackProvider?: ProviderName;
  enableFallback: boolean;
}

// Default configuration
const defaultConfig: TranslationServiceConfig = {
  primaryProvider: 'google',
  fallbackProvider: undefined,
  enableFallback: false
};

export class TranslationService {
  private providers: Map<ProviderName, TranslationProvider>;
  private config: TranslationServiceConfig;

  constructor(config: TranslationServiceConfig = defaultConfig) {
    this.config = config;
    this.providers = new Map();
    
    // Register available providers
    this.providers.set('google', googleTranslateProvider);
  }

  // Get provider by name
  private getProvider(name: ProviderName): TranslationProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Translation provider '${name}' not found`);
    }
    return provider;
  }

  // Check if a provider is available/configured
  private isProviderAvailable(name: ProviderName): boolean {
    try {
      this.getProvider(name);
      
      // Google provider is always available (no API key required for basic usage)
      return true;
    } catch {
      return false;
    }
  }

  // Translate using primary provider with optional fallback
  async translate(text: string, from: string, to: string): Promise<string> {
    if (!text.trim()) {
      return '';
    }

    const primaryProvider = this.getProvider(this.config.primaryProvider);
    
    try {
      console.log(`Translating with ${primaryProvider.name}...`);
      const result = await primaryProvider.translateChunked(text, from, to);
      console.log(`Translation successful with ${primaryProvider.name}`);
      return result;
    } catch (error) {
      console.error(`${primaryProvider.name} translation failed:`, error);
      
      // No fallback provider configured, just re-throw the error
      console.log('No fallback provider configured, re-throwing error');
      
      // Re-throw original error if no fallback
      throw error;
    }
  }

  // Determine if we should fallback based on the error type
  private shouldFallbackOnError(error: any): boolean {
    // No fallback logic needed since we only have Google Translate
    return false;
  }

  // Translate with specific provider (bypass fallback)
  async translateWithProvider(
    text: string, 
    from: string, 
    to: string, 
    providerName: ProviderName
  ): Promise<string> {
    if (!text.trim()) {
      return '';
    }

    const provider = this.getProvider(providerName);
    return await provider.translateChunked(text, from, to);
  }

  // Get list of available providers
  getAvailableProviders(): Array<{ name: ProviderName; displayName: string; available: boolean }> {
    return Array.from(this.providers.entries()).map(([name, provider]) => ({
      name,
      displayName: provider.name,
      available: this.isProviderAvailable(name)
    }));
  }

  // Update configuration
  updateConfig(newConfig: Partial<TranslationServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): TranslationServiceConfig {
    return { ...this.config };
  }

  // Switch primary provider
  setPrimaryProvider(providerName: ProviderName): void {
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider '${providerName}' not available`);
    }
    this.config.primaryProvider = providerName;
  }

  // Enable/disable fallback
  setFallbackEnabled(enabled: boolean): void {
    this.config.enableFallback = enabled;
  }

  // Get provider statistics/info
  getProviderInfo(): string {
    const primary = this.getProvider(this.config.primaryProvider);
    const fallback = this.config.fallbackProvider ? this.getProvider(this.config.fallbackProvider) : null;
    
    let info = `Primary: ${primary.name}`;
    if (fallback && this.config.enableFallback) {
      info += `, Fallback: ${fallback.name}`;
    }
    
    return info;
  }
}

// Create and export singleton instance
export const translationService = new TranslationService();

// Export convenient functions for backward compatibility
export const translateText = async (
  inputText: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  return await translationService.translate(inputText, sourceLanguage, targetLanguage);
}; 