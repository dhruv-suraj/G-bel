import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="about" className="bg-obsidian py-40 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-24 items-end">
          
          <div>
            <h2 className="text-8xl md:text-[15rem] font-serif font-black text-white/5 absolute -bottom-20 -left-10 pointer-events-none tracking-tighter italic">
              GRAHAM
            </h2>
            <div className="relative z-10 space-y-8">
               <div className="font-mono text-xs text-blaze tracking-widest uppercase">[ READY FOR DEPLOYMENT ]</div>
               <p className="font-serif text-3xl text-ghost leading-tight max-w-sm italic font-bold">
                 Contact us to witness the obsolescence of your current phone operations.
               </p>
               <a href="mailto:hello@grahambell.ai" className="inline-block font-mono text-xl border-b-4 border-blaze pb-2 hover:translate-x-4 transition-transform">
                 HELLO@GRAHAMBELL.AI
               </a>
            </div>
          </div>

          <div className="flex flex-col space-y-4 font-mono text-[9px] text-slate-600 uppercase tracking-[0.5em] md:text-right">
             <span>© 2025 GRAHAM BELL INC.</span>
             <span>VOICE INTELLIGENCE DIVISION</span>
             <div className="flex justify-end space-x-4 pt-4 text-blaze">
                <a href="#">TWITTER</a>
                <a href="#">LINKEDIN</a>
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;