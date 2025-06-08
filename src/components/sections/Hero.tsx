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
      <div className="relative z-20 container text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Brahmi Script Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <div className="text-6xl md:text-8xl font-brahmi text-primary-500 mb-4 animate-float">
              𑀩𑁆𑀭𑀸𑀳𑁆𑀫𑀻 𑀮𑀺𑀧𑀺
            </div>
            <p className="text-primary-400 text-lg">Brahmi Lipi</p>
            <p className="text-primary-100 text-lg">Mother of all scripts</p>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-shadow"
          >
            Reviving the{' '}
            <span className="gradient-text">Ancient Brahmi</span>{' '}
            Script
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Preserving the sacred heritage of Brahmi script through modern technology. 
            Learn, translate, and connect with the ancient wisdom of our ancestors.
          </motion.p>

          {/* Guidance Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mb-10"
          >
            <p className="text-primary-400 text-sm mb-2">Under the Guidance of</p>
            <div className="space-y-1">
              <p className="text-lg font-serif text-primary-200" style={{ fontFamily: 'Noto Sans Devanagari, serif' }}>
                {spiritualContent.guidance.hindi}
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href={heroVideoUrl}
              data-lity=""
              className="inline-flex items-center gap-2 px-6 py-3 font-medium text-center border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-dark-950 rounded-lg transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 focus:ring-primary-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              <span>Watch Story</span>
            </motion.a>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 