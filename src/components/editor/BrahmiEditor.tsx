import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './BrahmiEditor.css';

// Keyboard layouts
const keyboardLayouts = {
  english: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} q w e r t y u i o p [ ] \\',
      '{lock} a s d f g h j k l ; \' {enter}',
      '{shift} z x c v b n m , . / {shift}',
      '{space}'
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} Q W E R T Y U I O P { } |',
      '{lock} A S D F G H J K L : " {enter}',
      '{shift} Z X C V B N M < > ? {shift}',
      '{space}'
    ]
  },
  hindi: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} ौ ै ा ि ी ु ू ब ह ग द ज ड ़ ङ',
      '{lock} ो े ् ि ी ु ू प र क त च ट',
      '{shift} ै ौ ं म न व ल स , . / {shift}',
      '{space}'
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} औ ऐ आ इ ई उ ऊ भ ङ घ ढ झ ञ ण',
      '{lock} ओ ए अ इ ई उ ऊ फ ऱ ख थ छ ठ',
      '{shift} ऐ औ ँ ण म न व ल श , . / {shift}',
      '{space}'
    ]
  },
  brahmi: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} 𑀒 𑀐 𑀆 𑀇 𑀈 𑀉 𑀊 𑀩 𑀳 𑀕 𑀤 𑀚 𑀟 𑀡',
      '{lock} 𑀑 𑀏 𑀅 𑀇 𑀈 𑀉 𑀊 𑀧 𑀭 𑀓 𑀢 𑀘 𑀝',
      '{shift} 𑀐 𑀒 𑀁 𑀫 𑀦 𑀯 𑀮 𑀲 , . / {shift}',
      '{space}'
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} 𑀑 𑀐 𑀆 𑀇 𑀈 𑀉 𑀊 𑀪 𑀡 𑀖 𑀥 𑀛 𑀠 𑀡',
      '{lock} 𑀑 𑀏 𑀅 𑀇 𑀈 𑀉 𑀊 𑀨 𑀱 𑀔 𑀣 𑀙 𑀞',
      '{shift} 𑀐 1 𑀁 𑀡 𑀫 𑀯 𑀮 𑀰 , . / {shift}',
      '{space}'
    ]
  }
};

const BrahmiEditor: React.FC = () => {
  const [inputLanguage, setInputLanguage] = useState<'english' | 'hindi' | 'brahmi'>('brahmi');
  const [keyboardLayout, setKeyboardLayout] = useState<'default' | 'shift'>('default');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const keyboardRef = useRef<any>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
    autofocus: 'start',
    editable: true,
  });

  const handleKeyPress = useCallback((button: string) => {
    if (!editor) return;

    switch (button) {
      case '{bksp}':
        editor.commands.deleteSelection();
        break;
      case '{space}':
        editor.commands.insertContent(' ');
        break;
      case '{enter}':
        editor.commands.createParagraphNear();
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

  if (!editor) return null;

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
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          title="Heading 3"
        >
          H3
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
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          className={showKeyboard ? 'active' : ''}
          title="Toggle Keyboard"
        >
          ⌨️
        </button>
        <button onClick={downloadPDF} title="Download PDF">
          📄
        </button>
      </div>
      
      <EditorContent editor={editor} />
      
      {showKeyboard && (
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
      )}
    </div>
  );
};

export default BrahmiEditor;
