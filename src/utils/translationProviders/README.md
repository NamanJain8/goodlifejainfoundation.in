# Translation Providers Module

This module provides a modular translation system that supports multiple translation providers with fallback mechanisms.

## Architecture

### Files Structure
```
src/utils/translationProviders/
├── googleTranslate.ts       # Google Translate API provider
├── azureTranslate.ts        # Microsoft Azure Translate API provider
├── translationService.ts    # Main service manager
└── README.md               # This documentation
```

## Providers

### 1. Google Translate Provider (`googleTranslate.ts`)
- **Free to use** - No API key required
- **Chunking support** - Handles long texts automatically
- **Rate limiting** - Built-in delays to prevent blocking
- **Fallback handling** - Graceful error recovery

### 2. Azure Translate Provider (`azureTranslate.ts`)
- **Requires API key** - Set `REACT_APP_AZURE_TRANSLATE_KEY` environment variable
- **Single-shot translation** - Better for longer texts
- **High accuracy** - Professional-grade translation service
- **Configurable endpoint** - Custom Azure endpoints supported

## Configuration

### Environment Variables
```bash
# Required for Azure Translate
REACT_APP_AZURE_TRANSLATE_KEY=your_azure_key_here

# Optional - defaults to Microsoft's global endpoint
REACT_APP_AZURE_TRANSLATE_ENDPOINT=https://api.cognitive.microsofttranslator.com
REACT_APP_AZURE_TRANSLATE_REGION=global
```

## Usage

### Basic Usage (Recommended)
```typescript
import { translateText } from '../translator';

// Uses the configured translation service with automatic fallback
const result = await translateText('Hello World', 'en', 'hi');
```

### Advanced Usage
```typescript
import { translationService } from './translationProviders/translationService';

// Check available providers
const providers = translationService.getAvailableProviders();
console.log(providers);
// Output: [
//   { name: 'google', displayName: 'Google Translate', available: true },
//   { name: 'azure', displayName: 'Microsoft Azure Translate', available: false }
// ]

// Switch primary provider
translationService.setPrimaryProvider('azure');

// Translate with specific provider
const result = await translationService.translateWithProvider(
  'Hello World', 
  'en', 
  'hi', 
  'google'
);

// Get provider info
console.log(translationService.getProviderInfo());
// Output: "Primary: Microsoft Azure Translate, Fallback: Google Translate"
```

### Configuration Management
```typescript
import { translationService } from './translationProviders/translationService';

// Update configuration
translationService.updateConfig({
  primaryProvider: 'azure',
  fallbackProvider: 'google',
  enableFallback: true
});

// Disable fallback
translationService.setFallbackEnabled(false);

// Get current configuration
const config = translationService.getConfig();
```

## Default Behavior

1. **Primary Provider**: Google Translate (always available)
2. **Fallback Provider**: Azure Translate (if configured)
3. **Fallback Enabled**: Yes
4. **Error Handling**: Automatic fallback on primary provider failure

## Provider Selection Logic

1. **Google First**: Default configuration uses Google as primary
2. **Azure Fallback**: If Google fails and Azure is configured, switches to Azure
3. **Smart Detection**: Azure is only used if properly configured with API key
4. **Error Recovery**: Both providers failed = throw error with details

## Brahmi Script Support

The translation service integrates seamlessly with Brahmi script conversion:

```typescript
// English → Hindi → Brahmi
const brahmiText = await translateText('Hello World', 'en', 'brahmi');

// Brahmi → Hindi → English
const englishText = await translateText(brahmiText, 'brahmi', 'en');
```

## Benefits of Modular Approach

1. **Separation of Concerns**: Each provider is isolated and testable
2. **Easy Extension**: Add new providers without changing existing code
3. **Fallback Reliability**: Service continues working if one provider fails
4. **Provider Switching**: Change providers at runtime based on requirements
5. **Configuration Flexibility**: Different settings for different use cases

## Error Handling

The system provides comprehensive error handling:

```typescript
try {
  const result = await translateText('Hello', 'en', 'hi');
} catch (error) {
  console.error('Translation failed:', error.message);
  // Possible errors:
  // - "Both Google Translate and Microsoft Azure Translate translation failed"
  // - "Azure Translate subscription key is required"
  // - Network errors, etc.
}
```

## Performance Considerations

- **Google**: Faster for short texts, chunking for long texts
- **Azure**: Better for long texts, single API call
- **Fallback**: Adds latency only when primary provider fails
- **Caching**: Consider implementing caching layer for repeated translations 