import React from 'react';
import { motion } from 'framer-motion';

const Comparison: React.FC = () => {
  return (
    <section className="py-40 bg-obsidian border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <h2 className="text-5xl md:text-8xl font-serif font-black text-ghost mb-8 tracking-tighter italic">
              Legacy <br/>
              <span className="text-blaze text-outline">Failure</span>
            </h2>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Systemic inefficiencies identified in 100% of analyzed enterprises.</p>
          </div>

          <div className="lg:col-span-7 space-y-12">
            {[
              { old: "HUMAN OPERATORS", new: "NEURAL VOICE AGENTS", stat: "98% COST REDUCTION" },
              { old: "WAIT TIMES", new: "INSTANT SCALING", stat: "ZERO QUEUE" },
              { old: "MANUAL DIALING", new: "AUTONOMOUS CAMPAIGNS", stat: "24/7 COVERAGE" },
              { old: "DATA SILOS", new: "REAL-TIME TRANSCRIPTS", stat: "100% VISIBILITY" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                viewport={{ once: true }}
                className="group relative border-b border-white/5 pb-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-slate-700 font-mono text-[10px] line-through decoration-blaze/40 uppercase">{item.old}</span>
                    <span className="block text-ghost font-serif text-3xl md:text-4xl font-bold italic group-hover:text-blaze transition-colors tracking-tighter">{item.new}</span>
                  </div>
                  {/* Stats un-bolded as per user request */}
                  <div className="mt-4 md:mt-0 font-mono text-xs md:text-sm font-normal text-blaze tracking-[0.2em] opacity-80">
                    {item.stat}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Comparison;