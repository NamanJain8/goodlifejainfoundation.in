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
import Icon from '../ui/Icon';
import { getLanguageStats } from '../../utils/languageDetection';
import { translateFormattedTextToBrahmi, translateFormattedTextToHindi, cleanTranslatedHTML } from '../../utils/formattedTranslation';

// Device detection utility
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
};

const BrahmiEditor: React.FC = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [translation, setTranslation] = useState('');
  const [outputLanguage, setOutputLanguage] = useState<'brahmi' | 'hindi'>('brahmi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [languageStats, setLanguageStats] = useState<{ [key: string]: number }>({});
  const [isMobile, setIsMobile] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const headingDropdownRef = useRef<HTMLDivElement>(null);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

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

  // Helper function to parse HTML content into structured segments
  const parseContentIntoSegments = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const segments: Array<{
      type: string;
      content: string;
      tagName: string;
      estimatedHeight: number;
    }> = [];
    
    const processNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        
        // Skip empty elements
        if (!element.textContent?.trim()) return;
        
        // Calculate estimated height based on element type and content
        const textLength = element.textContent?.length || 0;
        let baseHeight = 0;
        
        switch (tagName) {
          case 'h1': baseHeight = 80; break;
          case 'h2': baseHeight = 65; break;
          case 'h3': baseHeight = 50; break;
          case 'h4': baseHeight = 40; break;
          case 'h5': baseHeight = 35; break;
          case 'h6': baseHeight = 30; break;
          case 'p': baseHeight = 25; break;
          case 'blockquote': baseHeight = 35; break;
          case 'li': baseHeight = 25; break;
          default: baseHeight = 25; break;
        }
        
        // Add extra height for longer content (rough estimation)
        const estimatedHeight = baseHeight + Math.floor(textLength / 50) * 20;
        
        segments.push({
          type: tagName,
          content: element.outerHTML,
          tagName,
          estimatedHeight
        });
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        // Handle standalone text nodes
        const textLength = node.textContent.length;
        const estimatedHeight = 25 + Math.floor(textLength / 60) * 20;
        
        segments.push({
          type: 'text',
          content: `<p>${node.textContent.trim()}</p>`,
          tagName: 'p',
          estimatedHeight
        });
      }
    };
    
    Array.from(tempDiv.childNodes).forEach(processNode);
    return segments;
  };

  // Helper function to group segments into pages
  const groupSegmentsIntoPages = (inputSegments: any[], brahmiSegments: any[]) => {
    const pages: Array<{
      inputContent: string;
      brahmiContent: string;
      pageNumber: number;
    }> = [];
    
    // Maximum height per half-page (rough estimation)
    const maxHeightPerSection = 400; // pixels, accounting for padding and spacing
    
    let currentInputContent = '';
    let currentBrahmiContent = '';
    let currentInputHeight = 0;
    let currentBrahmiHeight = 0;
    let pageNumber = 1;
    
    const finalizePage = () => {
      if (currentInputContent || currentBrahmiContent) {
        pages.push({
          inputContent: currentInputContent,
          brahmiContent: currentBrahmiContent,
          pageNumber
        });
        pageNumber++;
        currentInputContent = '';
        currentBrahmiContent = '';
        currentInputHeight = 0;
        currentBrahmiHeight = 0;
      }
    };
    
    // Process segments in parallel (input and brahmi)
    const maxSegments = Math.max(inputSegments.length, brahmiSegments.length);
    
    for (let i = 0; i < maxSegments; i++) {
      const inputSegment = inputSegments[i];
      const brahmiSegment = brahmiSegments[i];
      
      const inputHeight = inputSegment?.estimatedHeight || 0;
      const brahmiHeight = brahmiSegment?.estimatedHeight || 0;
      
      // Check if adding this segment would exceed page capacity
      const wouldExceedCapacity = 
        (currentInputHeight + inputHeight > maxHeightPerSection) ||
        (currentBrahmiHeight + brahmiHeight > maxHeightPerSection);
      
      if (wouldExceedCapacity && (currentInputContent || currentBrahmiContent)) {
        // Finalize current page and start a new one
        finalizePage();
      }
      
      // Add segments to current page
      if (inputSegment) {
        currentInputContent += inputSegment.content;
        currentInputHeight += inputHeight;
      }
      
      if (brahmiSegment) {
        currentBrahmiContent += brahmiSegment.content;
        currentBrahmiHeight += brahmiHeight;
      }
    }
    
    // Finalize the last page
    finalizePage();
    
    return pages;
  };

  // Helper function to create a single PDF page
  const createPDFPage = async (inputHTML: string, brahmiHTML: string, pageNumber: number, totalPages: number) => {
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
      width: 794px;
      height: 1123px;
      background: white;
      font-family: serif;
      padding: 40px;
      box-sizing: border-box;
      position: absolute;
      top: -9999px;
      left: -9999px;
      display: flex;
      flex-direction: column;
    `;

    // Page header with page number
    const pageHeader = document.createElement('div');
    pageHeader.style.cssText = `
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 20px;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    pageHeader.textContent = `Page ${pageNumber} of ${totalPages}`;

    // Brahmi translation section (top half)
    const brahmiSection = document.createElement('div');
    brahmiSection.style.cssText = `
      flex: 1;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;
    `;
    
    const brahmiContent = document.createElement('div');
    brahmiContent.innerHTML = brahmiHTML || '<span style="color: #9ca3af; font-style: italic;">No translation available</span>';
    brahmiContent.style.cssText = `
      font-size: 24px;
      line-height: 1.6;
      color: #111827;
      text-align: left;
      font-family: serif;
      letter-spacing: 0.1em;
      word-spacing: 0.3em;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      margin-bottom: auto;
    `;
    
    // Add CSS for heading preservation in Brahmi section
    const brahmiStyle = document.createElement('style');
    brahmiStyle.textContent = `
      .brahmi-content h1 { font-size: 48px !important; font-weight: bold !important; margin: 0.5em 0 !important; }
      .brahmi-content h2 { font-size: 36px !important; font-weight: bold !important; margin: 0.6em 0 !important; }
      .brahmi-content h3 { font-size: 28px !important; font-weight: bold !important; margin: 0.7em 0 !important; }
      .brahmi-content h4 { font-size: 24px !important; font-weight: bold !important; margin: 0.8em 0 !important; }
      .brahmi-content h5 { font-size: 20px !important; font-weight: bold !important; margin: 0.9em 0 !important; }
      .brahmi-content h6 { font-size: 18px !important; font-weight: bold !important; margin: 1em 0 !important; }
      .brahmi-content p { font-size: 24px !important; margin: 0.8em 0 !important; }
      .brahmi-content strong { font-weight: bold !important; }
      .brahmi-content em { font-style: italic !important; }
      .brahmi-content u { text-decoration: underline !important; }
      .brahmi-content blockquote { border-left: 4px solid #d1d5db; padding-left: 1em; margin: 1em 0; font-style: italic; }
      .brahmi-content ul, .brahmi-content ol { margin: 1em 0; padding-left: 2em; }
      .brahmi-content li { margin: 0.5em 0; }
    `;
    brahmiContent.className = 'brahmi-content';

    // Horizontal divider line
    const dividerLine = document.createElement('hr');
    dividerLine.style.cssText = `
      border: none;
      border-top: 2px solid #d1d5db;
      margin: 20px 0;
      width: 100%;
      flex-shrink: 0;
    `;

    // Input text section (bottom half)
    const inputSection = document.createElement('div');
    inputSection.style.cssText = `
      flex: 1;
      padding: 20px 0;
      opacity: 0.7;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;
    `;
    
    const inputContent = document.createElement('div');
    inputContent.innerHTML = inputHTML;
    inputContent.style.cssText = `
      font-size: 14px;
      line-height: 1.5;
      color: #4b5563;
      font-family: system-ui, -apple-system, sans-serif;
      word-wrap: break-word;
      overflow-wrap: break-word;
      text-align: left;
    `;
    
    // Add CSS for heading preservation in input section
    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
      .input-content h1 { font-size: 24px !important; font-weight: bold !important; margin: 0.5em 0 !important; }
      .input-content h2 { font-size: 20px !important; font-weight: bold !important; margin: 0.6em 0 !important; }
      .input-content h3 { font-size: 17px !important; font-weight: bold !important; margin: 0.7em 0 !important; }
      .input-content h4 { font-size: 14px !important; font-weight: bold !important; margin: 0.8em 0 !important; }
      .input-content h5 { font-size: 12px !important; font-weight: bold !important; margin: 0.9em 0 !important; }
      .input-content h6 { font-size: 11px !important; font-weight: bold !important; margin: 1em 0 !important; }
      .input-content p { font-size: 14px !important; margin: 0.8em 0 !important; }
      .input-content strong { font-weight: bold !important; }
      .input-content em { font-style: italic !important; }
      .input-content u { text-decoration: underline !important; }
      .input-content blockquote { border-left: 3px solid #d1d5db; padding-left: 1em; margin: 1em 0; font-style: italic; }
      .input-content ul, .input-content ol { margin: 1em 0; padding-left: 2em; }
      .input-content li { margin: 0.3em 0; }
    `;
    inputContent.className = 'input-content';

    // Assemble the PDF container
    brahmiSection.appendChild(brahmiContent);
    inputSection.appendChild(inputContent);
    pdfContainer.appendChild(pageHeader);
    pdfContainer.appendChild(brahmiSection);
    pdfContainer.appendChild(dividerLine);
    pdfContainer.appendChild(inputSection);
    
    // Add to DOM temporarily (including styles)
    document.head.appendChild(brahmiStyle);
    document.head.appendChild(inputStyle);
    document.body.appendChild(pdfContainer);

    try {
      // Generate canvas for this page
      const canvas = await html2canvas(pdfContainer, {
        width: 794,
        height: 1123,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      return imgData;
    } finally {
      // Clean up
      document.head.removeChild(brahmiStyle);
      document.head.removeChild(inputStyle);
      document.body.removeChild(pdfContainer);
    }
  };

  const generatePDF = async (inputHTML: string, brahmiHTML: string) => {
    try {
      // Parse content into segments
      const inputSegments = parseContentIntoSegments(inputHTML);
      const brahmiSegments = parseContentIntoSegments(brahmiHTML);
      
      // If content is small enough, use single page
      const totalInputHeight = inputSegments.reduce((sum, seg) => sum + seg.estimatedHeight, 0);
      const totalBrahmiHeight = brahmiSegments.reduce((sum, seg) => sum + seg.estimatedHeight, 0);
      
      if (totalInputHeight <= 400 && totalBrahmiHeight <= 400) {
        // Use single page for small content
        const imgData = await createPDFPage(inputHTML, brahmiHTML, 1, 1);
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save('brahmi-translation.pdf');
        return;
      }
      
      // Group segments into pages
      const pages = groupSegmentsIntoPages(inputSegments, brahmiSegments);
      
      if (pages.length === 0) {
        throw new Error('No content to generate PDF');
      }
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Generate each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const imgData = await createPDFPage(
          page.inputContent, 
          page.brahmiContent, 
          i + 1, 
          pages.length
        );
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // A4 dimensions in mm: 210 x 297
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }
      
      pdf.save('brahmi-translation.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to simple single page if pagination fails
      const imgData = await createPDFPage(inputHTML, brahmiHTML, 1, 1);
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save('brahmi-translation.pdf');
    }
  };

  // Helper function to create a single image page
  const createImagePage = async (inputHTML: string, brahmiHTML: string, pageNumber: number, totalPages: number) => {
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
      width: 1200px;
      min-height: 1600px;
      background: white;
      font-family: serif;
      padding: 60px;
      box-sizing: border-box;
      position: absolute;
      top: -9999px;
      left: -9999px;
      display: flex;
      flex-direction: column;
    `;

    // Page header with page number
    const pageHeader = document.createElement('div');
    pageHeader.style.cssText = `
      text-align: center;
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 30px;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    pageHeader.textContent = `Page ${pageNumber} of ${totalPages}`;

    // Brahmi translation section (top half)
    const brahmiSection = document.createElement('div');
    brahmiSection.style.cssText = `
      flex: 1;
      padding: 30px 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 600px;
      overflow: hidden;
    `;
    
    const brahmiContent = document.createElement('div');
    brahmiContent.innerHTML = brahmiHTML || '<span style="color: #9ca3af; font-style: italic;">No translation available</span>';
    brahmiContent.style.cssText = `
      font-size: 32px;
      line-height: 1.7;
      color: #111827;
      text-align: left;
      font-family: serif;
      letter-spacing: 0.1em;
      word-spacing: 0.3em;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    `;
    
    // Add CSS for heading preservation in Brahmi section
    const brahmiStyle = document.createElement('style');
    brahmiStyle.textContent = `
      .brahmi-content h1 { font-size: 64px !important; font-weight: bold !important; margin: 0.5em 0 !important; }
      .brahmi-content h2 { font-size: 48px !important; font-weight: bold !important; margin: 0.6em 0 !important; }
      .brahmi-content h3 { font-size: 38px !important; font-weight: bold !important; margin: 0.7em 0 !important; }
      .brahmi-content h4 { font-size: 32px !important; font-weight: bold !important; margin: 0.8em 0 !important; }
      .brahmi-content h5 { font-size: 28px !important; font-weight: bold !important; margin: 0.9em 0 !important; }
      .brahmi-content h6 { font-size: 25px !important; font-weight: bold !important; margin: 1em 0 !important; }
      .brahmi-content p { font-size: 32px !important; margin: 0.8em 0 !important; }
      .brahmi-content strong { font-weight: bold !important; }
      .brahmi-content em { font-style: italic !important; }
      .brahmi-content u { text-decoration: underline !important; }
      .brahmi-content blockquote { border-left: 5px solid #d1d5db; padding-left: 1.5em; margin: 1em 0; font-style: italic; }
      .brahmi-content ul, .brahmi-content ol { margin: 1em 0; padding-left: 2em; }
      .brahmi-content li { margin: 0.5em 0; }
    `;
    brahmiContent.className = 'brahmi-content';

    // Horizontal divider line
    const dividerLine = document.createElement('hr');
    dividerLine.style.cssText = `
      border: none;
      border-top: 3px solid #d1d5db;
      margin: 40px 0;
      width: 100%;
      flex-shrink: 0;
    `;

    // Input text section (bottom half)
    const inputSection = document.createElement('div');
    inputSection.style.cssText = `
      flex: 1;
      padding: 30px 0;
      opacity: 0.7;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 400px;
      overflow: hidden;
    `;
    
    const inputContent = document.createElement('div');
    inputContent.innerHTML = inputHTML;
    inputContent.style.cssText = `
      font-size: 18px;
      line-height: 1.6;
      color: #4b5563;
      font-family: system-ui, -apple-system, sans-serif;
      word-wrap: break-word;
      overflow-wrap: break-word;
      text-align: left;
      max-width: 100%;
    `;
    
    // Add CSS for heading preservation in input section
    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
      .input-content h1 { font-size: 32px !important; font-weight: bold !important; margin: 0.5em 0 !important; }
      .input-content h2 { font-size: 26px !important; font-weight: bold !important; margin: 0.6em 0 !important; }
      .input-content h3 { font-size: 22px !important; font-weight: bold !important; margin: 0.7em 0 !important; }
      .input-content h4 { font-size: 18px !important; font-weight: bold !important; margin: 0.8em 0 !important; }
      .input-content h5 { font-size: 16px !important; font-weight: bold !important; margin: 0.9em 0 !important; }
      .input-content h6 { font-size: 14px !important; font-weight: bold !important; margin: 1em 0 !important; }
      .input-content p { font-size: 18px !important; margin: 0.8em 0 !important; }
      .input-content strong { font-weight: bold !important; }
      .input-content em { font-style: italic !important; }
      .input-content u { text-decoration: underline !important; }
      .input-content blockquote { border-left: 4px solid #d1d5db; padding-left: 1.5em; margin: 1em 0; font-style: italic; }
      .input-content ul, .input-content ol { margin: 1em 0; padding-left: 2em; }
      .input-content li { margin: 0.3em 0; }
    `;
    inputContent.className = 'input-content';

    // Assemble the image container
    brahmiSection.appendChild(brahmiContent);
    inputSection.appendChild(inputContent);
    imageContainer.appendChild(pageHeader);
    imageContainer.appendChild(brahmiSection);
    imageContainer.appendChild(dividerLine);
    imageContainer.appendChild(inputSection);
    
    // Add to DOM temporarily (including styles)
    document.head.appendChild(brahmiStyle);
    document.head.appendChild(inputStyle);
    document.body.appendChild(imageContainer);

    try {
      // Generate image
      const canvas = await html2canvas(imageContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Convert to JPG
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      return imgData;
    } finally {
      // Clean up
      document.head.removeChild(brahmiStyle);
      document.head.removeChild(inputStyle);
      document.body.removeChild(imageContainer);
    }
  };

  const generateImage = async (inputHTML: string, brahmiHTML: string) => {
    try {
      // Parse content into segments using the same logic as PDF
      const inputSegments = parseContentIntoSegments(inputHTML);
      const brahmiSegments = parseContentIntoSegments(brahmiHTML);
      
      // Adjust height thresholds for images (larger than PDF since images can be longer)
      const totalInputHeight = inputSegments.reduce((sum, seg) => sum + seg.estimatedHeight, 0);
      const totalBrahmiHeight = brahmiSegments.reduce((sum, seg) => sum + seg.estimatedHeight, 0);
      
      if (totalInputHeight <= 600 && totalBrahmiHeight <= 600) {
        // Use single image for small content
        const imgData = await createImagePage(inputHTML, brahmiHTML, 1, 1);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'brahmi-translation.jpg';
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      
      // Group segments into pages with higher capacity for images
      const adjustedGrouping = (inputSegments: any[], brahmiSegments: any[]) => {
        const pages: Array<{
          inputContent: string;
          brahmiContent: string;
          pageNumber: number;
        }> = [];
        
        // Maximum height per half-page for images (higher than PDF)
        const maxHeightPerSection = 600; 
        
        let currentInputContent = '';
        let currentBrahmiContent = '';
        let currentInputHeight = 0;
        let currentBrahmiHeight = 0;
        let pageNumber = 1;
        
        const finalizePage = () => {
          if (currentInputContent || currentBrahmiContent) {
            pages.push({
              inputContent: currentInputContent,
              brahmiContent: currentBrahmiContent,
              pageNumber
            });
            pageNumber++;
            currentInputContent = '';
            currentBrahmiContent = '';
            currentInputHeight = 0;
            currentBrahmiHeight = 0;
          }
        };
        
        const maxSegments = Math.max(inputSegments.length, brahmiSegments.length);
        
        for (let i = 0; i < maxSegments; i++) {
          const inputSegment = inputSegments[i];
          const brahmiSegment = brahmiSegments[i];
          
          const inputHeight = inputSegment?.estimatedHeight || 0;
          const brahmiHeight = brahmiSegment?.estimatedHeight || 0;
          
          const wouldExceedCapacity = 
            (currentInputHeight + inputHeight > maxHeightPerSection) ||
            (currentBrahmiHeight + brahmiHeight > maxHeightPerSection);
          
          if (wouldExceedCapacity && (currentInputContent || currentBrahmiContent)) {
            finalizePage();
          }
          
          if (inputSegment) {
            currentInputContent += inputSegment.content;
            currentInputHeight += inputHeight;
          }
          
          if (brahmiSegment) {
            currentBrahmiContent += brahmiSegment.content;
            currentBrahmiHeight += brahmiHeight;
          }
        }
        
        finalizePage();
        return pages;
      };
      
      const pages = adjustedGrouping(inputSegments, brahmiSegments);
      
      if (pages.length === 0) {
        throw new Error('No content to generate image');
      }
      
      // Generate multiple images and download as ZIP if more than one page
      if (pages.length === 1) {
        const imgData = await createImagePage(
          pages[0].inputContent, 
          pages[0].brahmiContent, 
          1, 
          1
        );
        
        const link = document.createElement('a');
        link.download = 'brahmi-translation.jpg';
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For multiple pages, create a simple sequential download
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const imgData = await createImagePage(
            page.inputContent, 
            page.brahmiContent, 
            i + 1, 
            pages.length
          );
          
          const link = document.createElement('a');
          link.download = `brahmi-translation-page-${i + 1}.jpg`;
          link.href = imgData;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
      // Fallback to simple single image if pagination fails
      const imgData = await createImagePage(inputHTML, brahmiHTML, 1, 1);
      const link = document.createElement('a');
      link.download = 'brahmi-translation.jpg';
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadPDF = async () => {
    if (!editor) return;
    await generatePDF(editor.getHTML(), translation);
  };

  const downloadImage = async () => {
    if (!editor) return;
    await generateImage(editor.getHTML(), translation);
  };

  const handleDownload = async (format: 'pdf' | 'image') => {
    if (!editor) return;
    
    if (format === 'pdf') {
      await downloadPDF();
    } else {
      await downloadImage();
    }
    
    setShowDownloadDropdown(false);
  };

  const copyTranslationWithFormatting = async () => {
    if (!translation) return;

    try {
      // Create a temporary div to hold the translation content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = translation;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.opacity = '0';
      tempDiv.style.pointerEvents = 'none';
      
      // Apply the same styling as the translation output
      tempDiv.className = `translation-output ${outputLanguage === 'brahmi' ? 'brahmi-font' : 'hindi-font'}`;
      
      document.body.appendChild(tempDiv);

      // Try to use the Clipboard API with rich text support
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          // Create blob with HTML content
          const htmlBlob = new Blob([translation], { type: 'text/html' });
          const textBlob = new Blob([tempDiv.textContent || ''], { type: 'text/plain' });
          
          const clipboardItem = new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
          });
          
          await navigator.clipboard.write([clipboardItem]);
          
          // Show success feedback
          showCopyFeedback('Copied!');
        } catch (richTextError) {
          // Fallback to plain text if rich text fails
          await navigator.clipboard.writeText(tempDiv.textContent || '');
          showCopyFeedback('Copied as plain text!');
        }
      } else {
        // Fallback for browsers without Clipboard API
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        selection?.removeAllRanges();
        selection?.addRange(range);
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            showCopyFeedback('Copied!');
          } else {
            throw new Error('Copy command failed');
          }
        } catch (fallbackError) {
          // Final fallback - copy plain text
          await navigator.clipboard.writeText(tempDiv.textContent || '');
          showCopyFeedback('Copied as plain text!');
        }
        
        selection?.removeAllRanges();
      }
      
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Failed to copy translation:', error);
      showCopyFeedback('Copy failed', true);
    }
  };

  const showCopyFeedback = (message: string, isError = false) => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? '#dc3545' : '#28a745'};
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
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
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setShowDownloadDropdown(false);
      }
    };

    if (showColorPicker || showHeadingDropdown || showDownloadDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, showHeadingDropdown, showDownloadDropdown]);

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

  // Manual translation function - triggered by button click
  const handleTranslateClick = async () => {
    if (!editor) return;

    const htmlContent = editor.getHTML();
    const textContent = editor.getText();
    
    if (!textContent.trim()) {
      setTranslation('');
      setLanguageStats({});
      return;
    }

    setIsTranslating(true);
    
    try {
      // Get language statistics for the input (using plain text)
      const stats = getLanguageStats(textContent);
      setLanguageStats(stats);
      
      // Translate formatted content to selected output language while preserving formatting
      const translated = outputLanguage === 'brahmi' 
        ? await translateFormattedTextToBrahmi(htmlContent)
        : await translateFormattedTextToHindi(htmlContent);
      const cleanedTranslation = cleanTranslatedHTML(translated);
      setTranslation(cleanedTranslation);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslation('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // Effect to retranslate when output language changes (if there's existing content)
  useEffect(() => {
    if (translation && !isTranslating && editor) {
      const textContent = editor.getText();
      if (textContent.trim()) {
        // Auto-retranslate when language toggle changes
        handleTranslateClick();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputLanguage]);

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
        
        {/* Download Dropdown */}
        <div className="download-dropdown-container" ref={downloadDropdownRef}>
          <button
            onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
            className="download-button"
            title="Download"
          >
            <Icon name="Download" size={18} />
            <span className="dropdown-arrow">▼</span>
          </button>
          {showDownloadDropdown && (
            <div className="download-dropdown">
              <button
                onClick={() => handleDownload('pdf')}
                className="download-option"
              >
                <Icon name="FileDown" size={16} />
                Download as PDF
              </button>
              <button
                onClick={() => handleDownload('image')}
                className="download-option"
              >
                <Icon name="ImageDown" size={16} />
                Download as JPG
              </button>
            </div>
          )}
        </div>
        
        <div className="divider" />
        <button 
          className="translate-toolbar-button"
          onClick={handleTranslateClick}
          disabled={isTranslating}
          title="Translate to Brahmi"
        >
          {isTranslating ? (
            <>
              <Icon name="Loader2" size={18} className="spinning" />
              Translating...
            </>
          ) : (
            <>
              <Icon name="ArrowRight" size={18} />
              Translate
            </>
          )}
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

        {/* Translation Output Section */}
        <div className="translation-section">
          <div className="section-header">
            <h3 className="section-title">Translation Output</h3>
            <div className="section-controls">
              <button 
                className="copy-translation-button"
                onClick={copyTranslationWithFormatting}
                disabled={!translation}
                title="Copy translation with formatting"
              >
                <Icon name="Copy" size={16} />
                Copy
              </button>
              <div className="language-toggle">
                <button 
                  className={`toggle-option ${outputLanguage === 'brahmi' ? 'active' : ''}`}
                  onClick={() => setOutputLanguage('brahmi')}
                >
                  Brahmi
                </button>
                <button 
                  className={`toggle-option ${outputLanguage === 'hindi' ? 'active' : ''}`}
                  onClick={() => setOutputLanguage('hindi')}
                >
                  Hindi
                </button>
              </div>
            </div>
          </div>
          <div 
            className={`translation-output ${outputLanguage === 'brahmi' ? 'brahmi-font' : 'hindi-font'}`}
            dangerouslySetInnerHTML={{
              __html: translation || `<span class="placeholder-text">
                Click "Translate" in the toolbar to see ${outputLanguage === 'brahmi' ? 'Brahmi' : 'Hindi'} translation here...
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
