import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Languages, Copy, Download, RefreshCw, Volume2 } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { brahmiMapping, englishToBrahmi } from '../../utils/data';

const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputLanguage, setInputLanguage] = useState<'hi' | 'en'>('hi');
  const [isTranslating, setIsTranslating] = useState(false);

  const translateToBrahmi = useCallback((text: string, language: 'hi' | 'en') => {
    if (!text.trim()) return '';

    let result = '';
    const mapping = language === 'hi' ? brahmiMapping : englishToBrahmi;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (language === 'en') {
        // For English, try to match longer sequences first
        let matched = false;
        for (let len = 3; len >= 1; len--) {
          const substr = text.substr(i, len).toLowerCase();
          if (mapping[substr]) {
            result += mapping[substr];
            i += len - 1;
            matched = true;
            break;
          }
        }
        if (!matched) {
          result += char;
        }
      } else {
        // For Hindi, direct character mapping
        result += mapping[char] || char;
      }
    }

    return result;
  }, []);

  const handleTranslate = useCallback(() => {
    setIsTranslating(true);
    
    // Simulate translation delay for better UX
    setTimeout(() => {
      const translated = translateToBrahmi(inputText, inputLanguage);
      setOutputText(translated);
      setIsTranslating(false);
    }, 500);
  }, [inputText, inputLanguage, translateToBrahmi]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'brahmi-translation.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && inputText) {
      const utterance = new SpeechSynthesisUtterance(inputText);
      utterance.lang = inputLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
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
          Transform your Hindi or English text into the ancient Brahmi script instantly. 
          Experience the beauty of this sacred writing system that gave birth to countless scripts.
        </p>
      </motion.div>

      {/* Translator Interface */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-400">Input Text</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={inputLanguage}
                    onChange={(e) => setInputLanguage(e.target.value as 'hi' | 'en')}
                    className="bg-surface-100 border border-surface-200 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="hi">Hindi</option>
                    <option value="en">English</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSpeak}
                    disabled={!inputText}
                  >
                    <Volume2 size={16} />
                  </Button>
                </div>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type your ${inputLanguage === 'hi' ? 'Hindi' : 'English'} text here...`}
                className="w-full h-40 bg-surface-100 border border-surface-200 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  className="flex-1"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Translating...</span>
                    </>
                  ) : (
                    <>
                      <Languages size={16} />
                      <span>Translate</span>
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={!inputText && !outputText}
                >
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-400">Brahmi Script</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">𑀩𑁆𑀭𑀸𑀳𑁆𑀫𑀻</span>
                </div>
              </div>
              
              <div className="w-full h-40 bg-surface-100 border border-surface-200 rounded-lg p-4 overflow-auto">
                <div className="text-white font-brahmi text-lg leading-relaxed min-h-full">
                  {outputText || (
                    <span className="text-gray-500">
                      Your Brahmi translation will appear here...
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="flex-1"
                >
                  <Copy size={16} />
                  <span>Copy</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!outputText}
                  className="flex-1"
                >
                  <Download size={16} />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sample Translations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16"
      >
        <h3 className="text-xl font-serif font-semibold text-center mb-8">
          Sample Translations
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { english: 'Namaste', hindi: 'नमस्कार', brahmi: '𑀦𑀫𑀲𑁆𑀓𑀸𑀭' },
            { english: 'Jai Jinendra', hindi: 'जय जिनेन्द्र', brahmi: '𑀚𑀬 𑀚𑀺𑀦𑁂𑀦𑁆𑀤𑁆𑀭' },
            { english: 'Ahimsa', hindi: 'अहिंसा', brahmi: '𑀅𑀳𑀺𑀁𑀲𑀸' },
            { english: 'Dharma', hindi: 'धर्म', brahmi: '𑀥𑀭𑁆𑀫' },
            { english: 'Peace', hindi: 'शांति', brahmi: '𑀰𑀸𑀁𑀢𑀺' },
            { english: 'Liberation', hindi: 'मोक्ष', brahmi: '𑀫𑁄𑀓𑁆𑀱' },
            { english: 'Tirthankara', hindi: 'तीर्थंकर', brahmi: '𑀢𑀻𑀭𑁆𑀣𑀁𑀓𑀭' },
            { english: 'Adinath', hindi: 'आदिनाथ', brahmi: '𑀆𑀤𑀺𑀦𑀸𑀣' },
            { english: 'Brahmi', hindi: 'ब्राह्मी', brahmi: '𑀩𑁆𑀭𑀸𑀳𑁆𑀫𑀻' },
          ].map((sample, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface-200 rounded-lg p-6 border border-surface-100"
            >
              <div className="space-y-3">
                <div className="text-white font-medium">{sample.english}</div>
                <div className="text-white font-medium" style={{ fontFamily: 'Noto Sans Devanagari, serif' }}>{sample.hindi}</div>
                <div className="text-primary-400 font-brahmi text-lg">{sample.brahmi}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

export default Translator; 