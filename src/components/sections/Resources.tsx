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
      <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
        <p className="section-subtitle">Spiritual Resources</p>
        <h2 className="section-title">
          Sacred <span className="gradient-text">Jain Heritage</span>
        </h2>
        <p className="section-description">
          Explore our collection of Jain spiritual resources including scriptures and pilgrimage sites.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4 sm:px-0">
        {resourcesData.map((resource, index) => (
          <div key={resource.id}>
            <Card variant="hover-lift" className="h-full">
              <div className="text-center p-4 sm:p-6">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                >
                  <Icon name={resource.icon} size={20} className="text-dark-950 sm:hidden" />
                  <Icon name={resource.icon} size={24} className="text-dark-950 hidden sm:block" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-primary-400 mb-2 sm:mb-3">
                  {resource.title}
                </h3>
                
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  {resource.description}
                </p>

                {/* Action Button */}
                <Button
                  variant="outline"
                  onClick={() => handleResourceClick(resource)}
                  className="w-full group text-sm sm:text-base py-2 sm:py-3"
                >
                  <span>Explore Resource</span>
                  <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform sm:hidden" />
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform hidden sm:block" />
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12 sm:mt-16 px-4 sm:px-0">
        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-2xl p-6 sm:p-8 border border-primary-500/20 max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-3 sm:mb-4">
            Preserving Ancient Wisdom
          </h3>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
            These resources represent centuries of Jain spiritual knowledge and tradition.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-lg sm:text-xl font-bold text-primary-500 mb-1">Complete</div>
              <div className="text-gray-400 text-xs sm:text-sm">Agam Scriptures Collection</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-primary-500 mb-1">Authentic</div>
              <div className="text-gray-400 text-xs sm:text-sm">Traditional Sources Only</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-primary-500 mb-1">Accessible</div>
              <div className="text-gray-400 text-xs sm:text-sm">Free Digital Access</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Resources; 