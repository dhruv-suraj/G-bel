import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Comparison from './components/Comparison';
import Features from './components/Features';
import UseCases from './components/UseCases';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import VoiceDemo from './components/VoiceDemo';
import Loader from './components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [loading, setLoading] = useState(true);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Prevent scroll during load
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div 
          className="min-h-screen bg-obsidian font-sans text-ghost selection:bg-blaze selection:text-obsidian"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Header onOpenDemo={() => setIsDemoOpen(true)} />
          
          <main>
            <Hero onOpenDemo={() => setIsDemoOpen(true)} />
            <Comparison />
            <Features />
            <UseCases />
            <WhyChooseUs />
          </main>

          <Footer />
          
          <VoiceDemo 
            isOpen={isDemoOpen} 
            onClose={() => setIsDemoOpen(false)} 
          />
        </motion.div>
      )}
    </>
  );
}

export default App;