import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Copy, Volume2, ClipboardPaste, Keyboard } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { translateText } from '../../utils/translator';

// Extend Window interface to include keyman
declare global {
  interface Window {
    keyman?: any;
  }
}

const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<string>('en');
  const [targetLanguage, setTargetLanguage] = useState<string>('brahmi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Language options with Keyman keyboard mappings
  const languages: { [key: string]: { name: string; keyboardId: string } } = {
    en: { name: 'English', keyboardId: 'en' },
    hi: { name: 'हिंदी', keyboardId: 'hi' },
    sa: { name: 'संस्कृत', keyboardId: 'sa-deva' },
    gu: { name: 'ગુજરાતી', keyboardId: 'gu' },
    bn: { name: 'বাংলা', keyboardId: 'bn' },
    ta: { name: 'தமிழ்', keyboardId: 'ta' },
    te: { name: 'తెలుగు', keyboardId: 'te' },
    ml: { name: 'മലയാളം', keyboardId: 'ml' },
    kn: { name: 'ಕನ್ನಡ', keyboardId: 'kn' },
    or: { name: 'ଓଡ଼ିଆ', keyboardId: 'or' },
    pa: { name: 'ਪੰਜਾਬੀ', keyboardId: 'pa' },
    mr: { name: 'मराठी', keyboardId: 'mr' },
    ur: { name: 'اردو', keyboardId: 'ur' },
    ne: { name: 'नेपाली', keyboardId: 'ne' },
    si: { name: 'සිංහල', keyboardId: 'si' },
    brahmi: { name: 'Brahmi Lipi (𑀩𑁆𑀭𑀳𑁆𑀫𑀻)', keyboardId: 'sa-brah' }
  };

  // Keyman integration functions
  const attachKeymanKeyboard = useCallback(async (language: string) => {
    if (!window.keyman || !textareaRef.current) return;
    
    try {
      const keyboardId = languages[language]?.keyboardId || 'en';
      
      // Wait for keyboards to be loaded with better error handling
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        const checkKeyboards = () => {
          attempts++;
          
          try {
            // Check if keyman and getKeyboards are available
            if (!window.keyman || typeof window.keyman.getKeyboards !== 'function') {
              if (attempts >= maxAttempts) {
                reject(new Error('Keyman not properly initialized'));
                return;
              }
              setTimeout(checkKeyboards, 100);
              return;
            }
            
            const keyboards = window.keyman.getKeyboards();
            if (keyboards && keyboards.length > 0) {
              resolve();
            } else {
              if (attempts >= maxAttempts) {
                reject(new Error('No keyboards available after maximum wait time'));
                return;
              }
              setTimeout(checkKeyboards, 100);
            }
          } catch (error) {
            console.warn('Error checking keyboards:', error);
            if (attempts >= maxAttempts) {
              reject(error);
              return;
            }
            setTimeout(checkKeyboards, 100);
          }
        };
        
        checkKeyboards();
      });
      
      // Extract the specific keyboard to use  
      const availableKeyboards = window.keyman.getKeyboards();
      const keyboardToUse = availableKeyboards.find((kb: any) => kb.LanguageCode === keyboardId);
      
      console.log('Available keyboards:', availableKeyboards);
      console.log('Looking for keyboard with language code:', keyboardId);
      console.log('Found keyboard:', keyboardToUse);
      
      if (!keyboardToUse) {
        console.warn(`Keyboard ${keyboardId} not found. Available keyboards:`, 
          availableKeyboards.map((kb: any) => `${kb.Name || kb.name} (${kb.LanguageCode})`));
        return;
      }
      
      // Attach keyboard to the control
      window.keyman.attachToControl(textareaRef.current);
      window.keyman.setActiveKeyboard(keyboardToUse.InternalName, keyboardToUse.LanguageCode);
      
      // Show the virtual keyboard if container exists
      const keyboardContainer = document.getElementById('KeymanWebControl');
      if (keyboardContainer && window.keyman.osk) {
        // Enable and show the On-Screen Keyboard
        window.keyman.osk.show(true);
        window.keyman.osk.userPositioned = true; // Allow Keyman to position it
      }
      
      setKeyboardEnabled(true);
    } catch (error) {
      console.error('Failed to attach Keyman keyboard:', error);
      setKeyboardEnabled(false);
    }
  }, [languages]);

  // Effect to handle keyboard switching when source language changes
  useEffect(() => {
    if (keyboardEnabled && textareaRef.current && window.keyman) {
      attachKeymanKeyboard(sourceLanguage).catch(console.error);
    }
  }, [sourceLanguage, keyboardEnabled, attachKeymanKeyboard]);

  // Live translation effect
  useEffect(() => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    const performTranslation = async () => {
      setIsTranslating(true);
      
      try {
        const translated = await translateText(inputText, sourceLanguage, targetLanguage);
        setOutputText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setOutputText('Translation failed');
      } finally {
        setIsTranslating(false);
      }
    };

    const debounceTimer = setTimeout(performTranslation, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputText, sourceLanguage, targetLanguage]);

  const handleSwapLanguages = () => {
    const newSource = targetLanguage;
    const newTarget = sourceLanguage;
    
    setSourceLanguage(newSource);
    setTargetLanguage(newTarget);
    setInputText(outputText);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSpeak = (text: string, language: string) => {
    if ('speechSynthesis' in window && text) {
      let textToSpeak = text;
      let langCode = 'hi-IN'; // Default fallback
      
      // For Brahmi, use the source language to speak the original input text
      if (language === 'brahmi') {
        textToSpeak = inputText; // Speak the original input instead of Brahmi output
        langCode = sourceLanguage === 'hi' ? 'hi-IN' : 
                   sourceLanguage === 'en' ? 'en-US' :
                   sourceLanguage === 'gu' ? 'gu-IN' :
                   sourceLanguage === 'bn' ? 'bn-IN' :
                   sourceLanguage === 'ta' ? 'ta-IN' :
                   sourceLanguage === 'te' ? 'te-IN' :
                   sourceLanguage === 'ml' ? 'ml-IN' :
                   sourceLanguage === 'kn' ? 'kn-IN' :
                   sourceLanguage === 'pa' ? 'pa-IN' :
                   sourceLanguage === 'mr' ? 'mr-IN' :
                   sourceLanguage === 'ur' ? 'ur-PK' :
                   sourceLanguage === 'ne' ? 'ne-NP' :
                   sourceLanguage === 'si' ? 'si-LK' :
                   sourceLanguage === 'sa' ? 'hi-IN' : // Sanskrit fallback to Hindi
                   'hi-IN';
      } else {
        langCode = language === 'hi' ? 'hi-IN' : 
                   language === 'en' ? 'en-US' :
                   language === 'gu' ? 'gu-IN' :
                   language === 'bn' ? 'bn-IN' :
                   language === 'ta' ? 'ta-IN' :
                   language === 'te' ? 'te-IN' :
                   language === 'ml' ? 'ml-IN' :
                   language === 'kn' ? 'kn-IN' :
                   language === 'pa' ? 'pa-IN' :
                   language === 'mr' ? 'mr-IN' :
                   language === 'ur' ? 'ur-PK' :
                   language === 'ne' ? 'ne-NP' :
                   language === 'si' ? 'si-LK' :
                   language === 'sa' ? 'hi-IN' : // Sanskrit fallback to Hindi
                   'hi-IN';
      }
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      speechSynthesis.speak(utterance);
    }
  };

  const getFontFamily = (language: string) => {
    switch (language) {
      case 'hi':
      case 'sa':
      case 'mr':
      case 'ne':
        return 'Noto Sans Devanagari, serif';
      case 'gu':
        return 'Noto Sans Gujarati, serif';
      case 'bn':
        return 'Noto Sans Bengali, serif';
      case 'ta':
        return 'Noto Sans Tamil, serif';
      case 'te':
        return 'Noto Sans Telugu, serif';
      case 'ml':
        return 'Noto Sans Malayalam, serif';
      case 'kn':
        return 'Noto Sans Kannada, serif';
      case 'or':
        return 'Noto Sans Oriya, serif';
      case 'pa':
        return 'Noto Sans Gurmukhi, serif';
      case 'ur':
        return 'Noto Sans Arabic, serif';
      case 'si':
        return 'Noto Sans Sinhala, serif';
      case 'brahmi':
        return 'Noto Sans Brahmi, serif';
      default:
        return 'inherit';
    }
  };

  return (
    <Section id="translator">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="section-subtitle">Live Translation</p>
        <h2 className="section-title">
          <span className="gradient-text">Brahmi Script</span> Translator
        </h2>
        <p className="section-description">
          Transform your text into the ancient Brahmi script instantly with live translation. 
          Experience real-time conversion as you type.
        </p>
      </motion.div>

      {/* Translator Interface */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="overflow-hidden">
          {/* Language Selector Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-surface-100 gap-4 sm:gap-0">
            <div className="w-full sm:flex-1">
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full sm:min-w-[200px] bg-surface-100 border border-surface-200 rounded-lg px-4 py-3 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key} className="bg-surface-200">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapLanguages}
              className="mx-0 sm:mx-6 my-2 sm:my-0"
            >
              <ArrowLeftRight size={20} />
            </Button>

            <div className="w-full sm:flex-1 flex justify-start sm:justify-end">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full sm:min-w-[200px] bg-surface-100 border border-surface-200 rounded-lg px-4 py-3 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key} className="bg-surface-200">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Translation Areas - Responsive Layout */}
          <div className="flex flex-col lg:flex-row">
            {/* Input Section */}
            <div className="flex-1 relative lg:border-r border-surface-100">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={async () => {
                  // Automatically attach keyboard when input area is focused
                  if (window.keyman && textareaRef.current) {
                    await attachKeymanKeyboard(sourceLanguage);
                  }
                }}
                placeholder={`Type in ${languages[sourceLanguage].name}...`}
                className="w-full h-64 sm:h-80 p-4 sm:p-6 bg-transparent text-white text-base sm:text-lg resize-none focus:outline-none placeholder-gray-500"
                style={{ 
                  fontFamily: getFontFamily(sourceLanguage)
                }}
              />
              
              {/* Input Actions */}
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePaste}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm"
                  >
                    <ClipboardPaste size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1">PASTE</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(inputText, sourceLanguage)}
                    disabled={!inputText}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm"
                  >
                    <Volume2 size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1">SPEAK</span>
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500">
                  <span className="hidden sm:inline">{inputText.length} / 5000</span>
                  <span className="sm:hidden">{inputText.length}</span>
                </div>
              </div>
            </div>

            {/* Mobile Divider */}
            <div className="lg:hidden border-t border-surface-100"></div>

            {/* Output Section */}
            <div className="flex-1 relative">
              <div className="w-full h-64 sm:h-80 p-4 sm:p-6 overflow-auto">
                <div 
                  className={`text-base sm:text-lg leading-relaxed min-h-full ${
                    targetLanguage === 'brahmi' ? 'font-brahmi text-primary-400' : 'text-white'
                  }`}
                  style={{ 
                    fontFamily: targetLanguage === 'brahmi' ? 'inherit' : getFontFamily(targetLanguage)
                  }}
                >
                  {isTranslating ? (
                    <span className="text-gray-500">Translating...</span>
                  ) : outputText || (
                    <span className="text-gray-500">Translation will appear here...</span>
                  )}
                </div>
              </div>
              
              {/* Output Actions */}
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!outputText}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm"
                  >
                    <Copy size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1">COPY</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(outputText, targetLanguage)}
                    disabled={!outputText}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm"
                  >
                    <Volume2 size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1">SPEAK</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Virtual Keyboard Container */}
          {keyboardEnabled && (
            <div className="border-t border-surface-100">
              <div className="p-4">
                <div className="text-sm text-gray-400 mb-2">
                  Virtual Keyboard - {languages[sourceLanguage].name}
                </div>
                <div 
                  id="KeymanWebControl" 
                  className="bg-surface-50 rounded-lg p-2 min-h-[200px] border border-surface-200"
                  style={{ 
                    fontFamily: getFontFamily(sourceLanguage)
                  }}
                ></div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </Section>
  );
};

export default Translator; 