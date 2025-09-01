import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { toolsData } from '../../utils/data';

const Tools: React.FC = () => {
  const handleToolClick = (tool: typeof toolsData[0]) => {
    if (tool.link) {
      window.open(tool.link, '_blank');
    } else if (tool.isWidget) {
      // Scroll to translator section
      const element = document.querySelector('#translator');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Section id="tools" variant="alt">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
        <p className="section-subtitle">Digital Tools</p>
        <h2 className="section-title">
          Modern <span className="gradient-text">Learning Tools</span>
        </h2>
        <p className="section-description">
          Explore our digital tools designed to make learning Brahmi script accessible and engaging.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
        {toolsData.map((tool, index) => (
          <div key={tool.id}>
            <Card variant="hover-lift" className="h-full">
              <div className="text-center p-4 sm:p-6">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                >
                  <Icon name={tool.icon} size={20} className="text-dark-950 sm:hidden" />
                  <Icon name={tool.icon} size={24} className="text-dark-950 hidden sm:block" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-primary-400 mb-2 sm:mb-3">
                  {tool.title}
                </h3>
                
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  {tool.description}
                </p>

                {/* Action Button */}
                <Button
                  variant={tool.isWidget ? "primary" : "outline"}
                  onClick={() => handleToolClick(tool)}
                  className="w-full group text-sm sm:text-base py-2 sm:py-3"
                >
                  <span>
                    {tool.isWidget ? 'Try Now' : 'Open Tool'}
                  </span>
                  {tool.link && (
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform sm:hidden" />
                  )}
                  {tool.link && (
                    <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform hidden sm:block" />
                  )}
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Tools; 