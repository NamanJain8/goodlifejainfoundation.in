import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Copy, Volume2, ClipboardPaste } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { translateText } from '../../utils/translator';

const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<string>('hi');
  const [targetLanguage, setTargetLanguage] = useState<string>('brahmi');
  const [isTranslating, setIsTranslating] = useState(false);

  // Language options
  const languages: { [key: string]: { name: string } } = {
    en: { name: 'English' },
    hi: { name: 'हिंदी' },
    sa: { name: 'संस्कृत' },
    gu: { name: 'ગુજરાતી' },
    bn: { name: 'বাংলা' },
    ta: { name: 'தமிழ்' },
    te: { name: 'తెలుగు' },
    ml: { name: 'മലയാളം' },
    kn: { name: 'ಕನ್ನಡ' },
    or: { name: 'ଓଡ଼ିଆ' },
    pa: { name: 'ਪੰਜਾਬੀ' },
    mr: { name: 'मराठी' },
    ur: { name: 'اردو' },
    ne: { name: 'नेपाली' },
    si: { name: 'සිංහල' },
    brahmi: { name: 'Brahmi Lipi (𑀩𑁆𑀭𑀳𑁆𑀫𑀻)' }
  };



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
    if ('speechSynthesis' in window && text && language !== 'brahmi') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 
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
                      'hi-IN';
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
        return 'inherit';
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
          <div className="flex items-center justify-between p-6 border-b border-surface-100">
            <div className="flex-1">
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="bg-surface-100 border border-surface-200 rounded-lg px-4 py-3 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer min-w-[200px]"
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
              className="mx-6"
            >
              <ArrowLeftRight size={20} />
            </Button>

            <div className="flex-1 flex justify-end">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-surface-100 border border-surface-200 rounded-lg px-4 py-3 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer min-w-[200px]"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key} className="bg-surface-200">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Translation Areas - Horizontal Layout */}
          <div className="flex">
            {/* Input Section */}
            <div className="flex-1 relative border-r border-surface-100">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type in ${languages[sourceLanguage].name}...`}
                className="w-full h-80 p-6 bg-transparent text-white text-lg resize-none focus:outline-none placeholder-gray-500"
                style={{ 
                  fontFamily: getFontFamily(sourceLanguage)
                }}
              />
              
              {/* Input Actions */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePaste}
                    className="text-gray-400 hover:text-white"
                  >
                    <ClipboardPaste size={16} />
                    <span className="hidden sm:inline ml-1">PASTE</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(inputText, sourceLanguage)}
                    disabled={!inputText}
                    className="text-gray-400 hover:text-white"
                  >
                    <Volume2 size={16} />
                    <span className="hidden sm:inline ml-1">SPEAK</span>
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500">
                  {inputText.length} / 5000
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 relative">
              <div className="w-full h-80 p-6 overflow-auto">
                <div 
                  className={`text-lg leading-relaxed min-h-full ${
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
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!outputText}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline ml-1">COPY</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(outputText, targetLanguage)}
                    disabled={!outputText}
                    className="text-gray-400 hover:text-white"
                  >
                    <Volume2 size={16} />
                    <span className="hidden sm:inline ml-1">SPEAK</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Section>
  );
};

export default Translator; 