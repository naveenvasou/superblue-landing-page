import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mic, PhoneOff } from 'lucide-react';
import Orb from '@/components/ui/orb';
import { PUBLIC_WS_URL } from '@/lib/api';

// Constants
const SAMPLE_RATE = 16000; // Target sample rate for sending to backend
const PLAYBACK_SAMPLE_RATE = 24000; // Gemini usually responds with 24kHz
const WORKLET_URL = '/audio-processor.worklet.js';

// Helper: Convert Int16 to Float32 (still needed for playback)
const convertInt16ToFloat32 = (buffer: ArrayBuffer) => {
  const int16 = new Int16Array(buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 0x8000;
  }
  return float32;
};


const ExperienceSection: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLanguageSelectionOpen, setIsLanguageSelectionOpen] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Fetch user location
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.country_code) {
          setUserCountry(data.country_code);
          console.log("User country detected:", data.country_code);
        }
      })
      .catch(err => console.error("Error fetching location:", err));
  }, []);

  // Refs for audio and socket
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const isMutedRef = useRef<boolean>(false);

  // New refs for buffering and playback
  const nextStartTimeRef = useRef<number>(0);
  const playbackSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const audioBufferPoolRef = useRef<AudioBuffer[]>([]);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const stopAllAssistantAudio = () => {
    try {
      const list = playbackSourcesRef.current;
      for (const s of list) {
        try {
          s.stop();
        } catch (_) { }
        try {
          s.disconnect();
        } catch (_) { }
      }
      playbackSourcesRef.current = [];
      if (audioContextRef.current) {
        // small headroom so new audio starts cleanly
        nextStartTimeRef.current = audioContextRef.current.currentTime + 0.005;  // 5ms - minimal headroom
      }
    } catch (err) {
      console.warn("stopAllAssistantAudio error:", err);
    }
  };

  // Play audio from Float32Array
  const playAudio = (audioData: Float32Array) => {
    if (!audioContextRef.current) return;
    const context = audioContextRef.current;

    // Reuse or create buffer from pool
    let buffer = audioBufferPoolRef.current.find(b => b.length === audioData.length);
    if (buffer) {
      // Reuse existing buffer
      audioBufferPoolRef.current = audioBufferPoolRef.current.filter(b => b !== buffer);
    } else {
      // Create new buffer
      buffer = context.createBuffer(1, audioData.length, PLAYBACK_SAMPLE_RATE);
    }
    buffer.getChannelData(0).set(audioData);

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    // Add to active sources
    playbackSourcesRef.current.push(source);

    // Schedule playback
    const currentTime = context.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime + 0.01;  // 10ms - minimal safe buffer
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;

    source.onended = () => {
      playbackSourcesRef.current = playbackSourcesRef.current.filter((s) => s !== source);
      try { source.disconnect(); } catch (_) { }
      // Return buffer to pool (max 10 buffers to avoid memory growth)
      if (buffer && audioBufferPoolRef.current.length < 10) {
        audioBufferPoolRef.current.push(buffer);
      }
    };
  };

  // Handle received audio message
  // Handle binary audio from server (strip prefix 0x01 expected)
  const handleAudioMessage = (data: ArrayBuffer) => {
    if (!data || data.byteLength <= 1) return;
    try {
      const view = new Uint8Array(data);
      let audioBytes = data;

      // Only strip prefix if it matches AND the total length is odd.
      // (Assuming audio data is always even length (Int16), so Prefix(1) + Audio(Even) = Odd)
      if ((view[0] === 0x01 || view[0] === 0x02) && view.length > 1 && view.length % 2 !== 0) {
        audioBytes = data.slice(1);
      }

      // Safeguard: Ensure byte length is even for Int16Array
      if (audioBytes.byteLength % 2 !== 0) {
        console.warn("Received odd-length audio buffer, trimming last byte");
        audioBytes = audioBytes.slice(0, audioBytes.byteLength - 1);
      }

      const float32 = convertInt16ToFloat32(audioBytes);
      playAudio(float32);
    } catch (e) {
      console.error("handleAudioMessage error", e);
    }
  };

  // Start capturing microphone
  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: SAMPLE_RATE
        }
      });

      mediaStreamRef.current = stream;

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          latencyHint: 'interactive',  // Optimize for lowest possible latency
          sampleRate: PLAYBACK_SAMPLE_RATE  // Explicit sample rate to avoid resampling
        });
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const context = audioContextRef.current;

      // Load the AudioWorklet module
      await context.audioWorklet.addModule(WORKLET_URL);

      const source = context.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(context, 'audio-capture-processor');

      source.connect(workletNode);
      // Note: AudioWorkletNode doesn't need to connect to destination for processing
      // workletNode.connect(context.destination); // Commented out to avoid feedback

      sourceNodeRef.current = source;
      workletNodeRef.current = workletNode;

      // Listen for processed audio chunks from the worklet
      workletNode.port.onmessage = (event) => {
        if (event.data.type === 'audio' && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const int16Data = event.data.data;

          // Send to server with 0x02 prefix
          const message = new Uint8Array(1 + int16Data.byteLength);
          message[0] = 0x02;
          message.set(new Uint8Array(int16Data.buffer), 1);

          wsRef.current.send(message.buffer);
        }
      };

      console.log('Audio capture started with AudioWorklet');
    } catch (error) {
      console.error('Error starting audio capture:', error);
      alert('Failed to access microphone. Please check permissions.');
      cleanup();
    }
  };

  // Stop audio capture
  const stopAudioCapture = () => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Connect to WebSocket
  const handleConnect = async (selectedAgentId: string) => {
    try {
      setConnectionStatus('connecting');
      setIsCallActive(true);
      setIsLanguageSelectionOpen(false); // Close selection if open

      const wsUrl = `${PUBLIC_WS_URL}/${selectedAgentId}`;

      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.log('Connected to voice service');
        setConnectionStatus('connected');
        startAudioCapture();
      };

      ws.onmessage = async (event) => {
        const data = event.data;

        if (data instanceof ArrayBuffer) {
          // Binary audio data
          handleAudioMessage(data);
        } else {
          // Text message (transcript or control)
          try {
            const textData = JSON.parse(data);

            if (textData.type === 'interrupt') {
              console.log("Gemini detected user speaking - stopping playback");
              stopAllAssistantAudio();
              return;
            }

            if (textData.type === 'connected') {
              console.log('Session connected:', textData.message);
            }
            // We can handle transcripts here if we want to display them
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from voice service');
        cleanup();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('Failed to connect to voice service. Please try again.');
        cleanup();
      };

      wsRef.current = ws;

    } catch (error) {
      console.error('Error connecting:', error);
      alert('Failed to start call. Please try again.');
      cleanup();
    }
  };

  // End call
  const handleEndCall = () => {
    cleanup();
  };

  // Cleanup all resources
  const cleanup = () => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "disconnect" }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    stopAudioCapture();

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Reset audio scheduling refs
    nextStartTimeRef.current = 0;

    setIsCallActive(false);
    setConnectionStatus('disconnected');
    setIsMuted(false);
    isMutedRef.current = false;
    setIsLanguageSelectionOpen(false);
  };

  return (
    <section id="experience" className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold md:font-medium text-slate-900 tracking-tight mb-6">
            Experience our Voice AI
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            See how natural and responsive our agents are. Give it a try.
          </p>
        </div>

        {/* The Phone Interface */}
        <div className="relative group">
          {/* Outer glow/shadow for depth */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-[3.2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          {/* Phone Bezel */}
          <div className="relative w-[340px] h-[600px] bg-slate-950 rounded-[3rem] p-3 shadow-2xl ring-1 ring-slate-900/5">

            {/* Screen Area */}
            <div className="w-full h-full bg-slate-900 rounded-[2.5rem] relative flex flex-col items-center overflow-hidden">

              {/* Background Container */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                {/* Dynamic Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900"></div>

                {/* Animated Orb/Glow in background (only show when NOT active to avoid clash with main Orb) */}
                {!isCallActive && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] animate-pulse"></div>
                )}

                {/* Dot Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                ></div>
              </div>

              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-16 px-6">

                {!isCallActive ? (
                  !isLanguageSelectionOpen ? (
                    /* Idle State */
                    <>
                      {/* Caller Info */}
                      <div className="text-center space-y-2 mt-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-900/50">
                          <span className="text-2xl font-bold text-white">S</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-white tracking-wide">SuperBlue AI</h3>
                        <p className="text-blue-200/80 text-sm font-medium tracking-wider uppercase animate-pulse">Incoming Call...</p>
                      </div>

                      {/* Call Action */}
                      <div className="relative mt-auto mb-12">
                        {/* Ripple Effects */}
                        <div className="absolute inset-0 bg-white/10 rounded-full animate-ping delay-75"></div>
                        <div className="absolute inset-0 bg-white/5 rounded-full animate-ping delay-300"></div>

                        {/* Main Button */}
                        <button
                          onClick={() => setIsLanguageSelectionOpen(true)}
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                          className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-300 cursor-pointer z-20 group"
                        >
                          <Phone className={`w-8 h-8 text-slate-900 fill-current transition-transform duration-300 ${isHovering ? 'rotate-12' : ''}`} />
                        </button>
                      </div>

                      {/* Instructions */}
                      <div className="text-center w-full space-y-6 mb-4">
                        <p className="text-white/60 text-sm font-medium">Click to talk to the bot</p>
                      </div>
                    </>
                  ) : (
                    /* Language Selection State */
                    <div className="flex flex-col items-center justify-center h-full w-full px-8 animate-in fade-in zoom-in-95 duration-200">
                      <h3 className="text-base font-medium text-slate-200 mb-4">Select Language</h3>

                      <div className="w-full space-y-2">
                        {(userCountry === 'IN' ? [
                          { id: 'agent_2f0jgx7x8kdu', label: 'English (India)' },
                          { id: 'agent_3e2189qyrioo', label: 'Hindi' },
                          { id: 'agent_na5f32k91tmb', label: 'Tamil' },
                        ] : [
                          { id: 'agent_y9104gmdhfn0', label: 'English (US)' },
                          { id: 'agent_70xq35soecib', label: 'English (UK)' },
                          { id: 'agent_nuezoi654f28', label: 'Spanish' },
                          { id: 'agent_g17adt0xhogj', label: 'French' },
                        ]).map((lang) => (
                          <button
                            key={lang.label}
                            onClick={() => handleConnect(lang.id)}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-md py-2.5 px-4 text-sm text-slate-200 hover:text-white transition-all text-left"
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setIsLanguageSelectionOpen(false)}
                        className="mt-6 text-slate-400 hover:text-slate-300 text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )
                ) : (
                  /* Active Call State */
                  <div className="flex flex-col items-center justify-center h-full w-full animate-in fade-in zoom-in-95 duration-500">

                    {/* Orb Container */}
                    <div className="w-48 h-48 mb-12 relative">
                      <Orb color1="#2792dc" color2="#9ce6e6" />
                    </div>

                    {/* Status */}
                    <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-xs font-semibold uppercase tracking-wide mb-12 animate-pulse border border-white/10">
                      {connectionStatus === 'connecting' ? 'Connecting...' : 'Listening...'}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between w-full px-4 gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => {
                            const newMutedState = !isMuted;
                            setIsMuted(newMutedState);
                            isMutedRef.current = newMutedState;
                            // Send mute state to worklet
                            if (workletNodeRef.current) {
                              workletNodeRef.current.port.postMessage({
                                type: 'mute',
                                value: newMutedState
                              });
                            }
                          }}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          <Mic size={24} />
                        </button>
                        <span className="text-xs text-white/60 font-medium">Mute</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={handleEndCall}
                          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95"
                        >
                          <PhoneOff size={24} />
                        </button>
                        <span className="text-xs text-white/60 font-medium">End</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
