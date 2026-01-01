import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Phone, X, Loader2, Zap } from 'lucide-react';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

interface VoiceDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceDemo: React.FC<VoiceDemoProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const nextStartTimeRef = useRef<number>(0);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => stopSession();
  }, [isOpen]);

  const startSession = async () => {
    try {
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const outputCtx = outputAudioContextRef.current;
      if (!outputCtx) throw new Error("Audio system fail.");

      analyserRef.current = outputCtx.createAnalyser();
      const outputNode = outputCtx.createGain();
      outputNode.connect(analyserRef.current);
      analyserRef.current.connect(outputCtx.destination);
      startVisualizer();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('connected');
            const inputCtx = inputAudioContextRef.current;
            if (inputCtx) {
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                sessionPromiseRef.current?.then(s => {
                  if (s && typeof s.sendRealtimeInput === 'function') {
                    s.sendRealtimeInput({ media: createBlob(inputData) });
                  }
                });
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            }
          },
          onmessage: async (m) => {
            const audio = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio && outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
               const ctx = outputAudioContextRef.current;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               try {
                 const buffer = await decodeAudioData(decode(audio), ctx, 24000, 1);
                 const s = ctx.createBufferSource();
                 s.buffer = buffer; 
                 s.connect(outputNode);
                 s.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += buffer.duration;
                 sourcesRef.current.add(s);
                 s.onended = () => sourcesRef.current.delete(s);
               } catch (e) {
                 console.error("Audio decoding error", e);
               }
            }
          },
          onclose: () => setStatus('idle'),
          onerror: (e) => { 
            console.error("Live session error", e);
            setStatus('error'); 
            setErrorMsg("Sync failed."); 
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'You are Graham Bell. You speak with extreme confidence, precision, and an almost haunting intelligence. You are a tool of pure efficiency. Do not make small talk. Show them the future of voice automation.',
        },
      });
    } catch (e: any) { 
      setStatus('error'); 
      setErrorMsg(e.message); 
    }
  };

  const stopSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    
    if (inputAudioContextRef.current) {
      if (inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close().catch(e => console.debug("Input context close fail", e));
      }
      inputAudioContextRef.current = null;
    }
    
    if (outputAudioContextRef.current) {
      if (outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close().catch(e => console.debug("Output context close fail", e));
      }
      outputAudioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => { 
        try { 
          if (s && typeof s.close === 'function') {
            s.close(); 
          }
        } catch(e) {} 
      });
      sessionPromiseRef.current = null;
    }
    
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setStatus('idle');
  };

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
      if (status !== 'connected' && status !== 'connecting') return;
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FF4D00';
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian text-ghost p-4 md:p-12 overflow-hidden">
       {/* Retro Scanline */}
       <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] z-50"></div>
       
       <button onClick={onClose} className="absolute top-10 right-10 z-[60] hover:text-blaze transition-colors">
          <X className="w-12 h-12" />
       </button>

       <div className="w-full max-w-6xl flex flex-col items-start relative">
          
          <div className="mb-12">
             <div className="flex items-center space-x-4 mb-2">
                <Zap className="text-blaze w-6 h-6 animate-pulse" />
                <span className="font-mono text-sm tracking-[0.5em] text-blaze font-bold">BIO-INTERFACE LIVE</span>
             </div>
             <h2 className="text-8xl md:text-[12rem] font-serif font-black italic tracking-tighter leading-none">
                {status === 'connected' ? "HEARING" : status === 'connecting' ? "SYNCING" : "OFFLINE"}
             </h2>
          </div>

          <div className="w-full h-64 border-y border-white/10 relative overflow-hidden flex items-center">
             {status === 'connecting' && (
                <div className="flex items-center space-x-4 font-mono text-xl animate-pulse text-blaze">
                   <Loader2 className="animate-spin" />
                   <span>ENCRYPTING PROTOCOLS...</span>
                </div>
             )}
             {status === 'connected' && (
                <canvas ref={canvasRef} className="w-full h-full opacity-80" width="1200" height="256" />
             )}
             {status === 'error' && (
                <div className="text-red-500 font-mono italic text-3xl">{errorMsg}</div>
             )}
             {status === 'idle' && (
                <div className="text-white/20 font-mono italic text-xl">SESSION TERMINATED</div>
             )}
          </div>

          <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between w-full">
             <div className="max-w-md">
                <p className="text-slate-500 font-mono text-sm leading-relaxed uppercase">
                   [ SPEAK NOW ] 
                   <br/>Your voice is being processed by the Graham Bell Neural Network. Do not hesitate.
                </p>
             </div>
             <button 
               onClick={onClose}
               className="mt-8 md:mt-0 p-10 bg-red-600 rounded-full hover:scale-110 transition-transform shadow-[0_0_50px_rgba(220,38,38,0.3)]"
             >
                <Phone className="w-12 h-12 text-white transform rotate-135" />
             </button>
          </div>
       </div>
    </div>
  );
};

export default VoiceDemo;