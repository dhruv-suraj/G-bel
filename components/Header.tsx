import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onOpenDemo: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenDemo }) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-[60] py-8 px-8 flex justify-between items-center mix-blend-difference"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <div className="flex items-baseline space-x-2">
        <span className="font-serif font-black text-2xl tracking-tighter text-white italic">GB.</span>
        <span className="font-mono text-[8px] tracking-[0.3em] text-white opacity-40 uppercase">Voice Intel</span>
      </div>

      <nav className="hidden lg:flex space-x-12">
        {['INTEL', 'CASES', 'ABOUT'].map((item) => (
          <a key={item} href="#" className="font-mono text-[10px] tracking-widest text-white hover:text-blaze transition-colors">{item}</a>
        ))}
      </nav>

      <button 
        onClick={onOpenDemo}
        className="font-serif font-bold italic text-white text-sm border-b-2 border-blaze pb-1 hover:text-blaze transition-colors"
      >
        INITIATE //
      </button>
    </motion.header>
  );
};

export default Header;