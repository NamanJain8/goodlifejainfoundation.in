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
import AppInstallBanner from './components/ui/AppInstallBanner';
import './components/ui/AppInstallBanner.css';

declare global {
  interface Window {
    keyman?: any;
  }
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppInstallBanner />
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
              <Translator />
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
