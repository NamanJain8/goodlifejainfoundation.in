import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { heroVideoUrl, spiritualContent } from '../../utils/data';

const Hero: React.FC = () => {
  useEffect(() => {
    // Initialize Lity - dynamic import to avoid TypeScript issues
    import('lity').catch(console.error);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/brahmi.jpeg)',
          }}
        />
        {/* Lighter overlay for better image visibility while maintaining text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Brahmi Script Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-brahmi text-primary-500 mb-3 sm:mb-4 animate-float">
              𑀩𑁆𑀭𑀸𑀳𑁆𑀫𑀻 𑀮𑀺𑀧𑀺
            </div>
            <p className="text-primary-400 text-base sm:text-lg">Brahmi Lipi</p>
            <p className="text-primary-100 text-base sm:text-lg">Mother of all scripts</p>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-4 sm:mb-6 text-shadow leading-tight"
          >
            Reviving the{' '}
            <span className="gradient-text">Ancient Brahmi</span>{' '}
            Script
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Preserving the sacred heritage of Brahmi script through modern technology. 
            Learn, translate, and connect with the ancient wisdom of our ancestors.
          </motion.p>

          {/* Guidance Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mb-8 sm:mb-10 px-4 sm:px-0"
          >
            <p className="text-primary-400 text-xs sm:text-sm mb-2">Under the Guidance of</p>
            <div className="space-y-1">
              <p className="text-sm sm:text-base md:text-lg font-serif text-primary-200" style={{ fontFamily: 'Noto Sans Devanagari, serif' }}>
                {spiritualContent.guidance.hindi}
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0"
          >
            <motion.a
              href={heroVideoUrl}
              data-lity=""
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-center border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-dark-950 rounded-lg transition-all duration-200 ease-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 focus:ring-primary-500 w-full sm:w-auto text-sm sm:text-base"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
            >
              <Play size={18} className="group-hover:scale-105 transition-transform duration-150" />
              <span>Watch Story</span>
            </motion.a>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 