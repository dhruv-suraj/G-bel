import React from 'react';
import { motion } from 'framer-motion';
import { PhoneOutgoing, Database, Fingerprint, Activity, Terminal, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const cards = [
    { icon: PhoneOutgoing, title: "OUTBOUND", desc: "Massive scale execution." },
    { icon: Terminal, title: "LOGGING", desc: "Binary accuracy logs." },
    { icon: Fingerprint, title: "IDENTITY", desc: "Voice biometrics active." },
    { icon: Database, title: "RECORDS", desc: "Obsidian-tier storage." },
    { icon: Activity, title: "ANALYTICS", desc: "Real-time call insights." },
    { icon: Shield, title: "SECURE", desc: "End-to-end encrypted." },
  ];

  return (
    <section id="features" className="py-40 bg-obsidian">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b-4 border-blaze pb-8">
           <h3 className="text-5xl md:text-[7rem] font-serif font-black text-ghost tracking-tighter leading-none italic uppercase">
             Core <br/> Intel
           </h3>
           <p className="text-slate-600 font-mono text-xs uppercase max-w-xs md:text-right">Technical specifications for autonomous voice operations.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10 border border-white/10">
          {cards.map((card, i) => (
            <motion.div 
              key={i}
              whileHover={{ backgroundColor: "#FF4D00", color: "#050505" }}
              className="bg-obsidian p-8 aspect-square flex flex-col justify-between transition-all duration-300 group"
            >
              <card.icon className="w-8 h-8 text-blaze group-hover:text-obsidian" />
              <div>
                <h4 className="font-serif font-black text-xl italic mb-1 uppercase tracking-tight">{card.title}</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;