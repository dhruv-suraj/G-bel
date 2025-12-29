import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tightened coordinates to prevent bleed on any desktop resolution
const advantages = [
  { id: 1, text: "ELIMINATE AGENT TURNOVER.", x: -14, y: -26, align: "left" },
  { id: 2, text: "INFINITE CONCURRENT CALLS.", x: 14, y: -26, align: "right" },
  { id: 3, text: "REDACT OPERATIONAL DEBT.", x: -16, y: 0, align: "left" },
  { id: 4, text: "REAL-TIME SENTIMENT TRIAGE.", x: 16, y: 0, align: "right" },
  { id: 5, text: "PERFECT CONTEXT RETENTION.", x: -14, y: 26, align: "left" },
  { id: 6, text: "0.3s RESPONSE LATENCY.", x: 14, y: 26, align: "right" },
];

const NeuralConnection: React.FC<{ start: [number, number], end: [number, number], active: boolean }> = ({ start, end, active }) => {
  return (
    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0">
      <motion.path
        d={`M ${50 + start[0]} ${50 + start[1]} L ${50 + end[0]} ${50 + end[1]}`}
        stroke={active ? "#FF4D00" : "rgba(5, 5, 5, 0.04)"}
        strokeWidth={active ? "6" : "1"}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
};

const WhyChooseUs: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <section id="benefits" className="py-24 md:py-48 bg-white text-obsidian relative overflow-hidden">
      {/* Structural Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[length:32px_32px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />
      
      {/* Global Margin Breather */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 relative z-10">
        
        <div className="mb-20 text-center">
          <span className="font-mono text-[9px] font-bold tracking-[1.4em] text-blaze block mb-6 uppercase">[ BOUNDS_SECURED ]</span>
          <h2 className="text-4xl md:text-8xl font-serif font-black italic tracking-tighter leading-none uppercase">
            The Neural Edge.
          </h2>
        </div>

        {/* Mobile: Simple safe list */}
        <div className="flex md:hidden flex-col space-y-10">
           {advantages.map((adv) => (
             <div key={adv.id} className="border-l-4 border-blaze pl-5 py-1">
                <div className="font-mono text-[9px] text-blaze font-bold mb-1 uppercase opacity-60">REG_0{adv.id}</div>
                <h3 className="text-2xl font-serif font-black italic tracking-tighter leading-tight text-obsidian uppercase">
                  {adv.text}
                </h3>
             </div>
           ))}
        </div>

        {/* Desktop: Centered, constrained interactive map */}
        <div className="hidden md:block relative h-[700px] w-full max-w-5xl mx-auto">
          
          <div className="absolute inset-0 flex items-center justify-center">
            {/* SVG Connections Layer */}
            <div className="absolute inset-0">
              {advantages.map((adv) => (
                <NeuralConnection 
                  key={`line-${adv.id}`} 
                  start={[0, 0]} 
                  end={[adv.x, adv.y]} 
                  active={hoveredNode === adv.id} 
                />
              ))}
            </div>

            {/* Floating Identifier Hub */}
            <div className="relative z-50">
              <div className="flex flex-col items-center justify-center">
                 <span className="text-blaze font-serif font-black italic text-8xl md:text-[12rem] leading-none select-none">
                   GB.
                 </span>
                 <div className="font-mono text-[8px] tracking-[0.8em] font-bold text-obsidian/30 uppercase mt-4">STATION_001</div>
              </div>
            </div>

            {/* Advantages Nodes - Constrained Positions */}
            {advantages.map((adv) => (
              <motion.div
                key={adv.id}
                className="absolute z-40 cursor-crosshair"
                style={{ 
                  left: `${50 + adv.x}%`, 
                  top: `${50 + adv.y}%`,
                  // Fixed width for items to prevent them from growing past container bounds
                  width: '320px',
                  // Alignment logic that keeps the text within its half of the screen
                  transform: adv.align === 'left' ? 'translate(-100%, -50%)' : 'translate(0%, -50%)',
                  padding: adv.align === 'left' ? '0 3rem 0 0' : '0 0 0 3rem'
                }}
                onMouseEnter={() => setHoveredNode(adv.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className={`relative group ${adv.align === 'right' ? 'text-left' : 'text-right'}`}>
                  <div className="font-mono text-[8px] text-blaze font-bold mb-1 opacity-40 group-hover:opacity-100 uppercase tracking-widest">
                    SYS_0{adv.id}
                  </div>
                  
                  <h3 
                    className={`
                      text-xl md:text-2xl lg:text-3xl font-serif font-black tracking-tighter italic leading-none transition-all duration-300
                      ${hoveredNode === adv.id ? 'text-blaze scale-105' : 'text-obsidian'}
                    `}
                  >
                    {adv.text}
                  </h3>

                  {/* High-visibility active state conduit */}
                  <AnimatePresence>
                    {hoveredNode === adv.id && (
                      <motion.div 
                        layoutId="active-marker"
                        className="h-1 bg-blaze mt-3 w-full origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Technical Registry Data */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 border-t border-obsidian/10 pt-10">
           {[
             { k: "TOPOLOGY", v: "SAFE_ZONE_ACTIVE" },
             { k: "OVERFLOW", v: "0.0%" },
             { k: "INTEGRITY", v: "OPTIMAL" }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center">
               <span className="font-mono text-[8px] text-slate-400 uppercase tracking-[0.2em] mb-1">{item.k}</span>
               <span className="font-mono text-[10px] font-black uppercase text-obsidian">{item.v}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;