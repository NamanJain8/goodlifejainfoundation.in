import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Copy, Volume2, ClipboardPaste } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';

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

  // Google Translate API call
  const translateWithGoogle = async (text: string, from: string, to: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      return data[0][0][0] || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // Comprehensive Brahmi translation functions
  const devanagariToBrahmi = useCallback((text: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const codePoint = text.codePointAt(i);
      if (!codePoint) continue;

      if (codePoint === 0x20) {
        result += ' '; // Keep spaces as spaces
        continue;
      }

      switch (codePoint) {
        case 0x902: result += String.fromCodePoint(0x11001); break;
        case 0x905: result += String.fromCodePoint(0x11005); break; // A
        case 0x906: result += String.fromCodePoint(0x11006); break; // AA
        case 0x907: result += String.fromCodePoint(0x11007); break; // I
        case 0x908: result += String.fromCodePoint(0x11008); break; // II
        case 0x909: result += String.fromCodePoint(0x11009); break; // U
        case 0x90a: result += String.fromCodePoint(0x1100A); break; // UU
        case 0x90b: result += String.fromCodePoint(0x1100B); break; // Vocalic R
        case 0x90c: result += String.fromCodePoint(0x1100D); break; // Vocalic L
        case 0x90f: result += String.fromCodePoint(0x1100F); break; // E
        case 0x910: result += String.fromCodePoint(0x11010); break; // AI
        case 0x913: result += String.fromCodePoint(0x11011); break; // O
        case 0x914: result += String.fromCodePoint(0x11012); break; // AU
        case 0x915: result += String.fromCodePoint(0x11013); break; // KA
        case 0x916: result += String.fromCodePoint(0x11014); break; // KHA
        case 0x917: result += String.fromCodePoint(0x11015); break; // GA
        case 0x918: result += String.fromCodePoint(0x11016); break; // GHA
        case 0x919: result += String.fromCodePoint(0x11017); break; // NGA
        case 0x91a: result += String.fromCodePoint(0x11018); break; // CA
        case 0x91b: result += String.fromCodePoint(0x11019); break; // CHA
        case 0x91c: result += String.fromCodePoint(0x1101A); break; // JA
        case 0x91d: result += String.fromCodePoint(0x1101B); break; // JHA
        case 0x91e: result += String.fromCodePoint(0x1101C); break; // NYA
        case 0x91f: result += String.fromCodePoint(0x1101D); break; // TTA
        case 0x920: result += String.fromCodePoint(0x1101E); break; // TTHA
        case 0x921: result += String.fromCodePoint(0x1101F); break; // DDA
        case 0x922: result += String.fromCodePoint(0x11020); break; // DDHA
        case 0x923: result += String.fromCodePoint(0x11021); break; // NNA
        case 0x924: result += String.fromCodePoint(0x11022); break; // TA
        case 0x925: result += String.fromCodePoint(0x11023); break; // THA
        case 0x926: result += String.fromCodePoint(0x11024); break; // DA
        case 0x927: result += String.fromCodePoint(0x11025); break; // DHA
        case 0x928: result += String.fromCodePoint(0x11026); break; // NA
        case 0x92a: result += String.fromCodePoint(0x11027); break; // PA
        case 0x92b: result += String.fromCodePoint(0x11028); break; // PHA
        case 0x92c: result += String.fromCodePoint(0x11029); break; // BA
        case 0x92d: result += String.fromCodePoint(0x1102A); break; // BHA
        case 0x92e: result += String.fromCodePoint(0x1102B); break; // MA
        case 0x92f: result += String.fromCodePoint(0x1102C); break; // YA
        case 0x930: result += String.fromCodePoint(0x1102D); break; // RA
        case 0x932: result += String.fromCodePoint(0x1102E); break; // LA
        case 0x933: result += String.fromCodePoint(0x11034); break; // LLA
        case 0x935: result += String.fromCodePoint(0x1102F); break; // VA
        case 0x936: result += String.fromCodePoint(0x11030); break; // SHA
        case 0x937: result += String.fromCodePoint(0x11031); break; // SSA
        case 0x938: result += String.fromCodePoint(0x11032); break; // SA
        case 0x939: result += String.fromCodePoint(0x11033); break; // HA
        case 0x93e: result += String.fromCodePoint(0x11038); break; // AA
        case 0x93f: result += String.fromCodePoint(0x1103A); break; // I
        case 0x940: result += String.fromCodePoint(0x1103B); break; // II
        case 0x941: result += String.fromCodePoint(0x1103C); break; // U
        case 0x942: result += String.fromCodePoint(0x1103D); break; // UU
        case 0x943: result += String.fromCodePoint(0x1103E); break; // R
        case 0x944: result += String.fromCodePoint(0x1103F); break; // RR
        case 0x962: result += String.fromCodePoint(0x11040); break; // L
        case 0x963: result += String.fromCodePoint(0x11041); break; // LL
        case 0x947: result += String.fromCodePoint(0x11042); break; // E
        case 0x948: result += String.fromCodePoint(0x11043); break; // AI
        case 0x94b: result += String.fromCodePoint(0x11044); break; // O
        case 0x94c: result += String.fromCodePoint(0x11045); break; // AU
        case 0x94d: result += String.fromCodePoint(0x11046); break; // virama
        case 0x964: result += String.fromCodePoint(0x11047); break; // danda
        case 0x965: result += String.fromCodePoint(0x11048); break; // double danda
        case 0x966: result += String.fromCodePoint(0x11066); break; // 0
        case 0x967: result += String.fromCodePoint(0x11067); break; // 1
        case 0x968: result += String.fromCodePoint(0x11068); break; // 2
        case 0x969: result += String.fromCodePoint(0x11069); break; // 3
        case 0x96a: result += String.fromCodePoint(0x1106A); break; // 4
        case 0x96b: result += String.fromCodePoint(0x1106B); break; // 5
        case 0x96c: result += String.fromCodePoint(0x1106C); break; // 6
        case 0x96d: result += String.fromCodePoint(0x1106D); break; // 7
        case 0x96e: result += String.fromCodePoint(0x1106E); break; // 8
        case 0x96f: result += String.fromCodePoint(0x1106F); break; // 9
        default: result += String.fromCodePoint(codePoint); break;
      }
    }
    return result;
  }, []);

  const brahmiToDevanagari = useCallback((text: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const codePoint = text.codePointAt(i);
      if (!codePoint) continue;

      switch (codePoint) {
        case 0x11001: result += String.fromCodePoint(0x902); break;
        case 0x11005: result += String.fromCodePoint(0x905); break; // A
        case 0x11006: result += String.fromCodePoint(0x906); break; // AA
        case 0x11007: result += String.fromCodePoint(0x907); break; // I
        case 0x11008: result += String.fromCodePoint(0x908); break; // II
        case 0x11009: result += String.fromCodePoint(0x909); break; // U
        case 0x1100a: result += String.fromCodePoint(0x90A); break; // UU
        case 0x1100b: result += String.fromCodePoint(0x90B); break; // Vocalic R
        case 0x1100d: result += String.fromCodePoint(0x90C); break; // Vocalic L
        case 0x1100f: result += String.fromCodePoint(0x90F); break; // E
        case 0x11010: result += String.fromCodePoint(0x910); break; // AI
        case 0x11011: result += String.fromCodePoint(0x913); break; // O
        case 0x11012: result += String.fromCodePoint(0x914); break; // AU
        case 0x11013: result += String.fromCodePoint(0x915); break; // KA
        case 0x11014: result += String.fromCodePoint(0x916); break; // KHA
        case 0x11015: result += String.fromCodePoint(0x917); break; // GA
        case 0x11016: result += String.fromCodePoint(0x918); break; // GHA
        case 0x11017: result += String.fromCodePoint(0x919); break; // NGA
        case 0x11018: result += String.fromCodePoint(0x91A); break; // CA
        case 0x11019: result += String.fromCodePoint(0x91B); break; // CHA
        case 0x1101a: result += String.fromCodePoint(0x91C); break; // JA
        case 0x1101b: result += String.fromCodePoint(0x91D); break; // JHA
        case 0x1101c: result += String.fromCodePoint(0x91E); break; // NYA
        case 0x1101d: result += String.fromCodePoint(0x91F); break; // TTA
        case 0x1101e: result += String.fromCodePoint(0x920); break; // TTHA
        case 0x1101f: result += String.fromCodePoint(0x921); break; // DDA
        case 0x11020: result += String.fromCodePoint(0x922); break; // DDHA
        case 0x11021: result += String.fromCodePoint(0x923); break; // NNA
        case 0x11022: result += String.fromCodePoint(0x924); break; // TA
        case 0x11023: result += String.fromCodePoint(0x925); break; // THA
        case 0x11024: result += String.fromCodePoint(0x926); break; // DA
        case 0x11025: result += String.fromCodePoint(0x927); break; // DHA
        case 0x11026: result += String.fromCodePoint(0x928); break; // NA
        case 0x11027: result += String.fromCodePoint(0x92A); break; // PA
        case 0x11028: result += String.fromCodePoint(0x92B); break; // PHA
        case 0x11029: result += String.fromCodePoint(0x92C); break; // BA
        case 0x1102a: result += String.fromCodePoint(0x92D); break; // BHA
        case 0x1102b: result += String.fromCodePoint(0x92E); break; // MA
        case 0x1102c: result += String.fromCodePoint(0x92F); break; // YA
        case 0x1102d: result += String.fromCodePoint(0x930); break; // RA
        case 0x1102e: result += String.fromCodePoint(0x932); break; // LA
        case 0x11034: result += String.fromCodePoint(0x933); break; // LLA
        case 0x1102f: result += String.fromCodePoint(0x935); break; // VA
        case 0x11030: result += String.fromCodePoint(0x936); break; // SHA
        case 0x11031: result += String.fromCodePoint(0x937); break; // SSA
        case 0x11032: result += String.fromCodePoint(0x938); break; // SA
        case 0x11033: result += String.fromCodePoint(0x939); break; // HA
        case 0x11038: result += String.fromCodePoint(0x93E); break; // AA
        case 0x1103a: result += String.fromCodePoint(0x93F); break; // I
        case 0x1103b: result += String.fromCodePoint(0x940); break; // II
        case 0x1103c: result += String.fromCodePoint(0x941); break; // U
        case 0x1103d: result += String.fromCodePoint(0x942); break; // UU
        case 0x1103e: result += String.fromCodePoint(0x943); break; // R
        case 0x1103f: result += String.fromCodePoint(0x944); break; // RR
        case 0x11040: result += String.fromCodePoint(0x962); break; // L
        case 0x11041: result += String.fromCodePoint(0x963); break; // LL
        case 0x11042: result += String.fromCodePoint(0x947); break; // E
        case 0x11043: result += String.fromCodePoint(0x948); break; // AI
        case 0x11044: result += String.fromCodePoint(0x94B); break; // O
        case 0x11045: result += String.fromCodePoint(0x94C); break; // AU
        case 0x11046: result += String.fromCodePoint(0x94D); break; // virama
        case 0x11047: result += String.fromCodePoint(0x964); break; // danda
        case 0x11048: result += String.fromCodePoint(0x965); break; // double danda
        case 0x11066: result += String.fromCodePoint(0x966); break; // 0
        case 0x11067: result += String.fromCodePoint(0x967); break; // 1
        case 0x11068: result += String.fromCodePoint(0x968); break; // 2
        case 0x11069: result += String.fromCodePoint(0x969); break; // 3
        case 0x1106a: result += String.fromCodePoint(0x96A); break; // 4
        case 0x1106b: result += String.fromCodePoint(0x96B); break; // 5
        case 0x1106c: result += String.fromCodePoint(0x96C); break; // 6
        case 0x1106d: result += String.fromCodePoint(0x96D); break; // 7
        case 0x1106e: result += String.fromCodePoint(0x96E); break; // 8
        case 0x1106f: result += String.fromCodePoint(0x96F); break; // 9
        default: result += String.fromCodePoint(codePoint); break;
      }
    }
    return result;
  }, []);

  // Live translation effect
  useEffect(() => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    const translateText = async () => {
      setIsTranslating(true);
      
      try {
        let translated = '';
        
        if (sourceLanguage === 'brahmi') {
          // Input is Brahmi: convert to Devanagari first, then Google translate to target
          const devanagariText = brahmiToDevanagari(inputText);
          if (targetLanguage === 'brahmi') {
            // Brahmi to Brahmi (no change needed)
            translated = inputText;
          } else if (['hi', 'sa', 'mr', 'ne'].includes(targetLanguage)) {
            // Brahmi to Devanagari-based languages
            translated = devanagariText;
          } else {
            // Brahmi to other languages via Google Translate
            translated = await translateWithGoogle(devanagariText, 'hi', targetLanguage);
          }
        } else if (targetLanguage === 'brahmi') {
          // Output is Brahmi: Google translate to Hindi first, then convert to Brahmi
          if (['hi', 'sa', 'mr', 'ne'].includes(sourceLanguage)) {
            // Direct Devanagari to Brahmi conversion
            translated = devanagariToBrahmi(inputText);
          } else {
            // Other languages to Brahmi via Google Translate to Hindi
            const hindiText = await translateWithGoogle(inputText, sourceLanguage, 'hi');
            translated = devanagariToBrahmi(hindiText);
          }
        } else {
          // Neither input nor output is Brahmi: use Google Translate directly
          translated = await translateWithGoogle(inputText, sourceLanguage, targetLanguage);
        }
        
        setOutputText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setOutputText('Translation failed');
      } finally {
        setIsTranslating(false);
      }
    };

    const debounceTimer = setTimeout(translateText, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputText, sourceLanguage, targetLanguage, devanagariToBrahmi, brahmiToDevanagari]);

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