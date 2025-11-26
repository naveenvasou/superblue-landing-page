import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mic, PhoneOff } from 'lucide-react';
import Orb from '@/components/ui/orb';
import { PUBLIC_WS_URL } from '@/lib/api';

// Constants
const SAMPLE_RATE = 16000; // Target sample rate for sending to backend
const PLAYBACK_SAMPLE_RATE = 24000; // Gemini usually responds with 24kHz
const BUFFER_SIZE = 2048;

// Helper: Downsample buffer
const downsampleBuffer = (buffer: Float32Array, sampleRate: number, outSampleRate: number) => {
  if (outSampleRate === sampleRate) {
    return buffer;
  }
  if (outSampleRate > sampleRate) {
    throw new Error("downsampling rate show be smaller than original sample rate");
  }
  const sampleRateRatio = sampleRate / outSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    // Use average value of skipped samples
    let accum = 0, count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
};

// Helper: Convert Float32 to Int16
const convertFloat32ToInt16 = (buffer: Float32Array) => {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, Math.max(-1, buffer[l])) * 0x7FFF;
  }
  return buf;
};

// Helper: Convert Int16 to Float32
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
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Refs for audio and socket
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const isMutedRef = useRef<boolean>(false);

  // New refs for buffering and playback
  const nextStartTimeRef = useRef<number>(0);
  const inputBufferRef = useRef<Float32Array>(new Float32Array(0));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Play audio from Float32Array
  const playAudio = (audioData: Float32Array) => {
    if (!audioContextRef.current) return;
    const context = audioContextRef.current;

    const buffer = context.createBuffer(1, audioData.length, PLAYBACK_SAMPLE_RATE);
    buffer.getChannelData(0).set(audioData);

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    // Schedule playback
    const currentTime = context.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime + 0.05;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
  };

  // Handle received audio message
  const handleAudioMessage = (data: ArrayBuffer) => {
    // First byte is prefix (0x01)
    const audioData = data.slice(1);
    const float32Data = convertInt16ToFloat32(audioData);
    playAudio(float32Data);
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
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const context = audioContextRef.current;
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(BUFFER_SIZE, 1, 1);

      source.connect(processor);
      processor.connect(context.destination);

      sourceNodeRef.current = source;
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Resample to 16kHz
        const downsampled = downsampleBuffer(inputData, context.sampleRate, SAMPLE_RATE);

        // Append to buffer
        const newBuffer = new Float32Array(inputBufferRef.current.length + downsampled.length);
        newBuffer.set(inputBufferRef.current);
        newBuffer.set(downsampled, inputBufferRef.current.length);
        inputBufferRef.current = newBuffer;

        // Process 512-sample chunks (Silero VAD requirement)
        const CHUNK_SIZE = 512;

        while (inputBufferRef.current.length >= CHUNK_SIZE) {
          const chunk = inputBufferRef.current.slice(0, CHUNK_SIZE);
          inputBufferRef.current = inputBufferRef.current.slice(CHUNK_SIZE);

          const int16Data = convertFloat32ToInt16(chunk);

          // Send to server with 0x02 prefix
          const message = new Uint8Array(1 + int16Data.byteLength);
          message[0] = 0x02;
          message.set(new Uint8Array(int16Data.buffer), 1);

          wsRef.current.send(message.buffer);
        }
      };

      console.log('Audio capture started');
    } catch (error) {
      console.error('Error starting audio capture:', error);
      alert('Failed to access microphone. Please check permissions.');
      cleanup();
    }
  };

  // Stop audio capture
  const stopAudioCapture = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
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
  const handleConnect = async () => {
    try {
      setConnectionStatus('connecting');
      setIsCallActive(true);

      // Use Agent ID 1 as per instructions
      const agentId = "agent_2f0jgx7x8kdu";
      const wsUrl = `${PUBLIC_WS_URL}/${agentId}`;

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
    inputBufferRef.current = new Float32Array(0);

    setIsCallActive(false);
    setConnectionStatus('disconnected');
    setIsMuted(false);
    isMutedRef.current = false;
  };

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium text-slate-900 tracking-tight mb-4">
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
                        onClick={handleConnect}
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
