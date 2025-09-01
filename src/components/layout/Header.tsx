import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navigationItems, toolsData } from '../../utils/data';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    
    if (href.startsWith('#')) {
      // Check if this is a tool link that should open externally
      const toolId = href.substring(1); // Remove the #
      const tool = toolsData.find(t => t.id === toolId);
      
      if (tool && tool.link) {
        // Open external link
        window.open(tool.link, '_blank');
      } else if (tool && tool.isWidget) {
        // Navigate to translator for widget tools
        const element = document.querySelector('#translator');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Normal section navigation
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Good Life Jain Foundation Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-serif font-bold gradient-text">
                Good Life Jain Foundation
              </h1>
              <p className="text-xs text-gray-400">Reviving Brahmi Script</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 text-gray-300 hover:text-primary-500 transition-colors duration-200">
                      <span>{item.label}</span>
                      <ChevronDown size={16} />
                    </button>
                    
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-surface-200 rounded-lg shadow-xl border border-surface-100 py-2">
                          {item.children.map((child) => (
                            <button
                              key={child.label}
                              onClick={() => handleNavClick(child.href)}
                              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-primary-500 hover:bg-surface-100 transition-colors duration-200"
                            >
                              {child.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="text-gray-300 hover:text-primary-500 transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              variant="primary"
              onClick={() => handleNavClick('#translator')}
            >
              Try Translator
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden backdrop-blur-glass border-t border-surface-100">
            <div className="container py-4">
              <nav className="space-y-4">
                {navigationItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => setActiveDropdown(
                            activeDropdown === item.label ? null : item.label
                          )}
                          className="flex items-center justify-between w-full text-left text-gray-300 hover:text-primary-500 transition-colors duration-200"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`transform transition-transform duration-200 ${
                              activeDropdown === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {activeDropdown === item.label && (
                          <div className="mt-2 ml-4 space-y-2">
                              {item.children.map((child) => (
                                <button
                                  key={child.label}
                                  onClick={() => handleNavClick(child.href)}
                                  className="block text-gray-400 hover:text-primary-500 transition-colors duration-200"
                                >
                                  {child.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="block text-gray-300 hover:text-primary-500 transition-colors duration-200"
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
                
                <div className="pt-4">
                  <Button
                    variant="primary"
                    onClick={() => handleNavClick('#translator')}
                    className="w-full"
                  >
                    Try Translator
                  </Button>
                </div>
              </nav>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header; 