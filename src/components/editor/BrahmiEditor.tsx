import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './BrahmiEditor.css';
import { keyboardLayouts } from './keyboardLayouts';
import { getLanguageStats } from '../../utils/languageDetection';
import { translateFormattedTextToBrahmi, cleanTranslatedHTML } from '../../utils/formattedTranslation';

const BrahmiEditor: React.FC = () => {
  const [inputLanguage, setInputLanguage] = useState<'english' | 'hindi' | 'brahmi'>('brahmi');
  const [keyboardLayout, setKeyboardLayout] = useState<'default' | 'shift'>('default');
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [brahmiTranslation, setBrahmiTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [languageStats, setLanguageStats] = useState<{ [key: string]: number }>({});
  const keyboardRef = useRef<any>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const headingDropdownRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Blockquote,
      HorizontalRule,
    ],
    content: '',
    autofocus: 'start',
    editable: true,
  });

  const handleKeyPress = useCallback((button: string) => {
    if (!editor) return;

    // Focus the editor first to ensure cursor is visible
    editor.commands.focus();

    switch (button) {
      case '{bksp}':
        editor.commands.first(({ commands }) => [
          () => commands.undoInputRule(),
          () => commands.deleteSelection(),
          () => commands.deleteRange({ from: Math.max(0, editor.state.selection.from - 1), to: editor.state.selection.from })
        ]);
        break;
      case '{space}':
        editor.commands.insertContent(' ');
        break;
      case '{enter}':
        editor.commands.setHardBreak();
        break;
      case '{tab}':
        editor.commands.insertContent('    ');
        break;
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
        editor.commands.insertContent(text);
    }

    // Ensure editor stays focused after the action
    setTimeout(() => {
      editor.commands.focus();
    }, 10);
  }, [editor, inputLanguage, isCapsLock]);

  const downloadPDF = async () => {
    if (!editor) return;
    const element = document.querySelector('.ProseMirror');
    if (!element) return;

    const canvas = await html2canvas(element as HTMLElement);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 277);
    pdf.save('document.pdf');
  };

  const handleColorChange = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    }
  };

  const getCurrentHeadingLevel = () => {
    if (!editor) return null;
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive('heading', { level: level as 1 | 2 | 3 | 4 | 5 | 6 })) {
        return level;
      }
    }
    return null;
  };

  const setHeading = (level: number | null) => {
    if (!editor) return;
    if (level === null) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    }
    setShowHeadingDropdown(false);
  };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (headingDropdownRef.current && !headingDropdownRef.current.contains(event.target as Node)) {
        setShowHeadingDropdown(false);
      }
    };

    if (showColorPicker || showHeadingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, showHeadingDropdown]);

  // Translation effect - translate editor content to Brahmi
  useEffect(() => {
    if (!editor) return;

    const handleTranslation = async () => {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      
      if (!textContent.trim()) {
        setBrahmiTranslation('');
        setLanguageStats({});
        return;
      }

      setIsTranslating(true);
      
      try {
        // Get language statistics for the input (using plain text)
        const stats = getLanguageStats(textContent);
        setLanguageStats(stats);
        
        // Translate formatted content to Brahmi while preserving formatting
        const translated = await translateFormattedTextToBrahmi(htmlContent);
        const cleanedTranslation = cleanTranslatedHTML(translated);
        setBrahmiTranslation(cleanedTranslation);
      } catch (error) {
        console.error('Translation failed:', error);
        setBrahmiTranslation('Translation failed');
      } finally {
        setIsTranslating(false);
      }
    };

    // Debounce translation to avoid too many API calls
    const debounceTimer = setTimeout(handleTranslation, 500);
    
    // Listen for editor updates
    const handleUpdate = () => {
      clearTimeout(debounceTimer);
      const newTimer = setTimeout(handleTranslation, 500);
      return newTimer;
    };

    editor.on('update', handleUpdate);

    return () => {
      clearTimeout(debounceTimer);
      editor.off('update', handleUpdate);
    };
  }, [editor, inputLanguage]);

  if (!editor) return null;

  const commonColors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080',
    '#C0C0C0', '#FF8000', '#8000FF', '#FF0080', '#80FF00', '#0080FF', '#FF8080'
  ];

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="divider" />
        
        {/* Color Picker */}
        <div className="color-picker-container" ref={colorPickerRef}>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="color-button"
            title="Text Color"
          >
            A
          </button>
          {showColorPicker && (
            <div className="color-picker-dropdown">
              <div className="color-grid">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="reset-color-btn"
                title="Reset Color"
              >
                Reset Color
              </button>
            </div>
          )}
        </div>
        
        <div className="divider" />
        
        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
          title="Align Left"
        >
          ⫷
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
          title="Align Center"
        >
          ≡
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
          title="Align Right"
        >
          ⫸
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}
          title="Justify"
        >
          ≣
        </button>
        
        <div className="divider" />
        
        {/* Heading Dropdown */}
        <div className="heading-dropdown-container" ref={headingDropdownRef}>
          <button
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            className={getCurrentHeadingLevel() ? 'active' : ''}
            title="Headings"
          >
            {getCurrentHeadingLevel() ? `H${getCurrentHeadingLevel()}` : 'Heading'}
            <span className="dropdown-arrow">▼</span>
          </button>
          {showHeadingDropdown && (
            <div className="heading-dropdown">
              <button
                onClick={() => setHeading(null)}
                className={!getCurrentHeadingLevel() ? 'active' : ''}
              >
                Normal Text
              </button>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <button
                  key={level}
                  onClick={() => setHeading(level)}
                  className={getCurrentHeadingLevel() === level ? 'active' : ''}
                >
                  Heading {level}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="divider" />
        
        {/* Blockquote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'active' : ''}
          title="Blockquote"
        >
          ❝
        </button>
        
        {/* Horizontal Rule */}
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          ―
        </button>
        
        <div className="divider" />
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="divider" />
        <button onClick={downloadPDF} title="Download PDF">
          📄
        </button>
      </div>
      
      <div className="editor-sections">
        {/* Main Editor Section */}
        <div className="main-editor-section">
          <div className="section-header">
            <h3 className="section-title">Input (Mixed Languages)</h3>
            {Object.keys(languageStats).length > 0 && (
              <div className="language-stats">
                {Object.entries(languageStats).map(([lang, count]) => (
                  <span key={lang} className="lang-stat">
                    {lang}: {count} chars
                  </span>
                ))}
              </div>
            )}
          </div>
          <EditorContent editor={editor} />
        </div>

        {/* Brahmi Translation Section */}
        <div className="brahmi-translation-section">
          <div className="section-header">
            <h3 className="section-title">Brahmi Translation (Auto-detected)</h3>
            {isTranslating && <span className="translation-status">Translating...</span>}
          </div>
          <div 
            className="brahmi-output"
            dangerouslySetInnerHTML={{
              __html: brahmiTranslation || `<span class="placeholder-text">
                Brahmi translation will appear here as you type...
              </span>`
            }}
          />
        </div>
      </div>
      
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
    </div>
  );
};

export default BrahmiEditor;
