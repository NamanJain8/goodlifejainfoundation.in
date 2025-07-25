// Translation Service Manager - handles multiple translation providers with fallback

import { TranslationProvider } from './googleTranslate';
import { googleTranslateProvider } from './googleTranslate';
import { azureTranslateProvider, HTTPError } from './azureTranslate';

export type ProviderName = 'google' | 'azure';

export interface TranslationServiceConfig {
  primaryProvider: ProviderName;
  fallbackProvider?: ProviderName;
  enableFallback: boolean;
}

// Default configuration
const defaultConfig: TranslationServiceConfig = {
  primaryProvider: 'azure',
  fallbackProvider: 'google',
  enableFallback: true
};

export class TranslationService {
  private providers: Map<ProviderName, TranslationProvider>;
  private config: TranslationServiceConfig;

  constructor(config: TranslationServiceConfig = defaultConfig) {
    this.config = config;
    this.providers = new Map();
    
    // Register available providers
    this.providers.set('google', googleTranslateProvider);
    this.providers.set('azure', azureTranslateProvider);
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
      const provider = this.getProvider(name);
      
      // Special check for Azure to see if it's configured
      if (name === 'azure' && 'isConfigured' in provider) {
        return (provider as any).isConfigured();
      }
      
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
      
      // Only try fallback for 4xx errors when using Azure as primary provider
      const shouldFallback = this.shouldFallbackOnError(error);
      
      if (shouldFallback && this.config.enableFallback && this.config.fallbackProvider) {
        const fallbackProvider = this.getProvider(this.config.fallbackProvider);
        
        if (this.isProviderAvailable(this.config.fallbackProvider)) {
          try {
            console.log(`Falling back to ${fallbackProvider.name} due to 4xx error...`);
            const result = await fallbackProvider.translateChunked(text, from, to);
            console.log(`Translation successful with fallback ${fallbackProvider.name}`);
            return result;
          } catch (fallbackError) {
            console.error(`${fallbackProvider.name} fallback also failed:`, fallbackError);
            throw new Error(`Both ${primaryProvider.name} and ${fallbackProvider.name} translation failed`);
          }
        }
      }
      
      // Re-throw original error if no fallback
      throw error;
    }
  }

  // Determine if we should fallback based on the error type
  private shouldFallbackOnError(error: any): boolean {
    // Only fallback on 4xx errors from Azure
    if (error instanceof HTTPError && error.is4xx()) {
      console.log(`4xx error detected (${error.status}), enabling fallback to Google Translate`);
      return true;
    }
    
    // For other errors (network issues, 5xx errors, etc.), don't fallback
    console.log(`Non-4xx error detected, not falling back:`, error.message);
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