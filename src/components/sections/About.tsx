import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Users, Scroll } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import { timelineData, spiritualContent } from '../../utils/data';

const About: React.FC = () => {
  return (
    <Section id="about" variant="alt">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="section-subtitle">The Sacred Origin</p>
        <h2 className="section-title">
          The Story of <span className="gradient-text">Brahmi Script</span>
        </h2>
        <p className="section-description">
          Discover the divine origin of Brahmi script through the teachings of Adinath Bhagwan 
          Rishabhdev Ji to his daughters Brahmi and Sundari. A journey through time revealing 
          the foundation of all written communication.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
      >
        {[
          { icon: Clock, label: 'Ancient Origin', value: '5000+ Years' },
          { icon: BookOpen, label: 'Scripts Derived', value: '200+' },
          { icon: Users, label: 'Languages Supported', value: '50+' },
          { icon: Scroll, label: 'Historical Steps', value: '8' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <stat.icon size={24} className="text-dark-950" />
            </div>
            <div className="text-2xl font-bold text-primary-500 mb-2">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Spiritual Heritage Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-20"
      >
        <div className="text-center mb-12">
          <h3 className="text-2xl font-serif font-semibold mb-4">
            <span className="gradient-text">Spiritual Heritage</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sacred terms and greetings preserved through the ancient Brahmi script, 
            connecting us to our spiritual roots and timeless wisdom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Card variant="hover-lift" className="p-6 text-center">
                <div className="text-primary-400 font-brahmi text-2xl mb-3">
                  {term.brahmi}
                </div>
                <div className="text-white font-medium mb-1" style={{ fontFamily: 'Noto Sans Devanagari, serif' }}>
                  {term.hindi}
                </div>
                <div className="text-gray-400 text-sm">
                  {term.english}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-7xl mx-auto">
        {/* Vertical line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-600 transform md:-translate-x-1/2 z-0"
        />

        <div className="space-y-16">
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
                            <p className="text-gray-300 leading-relaxed">
                              {item.description}
                            </p>
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
                            <p className="text-gray-300 leading-relaxed">
                              {item.description}
                            </p>
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
                    <p className="text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
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

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mt-20"
      >
        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-2xl p-8 border border-primary-500/20">
          <h3 className="text-2xl font-serif font-semibold mb-4">
            Experience the Ancient Wisdom
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join us in preserving this sacred heritage. Use our modern tools to learn, 
            translate, and connect with the timeless wisdom of Brahmi script.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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