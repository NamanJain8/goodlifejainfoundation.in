import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import { heroVideoUrl, spiritualContent } from '../../utils/data';
import { trackSectionView } from '../../utils/analytics';

const Hero: React.FC = () => {
  useEffect(() => {
    // Initialize Lity - dynamic import to avoid TypeScript issues
    import('lity').catch(console.error);
    
    // Track section view
    trackSectionView('hero');
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
        <div className="max-w-4xl mx-auto">
          {/* Brahmi Script Display */}
          <div className="mb-6 sm:mb-8">
            <div className="mb-3 sm:mb-4">
              <img 
                src="/assets/BrahmiLipi.png" 
                alt="Brahmi Lipi" 
                className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 mx-auto object-contain"
              />
            </div>
            <p className="text-primary-400 text-base sm:text-lg">Brahmi Lipi</p>
            <p className="text-primary-100 text-base sm:text-lg">Mother of all scripts</p>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-4 sm:mb-6 text-shadow leading-tight">
            Reviving the{' '}
            <span className="gradient-text">Ancient Brahmi</span>{' '}
            Script
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Preserving the sacred heritage of Brahmi script through modern technology. 
            Learn, translate, and connect with the ancient wisdom of our ancestors.
          </p>

          {/* Guidance Attribution */}
          <div className="mb-8 sm:mb-10 px-4 sm:px-0">
            <p className="text-primary-400 text-xs sm:text-sm mb-2">Under the Guidance of</p>
            <div className="space-y-1">
              <p className="text-sm sm:text-base md:text-lg font-serif text-primary-200" style={{ fontFamily: 'Noto Sans Devanagari, serif' }}>
                {spiritualContent.guidance.hindi}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0">
            <a
              href={heroVideoUrl}
              data-lity=""
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-center border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-dark-950 rounded-lg transition-all duration-200 ease-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 focus:ring-primary-500 w-full sm:w-auto text-sm sm:text-base hover:scale-105 active:scale-95"
            >
              <Play size={18} className="group-hover:scale-105 transition-transform duration-150" />
              <span>Watch Story</span>
            </a>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Hero; 