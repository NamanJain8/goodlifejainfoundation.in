// Formatted translation utilities that preserve HTML formatting

import { translateMixedTextToBrahmi, translateMixedTextToHindi } from './languageDetection';

// Extract text content from HTML while preserving structure
interface TextNode {
  text: string;
  path: number[]; // Path to the text node in the DOM tree
  parentTags: string[]; // Stack of parent HTML tags
}

// Parse HTML and extract text nodes with their formatting context
const extractTextNodes = (html: string): TextNode[] => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const textNodes: TextNode[] = [];
  
  // Recursive function to traverse DOM and extract text nodes
  const traverse = (node: Node, path: number[] = [], parentTags: string[] = []): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) { // Only include non-empty text nodes
        textNodes.push({
          text: text,
          path: [...path],
          parentTags: [...parentTags]
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      // Add current tag to parent stack
      const newParentTags = [...parentTags, tagName];
      
      // Traverse children
      Array.from(node.childNodes).forEach((child, index) => {
        traverse(child, [...path, index], newParentTags);
      });
    }
  };
  
  traverse(tempDiv);
  return textNodes;
};

// Rebuild HTML with translated text while preserving structure
const rebuildHTMLWithTranslation = (
  originalHtml: string, 
  textNodes: TextNode[], 
  translatedTexts: string[]
): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHtml;
  
  // Map to store translations by text content
  const translationMap = new Map<string, string>();
  textNodes.forEach((node, index) => {
    if (translatedTexts[index]) {
      translationMap.set(node.text, translatedTexts[index]);
    }
  });
  
  // Recursive function to replace text content
  const replaceTextContent = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const originalText = node.textContent || '';
      if (originalText.trim() && translationMap.has(originalText)) {
        node.textContent = translationMap.get(originalText) || originalText;
      }
    } else {
      // Traverse children
      Array.from(node.childNodes).forEach(child => {
        replaceTextContent(child);
      });
    }
  };
  
  replaceTextContent(tempDiv);
  return tempDiv.innerHTML;
};

// Translate HTML content while preserving all formatting
export const translateFormattedTextToBrahmi = async (html: string): Promise<string> => {
  if (!html.trim()) return '';
  
  try {
    // Extract text nodes with their formatting context
    const textNodes = extractTextNodes(html);
    
    if (textNodes.length === 0) return html;
    
    // Translate each text node
    const translatedTexts: string[] = [];
    
    for (const textNode of textNodes) {
      try {
        const translated = await translateMixedTextToBrahmi(textNode.text);
        translatedTexts.push(translated);
      } catch (error) {
        console.error('Failed to translate text node:', textNode.text, error);
        // Fallback to original text if translation fails
        translatedTexts.push(textNode.text);
      }
    }
    
    // Rebuild HTML with translated text
    const translatedHtml = rebuildHTMLWithTranslation(html, textNodes, translatedTexts);
    
    return translatedHtml;
  } catch (error) {
    console.error('Formatted translation failed:', error);
    throw error;
  }
};

// Translate HTML content to Hindi while preserving all formatting
export const translateFormattedTextToHindi = async (html: string): Promise<string> => {
  if (!html.trim()) return '';
  
  try {
    // Extract text nodes with their formatting context
    const textNodes = extractTextNodes(html);
    
    if (textNodes.length === 0) return html;
    
    // Translate each text node
    const translatedTexts: string[] = [];
    
    for (const textNode of textNodes) {
      try {
        const translated = await translateMixedTextToHindi(textNode.text);
        translatedTexts.push(translated);
      } catch (error) {
        console.error('Failed to translate text node to Hindi:', textNode.text, error);
        // Fallback to original text if translation fails
        translatedTexts.push(textNode.text);
      }
    }
    
    // Rebuild HTML with translated text
    const translatedHtml = rebuildHTMLWithTranslation(html, textNodes, translatedTexts);
    
    return translatedHtml;
  } catch (error) {
    console.error('Formatted translation to Hindi failed:', error);
    throw error;
  }
};

// Alternative approach using regex for simpler HTML structures
export const translateSimpleFormattedText = async (html: string): Promise<string> => {
  if (!html.trim()) return '';
  
  try {
    // Regular expression to match text content outside of HTML tags
    const textRegex = />([^<]+)</g;
    const matches: Array<{ text: string; fullMatch: string }> = [];
    
    let match;
    while ((match = textRegex.exec(html)) !== null) {
      if (match[1].trim()) {
        matches.push({
          text: match[1],
          fullMatch: match[0]
        });
      }
    }
    
    // Translate each text segment
    let translatedHtml = html;
    
    for (const match of matches) {
      try {
        const translated = await translateMixedTextToBrahmi(match.text);
        const newMatch = match.fullMatch.replace(match.text, translated);
        translatedHtml = translatedHtml.replace(match.fullMatch, newMatch);
      } catch (error) {
        console.error('Failed to translate text segment:', match.text, error);
        // Keep original text if translation fails
      }
    }
    
    return translatedHtml;
  } catch (error) {
    console.error('Simple formatted translation failed:', error);
    throw error;
  }
};

// Clean and optimize HTML for better display
export const cleanTranslatedHTML = (html: string): string => {
  return html
    // Remove empty paragraphs
    .replace(/<p><\/p>/g, '')
    // Remove excessive line breaks
    .replace(/(<br\s*\/?>){3,}/g, '<br><br>')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
}; 