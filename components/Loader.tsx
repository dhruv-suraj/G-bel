import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian text-white overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, transition: { delay: 2.5, duration: 0.5 } }}
      onAnimationComplete={onComplete}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 animate-pulse pointer-events-none"></div>
      
      <motion.div
        initial={{ scaleX: 0, height: 2 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-white relative z-10"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-4 text-center"
      >
        <h1 className="text-4xl md:text-8xl font-serif font-black tracking-tighter italic mb-4">
          GRAHAM BELL
        </h1>
        <div className="overflow-hidden">
          <motion.p 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="font-mono text-xs text-blaze tracking-[1em] uppercase"
          >
            [ INITIALIZING PROTOCOL ]
          </motion.p>
        </div>
      </motion.div>

      {/* Screen glitch line */}
      <motion.div 
        className="absolute w-full h-px bg-blaze opacity-50"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default Loader;