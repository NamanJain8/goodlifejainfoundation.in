// Google Analytics utility functions
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = [];
}

// Function to track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
  }
};

// Function to track page views
export const trackPageView = (pageName: string, pagePath?: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_title: pageName,
      page_location: pagePath || window.location.href,
      page_path: pagePath || window.location.pathname
    });
  }
};

// Specific tracking functions for the Brahmi Editor
export const trackTranslation = (fromLanguage: string, toLanguage: string, textLength: number) => {
  trackEvent('translation', {
    from_language: fromLanguage,
    to_language: toLanguage,
    text_length: textLength,
    event_category: 'translation',
    event_label: `${fromLanguage}_to_${toLanguage}`
  });
};

export const trackCopyTranslation = (language: string, textLength: number) => {
  trackEvent('copy_translation', {
    language: language,
    text_length: textLength,
    event_category: 'translation',
    event_label: `copy_${language}`
  });
};

export const trackDownload = (format: 'pdf' | 'image', textLength: number) => {
  trackEvent('download', {
    format: format,
    text_length: textLength,
    event_category: 'download',
    event_label: `download_${format}`
  });
};

export const trackToolbarAction = (action: string, tool?: string) => {
  trackEvent('toolbar_action', {
    action: action,
    tool: tool,
    event_category: 'editor',
    event_label: action
  });
};

export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', {
    section: sectionName,
    event_category: 'navigation',
    event_label: sectionName
  });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
    event_category: 'interaction',
    event_label: `${buttonName}_${location}`
  });
};

export const trackLanguageToggle = (language: string) => {
  trackEvent('language_toggle', {
    language: language,
    event_category: 'translation',
    event_label: `toggle_${language}`
  });
};
