import React from 'react';
import { motion } from 'framer-motion';
import Scene from './Scene';

interface HeroProps {
  onOpenDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden bg-obsidian py-20">
      {/* Background radial gradient to ground the node */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,77,0,0.12)_0%,transparent_70%)] pointer-events-none" />
      
      {/* The 3D Neural Node */}
      <Scene />

      <div className="max-w-[1400px] mx-auto w-full px-8 relative z-10 pointer-events-none">
        <div className="flex flex-col items-start lg:w-1/2">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 pointer-events-auto"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-[1px] bg-blaze"></div>
              <span className="font-mono text-[10px] tracking-[0.8em] text-blaze uppercase font-bold">
                EST. 2025 // NODE_CONNECTED
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="pointer-events-auto"
          >
            <h1 className="text-7xl md:text-[12rem] font-serif font-black text-ghost leading-[0.8] tracking-tighter mb-4">
              GRAHAM<br/>
              <span className="text-outline italic">BELL.</span>
            </h1>
          </motion.div>

          <div className="mt-16 flex flex-col md:flex-row items-start md:items-end space-y-12 md:space-y-0 md:space-x-20 w-full pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-xs"
            >
              <div className="mb-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest">[ NEURAL_CORE_V2 ]</div>
              <p className="text-ghost/60 font-mono text-xs leading-relaxed uppercase tracking-tight">
                An interactive voice interface for the sovereign enterprise. Absolute precision. Infinite scale. No human debt.
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenDemo}
              className="px-16 py-8 bg-blaze text-obsidian font-serif italic text-3xl font-black rounded-none transition-all relative overflow-hidden group shadow-[0_0_80px_rgba(255,77,0,0.2)]"
            >
              <span className="relative z-10">INITIATE_SYNC</span>
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
    </section>
  );
};

export default Hero;
