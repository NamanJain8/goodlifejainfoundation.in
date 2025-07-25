import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './BrahmiEditor.css';
import VirtualKeyboard from './VirtualKeyboard';
import { getLanguageStats } from '../../utils/languageDetection';
import { translateFormattedTextToBrahmi, cleanTranslatedHTML } from '../../utils/formattedTranslation';

// Device detection utility
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
};

const BrahmiEditor: React.FC = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [brahmiTranslation, setBrahmiTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [languageStats, setLanguageStats] = useState<{ [key: string]: number }>({});
  const [isMobile, setIsMobile] = useState(false);
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
    ],
    content: '',
    autofocus: 'start',
    editable: true,
    editorProps: {
      handleKeyDown: (view, event) => {
        // We are intercepting special keys to have custom behavior
        switch (event.key) {
          // FIXME: Uncomment this when we have a way to handle line breaks
          // case 'Enter':
          //   editor?.chain().focus().setHardBreak().run();
          //   return true;
          case 'Backspace': {
            if (!editor) return true;

            if (editor.commands.undoInputRule() || editor.commands.deleteSelection()) {
              return true;
            }

            const { from, $from } = editor.state.selection;

            if ($from.parentOffset > 0) {
              const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, ' ');
              if (textBefore) {
                const segmenter = new Intl.Segmenter();
                const segments = Array.from(segmenter.segment(textBefore));
                const lastGrapheme = segments[segments.length - 1]?.segment;

                if (lastGrapheme) {
                  const newFrom = from - lastGrapheme.length;
                  editor.chain().focus().deleteRange({ from: newFrom, to: from }).run();
                  return true;
                }
              }
            }

            if (editor.commands.joinBackward()) {
              return true;
            }
            return true;
          }
          case 'Tab':
            editor?.commands.insertContent('    ');
            return true;
          default:
            // For all other keys, let Tiptap handle them
            return false;
        }
      },
    },
  });

  // Virtual keyboard handler for desktop
  const handleVirtualKeyPress = (key: string) => {
    if (!editor) return;

    editor.commands.focus();

    switch (key) {
      case '{bksp}': {
        if (editor.commands.undoInputRule() || editor.commands.deleteSelection()) {
          break;
        }

        const { from, $from } = editor.state.selection;

        if ($from.parentOffset > 0) {
          const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, ' ');
          if (textBefore) {
            const segmenter = new Intl.Segmenter();
            const segments = Array.from(segmenter.segment(textBefore));
            const lastGrapheme = segments[segments.length - 1]?.segment;

            if (lastGrapheme) {
              editor.chain().focus().deleteRange({ from: from - lastGrapheme.length, to: from }).run();
              break;
            }
          }
        }

        editor.commands.joinBackward();
        break;
      }
      case '{enter}':
        editor.commands.setHardBreak();
        break;
      case '{tab}':
        editor.commands.insertContent('    ');
        break;
      case '{space}':
        editor.commands.insertContent(' ');
        break;
      default:
        editor.commands.insertContent(key);
        break;
    }

    // Ensure editor stays focused after the action
    setTimeout(() => {
      editor.commands.focus();
    }, 10);
  };

  const generatePDF = async (inputHTML: string, brahmiHTML: string) => {
    // Create a temporary container for PDF layout
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
      width: 794px;
      height: 1123px;
      background: white;
      font-family: 'Noto Sans Brahmi', serif;
      padding: 40px;
      box-sizing: border-box;
      position: absolute;
      top: -9999px;
      left: -9999px;
      display: flex;
      flex-direction: column;
    `;

    // Brahmi translation section (top half)
    const brahmiSection = document.createElement('div');
    brahmiSection.style.cssText = `
      flex: 1;
      padding: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const brahmiContent = document.createElement('div');
    brahmiContent.innerHTML = brahmiHTML || '<span style="color: #9ca3af; font-style: italic;">No translation available</span>';
    brahmiContent.style.cssText = `
      font-size: 28px;
      line-height: 1.8;
      color: #111827;
      text-align: center;
      word-wrap: break-word;
      overflow-wrap: break-word;
    `;
    
    // Add CSS for heading preservation in Brahmi section
    const brahmiStyle = document.createElement('style');
    brahmiStyle.textContent = `
      .brahmi-content h1 { font-size: 56px !important; font-weight: bold !important; margin: 0.67em 0 !important; }
      .brahmi-content h2 { font-size: 42px !important; font-weight: bold !important; margin: 0.75em 0 !important; }
      .brahmi-content h3 { font-size: 32px !important; font-weight: bold !important; margin: 0.83em 0 !important; }
      .brahmi-content h4 { font-size: 28px !important; font-weight: bold !important; margin: 1.12em 0 !important; }
      .brahmi-content h5 { font-size: 23px !important; font-weight: bold !important; margin: 1.5em 0 !important; }
      .brahmi-content h6 { font-size: 21px !important; font-weight: bold !important; margin: 1.67em 0 !important; }
      .brahmi-content p { font-size: 28px !important; margin: 1em 0 !important; }
      .brahmi-content strong { font-weight: bold !important; }
      .brahmi-content em { font-style: italic !important; }
      .brahmi-content u { text-decoration: underline !important; }
    `;
    brahmiContent.className = 'brahmi-content';

    // Horizontal divider line
    const dividerLine = document.createElement('hr');
    dividerLine.style.cssText = `
      border: none;
      border-top: 2px solid #d1d5db;
      margin: 20px 0;
      width: 100%;
    `;

    // Input text section (bottom half)
    const inputSection = document.createElement('div');
    inputSection.style.cssText = `
      flex: 1;
      padding: 20px 0;
      opacity: 0.7;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const inputContent = document.createElement('div');
    inputContent.innerHTML = inputHTML;
    inputContent.style.cssText = `
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      font-family: system-ui, -apple-system, sans-serif;
      word-wrap: break-word;
      overflow-wrap: break-word;
      text-align: center;
    `;
    
    // Add CSS for heading preservation in input section
    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
      .input-content h1 { font-size: 32px !important; font-weight: bold !important; margin: 0.67em 0 !important; }
      .input-content h2 { font-size: 24px !important; font-weight: bold !important; margin: 0.75em 0 !important; }
      .input-content h3 { font-size: 19px !important; font-weight: bold !important; margin: 0.83em 0 !important; }
      .input-content h4 { font-size: 16px !important; font-weight: bold !important; margin: 1.12em 0 !important; }
      .input-content h5 { font-size: 13px !important; font-weight: bold !important; margin: 1.5em 0 !important; }
      .input-content h6 { font-size: 12px !important; font-weight: bold !important; margin: 1.67em 0 !important; }
      .input-content p { font-size: 16px !important; margin: 1em 0 !important; }
      .input-content strong { font-weight: bold !important; }
      .input-content em { font-style: italic !important; }
      .input-content u { text-decoration: underline !important; }
    `;
    inputContent.className = 'input-content';

    // Assemble the PDF container
    brahmiSection.appendChild(brahmiContent);
    inputSection.appendChild(inputContent);
    pdfContainer.appendChild(brahmiSection);
    pdfContainer.appendChild(dividerLine);
    pdfContainer.appendChild(inputSection);
    
    // Add to DOM temporarily (including styles)
    document.head.appendChild(brahmiStyle);
    document.head.appendChild(inputStyle);
    document.body.appendChild(pdfContainer);

    try {
      // Generate PDF
      const canvas = await html2canvas(pdfContainer, {
        width: 794,
        height: 1123,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save('brahmi-translation.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Clean up
      document.head.removeChild(brahmiStyle);
      document.head.removeChild(inputStyle);
      document.body.removeChild(pdfContainer);
    }
  };

  const downloadPDF = async () => {
    if (!editor) return;
    await generatePDF(editor.getHTML(), brahmiTranslation);
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

  // Device detection effect
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Keyman initialization for mobile devices
  useEffect(() => {
    console.log('isMobile', isMobile);
    if (!isMobile || !editor) return;

    const initializeKeyman = async () => {
      try {
        if (typeof window !== 'undefined' && window.keyman) {
          await window.keyman.init();
          window.keyman.attachToControl(editor.view.dom);
          console.log('Keyman initialized for mobile device');
        }
      } catch (error) {
        console.error('Failed to initialize Keyman:', error);
      }
    };

    initializeKeyman();
  }, [isMobile, editor]);

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
  }, [editor]);

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
      
      {/* Virtual Keyboard for Desktop */}
      {!isMobile && (
        <div className="virtual-keyboard-container">
          <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />
        </div>
      )}
      
      {isMobile && <div id="KeymanWebControl"></div>}
    </div>
  );
};

export default BrahmiEditor;
