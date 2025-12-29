import React from 'react';
import { motion } from 'framer-motion';

const cases = [
  {
    id: "01",
    title: "POLITICAL OUTREACH",
    subtitle: "VOTER SENTIMENT TRIAGE",
    status: "OPERATIONAL",
    stats: "100K CALLS/HR",
    desc: "Deployment of autonomous agents for mass-scale legislative lobbying and donor acquisition."
  },
  {
    id: "02",
    title: "HEALTHCARE LOGISTICS",
    subtitle: "PATIENT PIPELINE CONTROL",
    status: "OPERATIONAL",
    stats: "HIPAA SECURE",
    desc: "End-to-end automated clinical scheduling with zero human latency."
  },
  {
    id: "03",
    title: "FINANCIAL SERVICES",
    subtitle: "FRAUD & RISK DETECTION",
    status: "ENCRYPTED",
    stats: "BANK-GRADE",
    desc: "Real-time biometric voice analysis and instant identity verification protocols."
  },
  {
    id: "04",
    title: "ENTERPRISE SUPPORT",
    subtitle: "LEVEL 1 REPLACEMENT",
    status: "AUTONOMOUS",
    stats: "92% DEFLECTION",
    desc: "Full elimination of Level 1 human support tiers through infinite scaling voice nodes."
  }
];

const UseCases: React.FC = () => {
  return (
    <section id="use-cases" className="py-40 bg-obsidian border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center space-x-6 mb-24 overflow-hidden">
          <h2 className="text-6xl md:text-[10rem] font-serif font-black text-ghost italic tracking-tighter leading-none">
            SCALED <br/> <span className="text-outline">OPERATIONS</span>
          </h2>
        </div>

        <div className="flex flex-col">
          {cases.map((uc, i) => (
            <motion.div 
              key={uc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group border-t border-white/10 py-16 flex flex-col md:grid md:grid-cols-12 gap-8 hover:bg-white/[0.02] transition-colors"
            >
              {/* Technical Marker */}
              <div className="md:col-span-1">
                <span className="font-mono text-xs text-blaze font-bold tracking-tighter">[{uc.id}]</span>
              </div>

              {/* Title & Core Subtitle */}
              <div className="md:col-span-6">
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-ghost italic tracking-tighter group-hover:text-blaze transition-colors">
                  {uc.title}
                </h3>
                <p className="mt-2 font-mono text-[10px] text-slate-500 uppercase tracking-widest">{uc.subtitle}</p>
              </div>

              {/* Status & Stats - De-bolded and de-framed */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-1">
                <span className="font-mono text-[10px] text-blaze tracking-[0.3em] uppercase font-bold">{uc.status}</span>
                <span className="font-mono text-[10px] text-slate-500 font-normal uppercase tracking-wider">{uc.stats}</span>
              </div>

              {/* Description */}
              <div className="md:col-span-3">
                <p className="text-slate-400 font-mono text-[11px] leading-relaxed uppercase">
                   {uc.desc}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-white/10 w-full" />
        </div>

        <div className="mt-20 flex justify-end">
          <p className="font-mono text-[10px] text-slate-700 tracking-[0.4em] uppercase">
            // END OF USE CASE REGISTRY //
          </p>
        </div>
      </div>
    </section>
  );
};

export default UseCases;