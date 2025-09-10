import React, { useState } from 'react';
import { Mail, Facebook, Instagram, Youtube, Smartphone, Heart, MessageSquare } from 'lucide-react';
import { socialLinks, contactInfo } from '../../utils/data';
import FeedbackModal from '../ui/FeedbackModal';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    playStore: Smartphone,
  };

  return (
    <footer id="contact" className="bg-surface-300 border-t border-surface-100">
      <div className="container py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-dark-950 font-bold text-xl font-brahmi">𑀩</span>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold gradient-text">
                  Good Life Jain Foundation
                </h3>
                <p className="text-sm text-gray-400">Reviving Brahmi Script</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Dedicated to preserving and reviving the ancient Brahmi script through modern 
              technology and educational initiatives. Join us in keeping this sacred heritage alive.
            </p>

            <div className="mb-6">
              <p className="text-primary-400 text-sm mb-2">Under the Guidance of</p>
              <div className="space-y-1">
                <p className="text-primary-200 font-serif text-base" style={{ fontFamily: 'Noto Sans Devanagari, serif' }}>
                  {contactInfo.guidanceHindi}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {Object.entries(socialLinks).map(([platform, url]) => {
                const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-surface-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-primary-400 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About Brahmi', href: '#about' },
                { label: 'Translator', href: '#translator' },
                { label: 'Tools', href: '#tools' },
                { label: 'Resources', href: '#resources' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      const element = document.querySelector(link.href);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-300 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-primary-400 mb-6">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-primary-500" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-300 hover:text-primary-500 transition-colors duration-200"
                >
                  {contactInfo.email}
                </a>
              </div>
              
              {/* Feedback Button */}
              <div className="pt-2">
                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <MessageSquare size={16} />
                  <span>Share Your Thoughts</span>
                </button>
              </div>
            </div>

            {/* Brahmi Script Display */}
            <div className="mt-8 p-4 bg-surface-200 rounded-lg border border-surface-100">
              <p className="text-sm text-gray-400 mb-2">Brahmi Script</p>
              <div className="text-2xl font-brahmi text-primary-400">
                𑀦𑀫𑀲𑁆𑀓𑀸𑀭
              </div>
              <p className="text-xs text-gray-500 mt-1">Namaskaar (Greetings)</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Good Life Jain Foundation. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-red-500" />
            <span>for preserving ancient wisdom</span>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Share Your Feedback"
      />
    </footer>
  );
};

export default Footer; 