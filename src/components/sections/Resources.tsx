import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { resourcesData } from '../../utils/data';

const Resources: React.FC = () => {
  const handleResourceClick = (resource: typeof resourcesData[0]) => {
    if (resource.link) {
      window.open(resource.link, '_blank');
    }
  };

  return (
    <Section id="resources">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="section-subtitle">Spiritual Resources</p>
        <h2 className="section-title">
          Sacred <span className="gradient-text">Jain Heritage</span>
        </h2>
        <p className="section-description">
          Explore our comprehensive collection of Jain spiritual resources including 
          scriptures, dictionary, and pilgrimage sites to deepen your knowledge and faith.
        </p>
      </motion.div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {resourcesData.map((resource, index) => (
          <motion.div
            key={resource.id}
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
                  <Icon name={resource.icon} size={24} className="text-dark-950" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-serif font-semibold text-primary-400 mb-3">
                  {resource.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {resource.description}
                </p>

                {/* Action Button */}
                <Button
                  variant="outline"
                  onClick={() => handleResourceClick(resource)}
                  className="w-full group"
                >
                  <span>Explore Resource</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mt-16"
      >
        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-2xl p-8 border border-primary-500/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif font-semibold mb-4">
            Preserving Ancient Wisdom
          </h3>
          <p className="text-gray-400 mb-6">
            These resources represent centuries of Jain spiritual knowledge and tradition. 
            Access authentic scriptures, comprehensive dictionaries, and sacred pilgrimage 
            sites to enhance your spiritual journey and understanding of Jain dharma.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-xl font-bold text-primary-500 mb-1">Complete</div>
              <div className="text-gray-400 text-sm">Agam Scriptures Collection</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary-500 mb-1">Authentic</div>
              <div className="text-gray-400 text-sm">Traditional Sources Only</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary-500 mb-1">Accessible</div>
              <div className="text-gray-400 text-sm">Free Digital Access</div>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default Resources; 