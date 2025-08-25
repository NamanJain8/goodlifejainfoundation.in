import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Section from '../ui/Section';
import { galleryData } from '../../utils/data';
import { fastVariants, staggerContainer } from '../../hooks/useScrollAnimation';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <Section id="gallery" variant="alt">
      {/* Section Header */}
              <motion.div
        variants={fastVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-12 sm:mb-16 px-4 sm:px-0"
      >
        <p className="section-subtitle">Visual Journey</p>
        <h2 className="section-title">
          Sacred <span className="gradient-text">Gallery</span>
        </h2>
        <p className="section-description">
          Witness the beauty of Jain heritage through our curated collection.
        </p>
      </motion.div>

      {/* Mobile Horizontal Gallery */}
      <div className="block sm:hidden mb-8">
        <p className="text-gray-400 text-sm text-center mb-6">
          Swipe to explore our gallery
        </p>
        
        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-4 pb-4" style={{ width: `${galleryData.length * 280}px` }}>
            {galleryData.map((item, index) => (
              <motion.div
                key={`mobile-${item.id}`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-64 group relative overflow-hidden rounded-xl bg-surface-200 shadow-lg gallery-card"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Zoom Button */}
                  <motion.button
                    onClick={() => openLightbox(item.image)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-primary-500"
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                  >
                    <ZoomIn size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {galleryData.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-primary-500/30 rounded-full transition-all duration-200"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid Gallery */}
      <motion.div
        className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 sm:px-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <AnimatePresence>
          {galleryData.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fastVariants}
              className="group relative overflow-hidden rounded-xl bg-surface-200 shadow-lg hover:shadow-2xl transition-all duration-200"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {/* Zoom Button */}
                <motion.button
                  onClick={() => openLightbox(item.image)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                >
                  <ZoomIn size={20} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 400, duration: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] mx-2 sm:mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Gallery view"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              
              {/* Close Button */}
              <motion.button
                onClick={closeLightbox}
                className="absolute -top-8 sm:-top-12 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-150"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
              >
                <X size={20} className="sm:hidden" />
                <X size={24} className="hidden sm:block" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Gallery; 