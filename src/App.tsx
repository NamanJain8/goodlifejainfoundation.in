import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Tools from './components/sections/Tools';
import Resources from './components/sections/Resources';
import Gallery from './components/sections/Gallery';
import Translator from './components/sections/Translator';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Tools />
        <Resources />
        <About />
        <Gallery />
        <Translator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
