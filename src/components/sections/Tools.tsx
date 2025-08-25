import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { toolsData } from '../../utils/data';
import { fastVariants, staggerContainer } from '../../hooks/useScrollAnimation';

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
        variants={fastVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
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
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {toolsData.map((tool, index) => (
          <motion.div
            key={tool.id}
            variants={fastVariants}
          >
            <Card variant="hover-lift" className="h-full">
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
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
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Tools; 