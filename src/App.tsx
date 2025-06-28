import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Tools from './components/sections/Tools';
import Resources from './components/sections/Resources';
import Gallery from './components/sections/Gallery';
import Translator from './components/sections/Translator';
import BrahmiEditor from './components/editor/BrahmiEditor';

declare global {
  interface Window {
    keyman?: any;
  }
}

function App() {
  const [keymanReady, setKeymanReady] = useState(false);

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeKeyman = async () => {
      try {
        // 1. Load the core engine first.
        await loadScript('https://s.keyman.com/kmw/engine/18.0.238/keymanweb.js');
        
        if (window.keyman) {
          // 2. Initialize the core engine, but disable its default UI.
          await window.keyman.init({ ui: 'none', attachType: 'manual' });

          // 3. Load all keyboards.
          await window.keyman.addKeyboards('@en');
          await window.keyman.addKeyboards('@hi'); 
          await window.keyman.addKeyboards('@gu');
          await window.keyman.addKeyboards('@bn');
          await window.keyman.addKeyboards('@ta');
          await window.keyman.addKeyboards('@te');
          await window.keyman.addKeyboards('@ml');
          await window.keyman.addKeyboards('@kn');
          await window.keyman.addKeyboards('@or');
          await window.keyman.addKeyboards('@pa');
          await window.keyman.addKeyboards('@mr');
          await window.keyman.addKeyboards('@ur');
          await window.keyman.addKeyboards('@ne');
          await window.keyman.addKeyboards('@si');
          await window.keyman.addKeyboards('@sa-brah');
          await window.keyman.addKeyboards('@sa-deva');

          setKeymanReady(true);
        }
      } catch (error) {
        console.error("Keyman failed to initialize:", error);
      }
    };

    initializeKeyman();
  }, []);

  if (!keymanReady) {
    return <div>Loading resources...</div>; // Or a proper loading spinner
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<BrahmiEditor />} />
        <Route path="/" element={
          <>
            <Header />
            <main>
              <Hero />
              <Tools />
              <Resources />
              <About />
              <Gallery />
              {keymanReady && <Translator />}
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
