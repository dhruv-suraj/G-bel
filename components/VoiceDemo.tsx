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
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const nextStartTimeRef = useRef<number>(0);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentAudioTypeRef = useRef<string | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

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

  const muteGeminiAudio = () => {
    // Disconnect the script processor to stop sending microphone data to Gemini
    if (scriptProcessorRef.current && mediaStreamSourceRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
        mediaStreamSourceRef.current.disconnect();
      } catch (e) {
        console.debug('Error disconnecting audio nodes:', e);
      }
    }

    // Stop all currently playing Gemini audio
    sourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    sourcesRef.current.clear();
  };

  const unmuteGeminiAudio = () => {
    // Reconnect the script processor to resume sending microphone data
    if (scriptProcessorRef.current && mediaStreamSourceRef.current && inputAudioContextRef.current) {
      try {
        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
      } catch (e) {
        console.debug('Error reconnecting audio nodes:', e);
      }
    }
  };

  const playPrerecordedAudio = (audioType: string) => {
    // Audio scripts based on website content with natural pauses
    const audioScripts: { [key: string]: string } = {
      'current-issues': `Legacy systems are failing enterprises across the board. Human operators cost you 98% more than they should...
      Wait times are killing customer satisfaction. Manual dialing wastes precious hours... Data sits in silos, invisible to decision makers.
      These are systemic inefficiencies that plague 100% of analyzed enterprises. The old way, is obsolete.`,

      'use-cases': `We've deployed autonomous voice agents across critical sectors...
      Political outreach? 100,000 calls per hour for mass-scale legislative lobbying and voter sentiment analysis.
      Healthcare logistics? HIPAA secure patient scheduling with zero human latency, fully automated, end to end.
      Financial services? Bank grade encrypted, real-time biometric voice analysis for fraud detection and identity verification.
      Enterprise support? 92% deflection rate, completely eliminating Level 1 human support tiers through infinite scaling voice nodes.`,

      'what-we-provide': `Graham Bell delivers six core capabilities...
      Outbound: massive scale execution for autonomous calling campaigns.
      Logging: binary accuracy logs with complete transparency.
      Identity: active voice biometrics for secure authentication.
      Records: obsidian tier storage with full data sovereignty.
      Analytics: real-time call insights and performance metrics.
      Security: end to end encryption, bank grade protection.
      This is the neural voice interface for the sovereign enterprise... Absolute precision... Infinite scale... No human debt.`
    };

    // Check if clicking the same button
    if (currentAudioTypeRef.current === audioType) {
      // Toggle pause/resume
      if (window.speechSynthesis.paused) {
        // Resume
        window.speechSynthesis.resume();
        setIsPaused(false);
        muteGeminiAudio(); // Keep Gemini muted while playing
      } else if (window.speechSynthesis.speaking) {
        // Pause
        window.speechSynthesis.pause();
        setIsPaused(true);
        unmuteGeminiAudio(); // Unmute Gemini when paused
      }
      return;
    }

    // Stop any currently playing speech
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }

    const script = audioScripts[audioType];
    if (!script) return;

    // Mute Gemini audio while playing pre-recorded audio
    muteGeminiAudio();

    setPlayingAudio(audioType);
    setIsPaused(false);
    currentAudioTypeRef.current = audioType;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0; // Normal speed for more natural sound
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0;
    currentUtteranceRef.current = utterance;

    // Load voices and select the best natural-sounding one
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      // Priority order for more natural voices
      const preferredVoice = voices.find(voice =>
        // Premium voices (macOS/iOS)
        voice.name.includes('Samantha') ||
        voice.name.includes('Alex') ||
        voice.name.includes('Daniel') ||
        voice.name.includes('Karen') ||
        // Google voices
        voice.name.includes('Google US English') ||
        voice.name.includes('Google UK English Male') ||
        // Microsoft voices
        voice.name.includes('Microsoft David') ||
        voice.name.includes('Microsoft Mark') ||
        // Fallback to any English voice
        (voice.lang.startsWith('en') && voice.localService)
      ) || voices.find(voice => voice.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name);
      }

      window.speechSynthesis.speak(utterance);
    };

    utterance.onend = () => {
      setPlayingAudio(null);
      setIsPaused(false);
      currentAudioTypeRef.current = null;
      currentUtteranceRef.current = null;
      unmuteGeminiAudio(); // Unmute Gemini when audio finishes
    };

    utterance.onerror = () => {
      console.error('Speech synthesis failed');
      setPlayingAudio(null);
      setIsPaused(false);
      currentAudioTypeRef.current = null;
      currentUtteranceRef.current = null;
      unmuteGeminiAudio(); // Unmute Gemini on error
    };

    // Load voices if not already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  };

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

              // Store references for muting/unmuting
              mediaStreamSourceRef.current = source;
              scriptProcessorRef.current = scriptProcessor;

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
            // Don't play Gemini audio if pre-recorded audio is playing
            if (audio && outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed' && !playingAudio) {
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
    // Stop speech synthesis if playing
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }
    setPlayingAudio(null);
    setIsPaused(false);
    currentAudioTypeRef.current = null;
    currentUtteranceRef.current = null;

    // Clear audio node references
    scriptProcessorRef.current = null;
    mediaStreamSourceRef.current = null;

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

             {/* Navigation Buttons */}
             <div className="flex flex-wrap gap-4 mt-8">
                <button
                   onClick={() => playPrerecordedAudio('current-issues')}
                   className={`px-6 py-3 border font-mono text-xs tracking-widest transition-all uppercase ${
                      playingAudio === 'current-issues'
                         ? isPaused
                            ? 'bg-yellow-600 text-obsidian border-yellow-600'
                            : 'bg-blaze text-obsidian border-blaze animate-pulse'
                         : 'border-white/20 text-ghost hover:bg-blaze hover:text-obsidian hover:border-blaze'
                   }`}
                >
                   {playingAudio === 'current-issues' ? (isPaused ? '⏸ Paused' : '▶ Playing...') : 'Current Issues'}
                </button>
                <button
                   onClick={() => playPrerecordedAudio('use-cases')}
                   className={`px-6 py-3 border font-mono text-xs tracking-widest transition-all uppercase ${
                      playingAudio === 'use-cases'
                         ? isPaused
                            ? 'bg-yellow-600 text-obsidian border-yellow-600'
                            : 'bg-blaze text-obsidian border-blaze animate-pulse'
                         : 'border-white/20 text-ghost hover:bg-blaze hover:text-obsidian hover:border-blaze'
                   }`}
                >
                   {playingAudio === 'use-cases' ? (isPaused ? '⏸ Paused' : '▶ Playing...') : 'Our Use Cases'}
                </button>
                <button
                   onClick={() => playPrerecordedAudio('what-we-provide')}
                   className={`px-6 py-3 border font-mono text-xs tracking-widest transition-all uppercase ${
                      playingAudio === 'what-we-provide'
                         ? isPaused
                            ? 'bg-yellow-600 text-obsidian border-yellow-600'
                            : 'bg-blaze text-obsidian border-blaze animate-pulse'
                         : 'border-white/20 text-ghost hover:bg-blaze hover:text-obsidian hover:border-blaze'
                   }`}
                >
                   {playingAudio === 'what-we-provide' ? (isPaused ? '⏸ Paused' : '▶ Playing...') : 'What We Provide'}
                </button>
             </div>
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