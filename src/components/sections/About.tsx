import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import { timelineData, spiritualContent } from '../../utils/data';
import { fastVariants } from '../../hooks/useScrollAnimation';

const About: React.FC = () => {
  return (
    <Section id="about" variant="alt">
      {/* Section Header */}
              <motion.div
        variants={fastVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-12 sm:mb-16 px-4 sm:px-0"
      >
        <p className="section-subtitle">The Sacred Origin</p>
        <h2 className="section-title">
          The Story of <span className="gradient-text">Brahmi Script</span>
        </h2>
        <p className="section-description">
          Discover the divine origin of Brahmi script through the teachings of Adinath Bhagwan 
          Rishabhdev Ji to his daughters Brahmi and Sundari.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 lg:gap-16 mb-12 sm:mb-16 lg:mb-20 px-4 sm:px-0"
      >
        {[
          { icon: Clock, label: 'Ancient Origin', value: '5000+ Years' },
          { icon: BookOpen, label: 'Scripts Derived', value: '200+' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <stat.icon size={20} className="text-dark-950 sm:hidden" />
              <stat.icon size={24} className="text-dark-950 hidden sm:block" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-primary-500 mb-1 sm:mb-2">{stat.value}</div>
            <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Spiritual Heritage Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-12 sm:mb-16 lg:mb-20 px-4 sm:px-0"
      >
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-3 sm:mb-4">
            <span className="gradient-text">Spiritual Heritage</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Sacred terms and greetings preserved through the ancient Brahmi script.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            spiritualContent.greetings.jayJinendra,
            spiritualContent.greetings.namaskaar,
            spiritualContent.greetings.ahimsa,
            spiritualContent.greetings.dharma,
            spiritualContent.greetings.moksha,
            spiritualContent.greetings.shanti,
            spiritualContent.jainTerms.tirthankar,
            spiritualContent.jainTerms.acharya,
            spiritualContent.jainTerms.sant,
          ].map((term, index) => (
            <motion.div
              key={term.english}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="hover-lift" className="p-4 sm:p-6 text-center">
                <div className="text-primary-400 font-brahmi text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3">
                  {term.brahmi}
                </div>
                <div className="text-white font-medium mb-1 text-sm sm:text-base" style={{ fontFamily: 'Noto Sans Devanagari, serif' }}>
                  {term.hindi}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  {term.english}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline - Horizontal Swipe on Mobile, Vertical on Desktop */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-0">
        {/* Mobile Horizontal Timeline */}
        <div className="block lg:hidden mb-8">
          <h3 className="text-xl font-serif font-semibold text-center mb-6">
            <span className="gradient-text">The Origin Story</span>
          </h3>
          <p className="text-gray-400 text-sm text-center mb-6">
            Swipe to explore the complete story
          </p>
          
          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4" style={{ width: `${timelineData.length * 300}px` }}>
              {timelineData.map((item, index) => (
                <motion.div
                  key={`mobile-${item.id}`}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-72 bg-surface-200 rounded-xl p-4 border border-surface-100 timeline-card"
                >
                  {/* Step Number */}
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-dark-950 font-bold text-sm mr-3">
                      {item.id}
                    </div>
                    <h4 className="text-primary-400 font-medium text-sm flex-1">{item.title}</h4>
                  </div>
                  
                  {/* Image */}
                  {item.image && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {/* Description */}
                  <div className="space-y-2">
                    {Array.isArray(item.description) ? (
                      item.description.map((paragraph, index) => (
                        <p key={index} className="text-gray-300 text-xs leading-relaxed">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              {timelineData.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 bg-primary-500/30 rounded-full transition-all duration-200"
                />
              ))}
            </div>
            <p className="ml-3 text-gray-400 text-xs self-center">
              {timelineData.length} chapters
            </p>
          </div>
        </div>

        {/* Desktop Vertical Timeline */}
        <div className="hidden lg:block">
          {/* Vertical line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-600 transform md:-translate-x-1/2 z-0"
          />

          <div className="space-y-12 lg:space-y-16">
            {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Number - Removed */}
              
              {/* Desktop Layout */}
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-16 items-center">
                  {/* Left Column */}
                  <div className="flex justify-end pr-8">
                    {index % 2 === 0 ? (
                      // Content on left for even items
                      <div className="w-full max-w-md">
                        <Card variant="hover-lift">
                          <div className="p-6">
                            <h3 className="text-xl font-serif font-semibold text-primary-400 mb-3">
                              {item.title}
                            </h3>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                              {Array.isArray(item.description) ? (
                                item.description.map((paragraph, index) => (
                                  <p key={index}>{paragraph}</p>
                                ))
                              ) : (
                                <p>{item.description}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    ) : (
                      // Image on left for odd items
                      item.image && (
                        <div className="w-full max-w-md">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative overflow-hidden rounded-xl shadow-2xl"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                              
                              {/* Image Overlay with Title */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-white font-medium text-sm">
                                  {item.id}: {item.title}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="flex justify-start pl-8">
                    {index % 2 === 0 ? (
                      // Image on right for even items
                      item.image && (
                        <div className="w-full max-w-md">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative overflow-hidden rounded-xl shadow-2xl"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                              
                              {/* Image Overlay with Title */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-white font-medium text-sm">
                                  {item.id}: {item.title}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )
                    ) : (
                      // Content on right for odd items
                      <div className="w-full max-w-md">
                        <Card variant="hover-lift">
                          <div className="p-6">
                            <h3 className="text-xl font-serif font-semibold text-primary-400 mb-3">
                              {item.title}
                            </h3>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                              {Array.isArray(item.description) ? (
                                item.description.map((paragraph, index) => (
                                  <p key={index}>{paragraph}</p>
                                ))
                              ) : (
                                <p>{item.description}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden ml-12 space-y-4">
                {/* Content */}
                <Card variant="hover-lift">
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-primary-400 mb-3">
                      {item.title}
                    </h3>
                    <div className="text-gray-300 leading-relaxed space-y-3">
                      {Array.isArray(item.description) ? (
                        item.description.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))
                      ) : (
                        <p>{item.description}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Image */}
                {item.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative overflow-hidden rounded-xl shadow-2xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      
                      {/* Image Overlay with Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white font-medium text-sm">
                          {item.id}: {item.title}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-0"
      >
        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-2xl p-6 sm:p-8 border border-primary-500/20">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-3 sm:mb-4">
            Experience the Ancient Wisdom
          </h3>
          <p className="text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join us in preserving this sacred heritage. Use our modern tools to learn and translate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.querySelector('#tools');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary"
            >
              Explore Tools
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.querySelector('#resources');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-outline"
            >
              View Resources
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default About; 