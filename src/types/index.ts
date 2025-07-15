// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  target?: string;
}

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'alt';
  id?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover-lift';
}

// Timeline Types
export interface TimelineItem {
  id: number;
  title: string;
  description: string | string[];
  image?: string;
}

// Tool Types
export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
  isWidget?: boolean;
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

// Gallery Types
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

// Contact Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Translation Types
export interface TranslationMapping {
  [key: string]: string;
}

export interface TranslatorState {
  inputText: string;
  outputText: string;
  inputLanguage: 'hi' | 'en';
  isTranslating: boolean;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Notification Types
export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

// Animation Types
export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    sans: string;
    serif: string;
    brahmi: string;
  };
} 