import React, { useState, useRef, useEffect, useCallback } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './VirtualKeyboard.css';
import { keyboardLayouts } from './keyboardLayouts';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress }) => {
  const [inputLanguage, setInputLanguage] = useState<'english' | 'hindi' | 'brahmi'>('brahmi');
  const [keyboardLayout, setKeyboardLayout] = useState<'default' | 'shift'>('default');
  const [isCapsLock, setIsCapsLock] = useState(false);
  const keyboardRef = useRef<any>(null);

  const handleKeyPress = useCallback((button: string) => {
    switch (button) {
      case '{shift}':
        setKeyboardLayout(prev => prev === 'default' ? 'shift' : 'default');
        break;
      case '{lock}':
        if (inputLanguage === 'english') {
          setIsCapsLock(prev => !prev);
        }
        break;
      case '{lang}':
        setInputLanguage(prev => {
          if (prev === 'brahmi') return 'hindi';
          if (prev === 'hindi') return 'english';
          return 'brahmi';
        });
        setIsCapsLock(false);
        setKeyboardLayout('default');
        break;
      default:
        const text = (inputLanguage === 'english' && isCapsLock) ? button.toUpperCase() : button;
        onKeyPress(text);
    }
  }, [onKeyPress, inputLanguage, isCapsLock]);

  const getCurrentLayout = () => {
    const languageLayouts = keyboardLayouts[inputLanguage];
    if (!languageLayouts) return ['{space} {lang}'];
    
    const currentLayout = keyboardLayout === 'shift' && languageLayouts.shift 
      ? languageLayouts.shift 
      : languageLayouts.default;
    
    if (!currentLayout || !Array.isArray(currentLayout)) {
      return ['{space} {lang}'];
    }
    
    return [...currentLayout.slice(0, -1), '{space} {lang}'];
  };

  useEffect(() => {
    if (inputLanguage !== 'english') {
      setIsCapsLock(false);
    }
    setKeyboardLayout('default');
  }, [inputLanguage]);

  return (
    <div className="virtual-keyboard">
      <Keyboard
        keyboardRef={r => (keyboardRef.current = r)}
        layoutName="default"
        layout={{ 
          default: getCurrentLayout()
        }}
        onKeyPress={handleKeyPress}
        display={{
          '{bksp}': '⌫',
          '{enter}': '↵',
          '{tab}': '⇥',
          '{space}': 'Space',
          '{shift}': '⇧',
          '{lock}': inputLanguage === 'english' ? (isCapsLock ? '🔒' : '⇪') : '⇪',
          '{lang}': `🌐 ${inputLanguage.charAt(0).toUpperCase() + inputLanguage.slice(1)}`
        }}
        theme="hg-theme-default"
        buttonTheme={[
          {
            class: "special-key",
            buttons: "{bksp} {enter} {tab} {space} {shift} {lock} {lang}"
          },
          ...(keyboardLayout === 'shift' ? [{
            class: "shift-active",
            buttons: "{shift}"
          }] : [])
        ]}
      />
    </div>
  );
};

export default VirtualKeyboard; 