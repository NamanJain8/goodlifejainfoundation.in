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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="section-subtitle">Digital Tools</p>
        <h2 className="section-title">
          Modern <span className="gradient-text">Learning Tools</span>
        </h2>
        <p className="section-description">
          Explore our comprehensive suite of digital tools designed to make learning 
          and using Brahmi script accessible, engaging, and enjoyable for everyone.
        </p>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {toolsData.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            <Card variant="hover-lift" className="h-full">
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Icon name={tool.icon} size={24} className="text-dark-950" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-serif font-semibold text-primary-400 mb-3">
                  {tool.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                {/* Action Button */}
                <Button
                  variant={tool.isWidget ? "primary" : "outline"}
                  onClick={() => handleToolClick(tool)}
                  className="w-full group"
                >
                  <span>
                    {tool.isWidget ? 'Try Now' : 'Open Tool'}
                  </span>
                  {tool.link && (
                    <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>

                {/* Special Badge for Widget */}
                {tool.isWidget && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    Live
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Tools; 