# Translation Providers Module

This module provides a translation system using Google Translate API for text translation.

## Architecture

### Files Structure
```
src/utils/translationProviders/
├── googleTranslate.ts       # Google Translate API provider
├── translationService.ts    # Main service manager
└── README.md               # This documentation
```

## Providers

### 1. Google Translate Provider (`googleTranslate.ts`)
- **Free to use** - No API key required
- **Chunking support** - Handles long texts automatically
- **Rate limiting** - Built-in delays to prevent blocking
- **Error handling** - Graceful error recovery

## Usage

### Basic Usage (Recommended)
```typescript
import { translateText } from '../translator';

// Uses Google Translate service
const result = await translateText('Hello World', 'en', 'hi');
```

### Advanced Usage
```typescript
import { translationService } from './translationProviders/translationService';

// Check available providers
const providers = translationService.getAvailableProviders();
console.log(providers);
// Output: [
//   { name: 'google', displayName: 'Google Translate', available: true }
// ]

// Translate with specific provider
const result = await translationService.translateWithProvider(
  'Hello World', 
  'en', 
  'hi', 
  'google'
);

// Get provider info
console.log(translationService.getProviderInfo());
// Output: "Primary: Google Translate"
```

### Configuration Management
```typescript
import { translationService } from './translationProviders/translationService';

// Update configuration
translationService.updateConfig({
  primaryProvider: 'google',
  enableFallback: false
});

// Get current configuration
const config = translationService.getConfig();
```

## Default Behavior

1. **Primary Provider**: Google Translate (always available)
2. **Fallback Provider**: None
3. **Fallback Enabled**: No
4. **Error Handling**: Direct error propagation

## Brahmi Script Support

The translation service integrates seamlessly with Brahmi script conversion:

```typescript
// English → Hindi → Brahmi
const brahmiText = await translateText('Hello World', 'en', 'brahmi');

// Brahmi → Hindi → English
const englishText = await translateText(brahmiText, 'brahmi', 'en');
```

## Benefits of Modular Approach

1. **Separation of Concerns**: Provider is isolated and testable
2. **Easy Extension**: Add new providers without changing existing code
3. **Reliability**: Simple, focused translation service
4. **Configuration Flexibility**: Different settings for different use cases

## Error Handling

The system provides comprehensive error handling:

```typescript
try {
  const result = await translateText('Hello', 'en', 'hi');
} catch (error) {
  console.error('Translation failed:', error.message);
  // Possible errors:
  // - Network errors
  // - API rate limiting
  // - Invalid language codes
}
```

## Performance Considerations

- **Google**: Fast for short texts, chunking for long texts
- **Rate Limiting**: Built-in delays to prevent API blocking
- **Caching**: Consider implementing caching layer for repeated translations 