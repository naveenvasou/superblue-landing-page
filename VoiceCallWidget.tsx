import { useState, useEffect, useRef } from 'react';
import { Phone, X, Mic, PhoneOff } from 'lucide-react';
import Orb from '@/components/ui/orb';
import { SOCKET_IO_URL } from '@/lib/api';
import { getAgentConfiguration, type WidgetConfig } from '@/lib/architect';

type WidgetSize = 'tiny' | 'compact' | 'full';

interface VoiceCallWidgetProps {
  agentId: string;
  size?: WidgetSize;
  enableTranscription?: boolean;
  onStartCall?: () => void;
  onEndCall?: () => void;
  avatarType?: "upload" | "orb";
  uploadedAvatar?: string | null;
  orbColor1?: string;
  orbColor2?: string;
  mainLabel?: string;
  callButtonText?: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  isPending?: boolean;  // For "Transcribing..." placeholder
}

const WidgetAvatar = ({ avatarType, uploadedAvatar, orbColor1, orbColor2, size = 'small' }: {
  avatarType: "upload" | "orb";
  uploadedAvatar: string | null;
  orbColor1: string;
  orbColor2: string;
  size?: 'small' | 'large' | 'huge';
}) => {
  let dimension = 'w-9 h-9';
  if (size === 'large') dimension = 'w-12 h-12';
  if (size === 'huge') dimension = 'w-32 h-32';

  if (avatarType === 'upload' && uploadedAvatar) {
    return <img src={uploadedAvatar} alt="Avatar" className={`${dimension} rounded-full object-cover`} />;
  }

  return (
    <div className={`${dimension} flex items-center justify-center overflow-hidden rounded-full bg-gray-100`}>
      <Orb color1={orbColor1} color2={orbColor2} />
    </div>
  );
};

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

export default function VoiceCallWidget({
  agentId,
  size: propSize,
  enableTranscription: propEnableTranscription,
  onStartCall = () => console.log('Starting call...'),
  onEndCall = () => console.log('Ending call...'),
  avatarType: propAvatarType,
  uploadedAvatar: propUploadedAvatar,
  orbColor1: propOrbColor1,
  orbColor2: propOrbColor2,
  mainLabel: propMainLabel,
  callButtonText: propCallButtonText
}: VoiceCallWidgetProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partialUserTranscript, setPartialUserTranscript] = useState<string>('');
  const [partialAgentTranscript, setPartialAgentTranscript] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration state
  const [config, setConfig] = useState<Partial<WidgetConfig>>({});
  const [loading, setLoading] = useState(true);

  // Fetch configuration
  useEffect(() => {
    async function loadConfig() {
      try {
        const agent = await getAgentConfiguration(agentId.toString());
        if (agent.config?.widget) {
          setConfig(agent.config.widget);
        }
      } catch (error) {
        console.error("Failed to load widget config:", error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, [agentId]);

  // Merge props with config (props take precedence if provided, otherwise config, otherwise default)
  const size = propSize || config.variant || 'compact';
  const enableTranscription = propEnableTranscription ?? config.enableTranscription ?? false;
  const avatarType = propAvatarType || config.avatarType || 'orb';
  const uploadedAvatar = propUploadedAvatar || config.uploadedAvatar || null;
  const orbColor1 = propOrbColor1 || config.orbColor1 || '#2792dc';
  const orbColor2 = propOrbColor2 || config.orbColor2 || '#9ce6e6';
  const mainLabel = propMainLabel || config.mainLabel || 'Need help?';
  const callButtonText = propCallButtonText || config.callButtonText || 'Start a call';

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
  const playbackSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Auto-scroll
  useEffect(() => {
    if (enableTranscription && isCallActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, partialUserTranscript, partialAgentTranscript, isCallActive, enableTranscription]);

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
        nextStartTimeRef.current = audioContextRef.current.currentTime + 0.02;
      }
    } catch (err) {
      console.warn("stopAllAssistantAudio error:", err);
    }
  };

  // Play audio from Float32Array
  const playAudio = (audioData: Float32Array) => {
    if (!audioContextRef.current) return;
    const context = audioContextRef.current;

    const buffer = context.createBuffer(1, audioData.length, PLAYBACK_SAMPLE_RATE);
    buffer.getChannelData(0).set(audioData);

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    // Add to active sources
    playbackSourcesRef.current.push(source);

    // Schedule playback
    const currentTime = context.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime + 0.05;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;

    source.onended = () => {
      playbackSourcesRef.current = playbackSourcesRef.current.filter((s) => s !== source);
      try { source.disconnect(); } catch (_) { }
    };
  };

  // Handle received audio message
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

      const float32Data = convertInt16ToFloat32(audioBytes);
      playAudio(float32Data);
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
    // Don't close AudioContext here as we might need it for playback
  };

  // Connect to WebSocket
  const handleConnect = async () => {
    try {
      onStartCall();
      setIsCallActive(true);
      setMessages([]);
      setPartialUserTranscript('');
      setPartialAgentTranscript('');

      // Construct WebSocket URL
      const baseUrl = SOCKET_IO_URL.replace(/^http/, 'ws');
      const ws = new WebSocket(`${baseUrl}/api/v1/ws/public/${agentId}`);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.log('Connected to voice service');
        startAudioCapture();
      };

      ws.onmessage = async (event) => {
        const data = event.data;

        if (data instanceof ArrayBuffer) {
          // Binary audio data
          handleAudioMessage(data);
        } else {
          // Text message
          try {
            const textData = JSON.parse(data);

            if (textData.type === 'interrupt') {
              console.log("Gemini detected user speaking - stopping playback");
              stopAllAssistantAudio();
              return;
            }

            if (textData.type === 'transcript') {
              setMessages((prevMessages) => {
                // Check if there's a pending placeholder to replace
                const lastMessage = prevMessages[prevMessages.length - 1];

                if (lastMessage && lastMessage.role === 'user' && lastMessage.isPending) {
                  // Replace the pending placeholder with actual transcription
                  return [...prevMessages.slice(0, -1), {
                    role: textData.role,
                    text: textData.text,
                    isPending: false
                  }];
                }

                // Normal transcript handling (for agent or continuing messages)
                if (lastMessage && lastMessage.role === textData.role && !lastMessage.isPending) {
                  // Same person continuing - append text
                  const updatedLastMessage = {
                    ...lastMessage,
                    text: lastMessage.text + textData.text
                  };
                  return [...prevMessages.slice(0, -1), updatedLastMessage];
                } else {
                  // New message
                  return [...prevMessages, {
                    role: textData.role,
                    text: textData.text,
                    isPending: false
                  }];
                }
              });
            } else if (textData.type === 'transcript_pending') {
              // Show "Transcribing..." placeholder immediately
              setMessages(prev => [...prev, {
                role: 'user',
                text: 'Transcribing...',
                isPending: true
              }]);
            } else if (textData.type === 'connected') {
              console.log('Session connected:', textData.message);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from voice service');
        stopAudioCapture();
        setIsCallActive(false);
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
      setIsCallActive(false);
    }
  };

  // End call
  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  // Cleanup all resources
  const cleanup = () => {
    if (wsRef.current) {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
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
    setIsMuted(false);
    isMutedRef.current = false;
    setPartialUserTranscript('');
    setPartialAgentTranscript('');
  };

  const getPositionClasses = () => {
    switch (size) {
      case 'tiny': return 'bottom-24 right-12';
      case 'full': return 'bottom-12 right-6';
      case 'compact':
      default: return 'bottom-24 right-8';
    }
  };

  const isHeaderVisible = !isCallActive || (isCallActive && enableTranscription);

  if (loading) return null; // Or a loading spinner if preferred

  return (
    <>
      {/* Card State */}
      {isOpen && (
        <div className={`fixed ${getPositionClasses()} z-50 animate-in slide-in-from-bottom-5 fade-in duration-200`}>
          <div className={`
            bg-white rounded-[32px] shadow-[0_5px_40px_rgba(0,0,0,0.16)] w-80 overflow-hidden border border-gray-100 transition-all duration-500 ease-in-out relative flex flex-col
            ${isCallActive && enableTranscription ? 'h-[500px]' : 'h-auto'} 
          `}>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 z-50 text-gray-300 hover:text-gray-500 transition-colors bg-white/0 rounded-full p-1"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className={`
              relative flex items-center gap-4 shrink-0
              ${isHeaderVisible ? 'h-auto opacity-100 p-5' : 'h-0 opacity-0 p-0 overflow-hidden'}
              ${isCallActive && enableTranscription ? 'border-b border-gray-50' : ''}
            `}>
              <WidgetAvatar
                avatarType={avatarType}
                uploadedAvatar={uploadedAvatar}
                orbColor1={orbColor1}
                orbColor2={orbColor2}
                size={isCallActive && enableTranscription ? 'large' : 'small'}
              />
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-900 leading-none">AI Assistant</h3>
                {isCallActive && (
                  <div className="bg-gray-200/80 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit mt-1.5 animate-pulse">
                    Listening
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className={`w-full h-px bg-gray-100 shrink-0 transition-opacity duration-300 ${!isCallActive ? 'opacity-100' : 'opacity-0 h-0'}`} />

            {/* Body Content */}
            <div className="relative flex-1 overflow-hidden">
              {!isCallActive ? (
                /* Pre-call View */
                <div
                  key="pre-call"
                  className="p-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <button
                    onClick={handleConnect}
                    className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                    <span className="text-base font-medium">Connect</span>
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-4 leading-tight">
                    By starting call you agree to{' '}
                    <a href="#" className="underline hover:text-gray-600">Privacy policy</a>
                    {' '}&{' '}
                    <a href="#" className="underline hover:text-gray-600">T&C</a>
                  </p>
                </div>
              ) : enableTranscription ? (
                /* Transcription View */
                <div
                  key="transcription-view"
                  className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
                >
                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white pb-32">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`
                            max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm
                            ${msg.role === 'user'
                              ? 'bg-[#333333] text-white rounded-t-2xl rounded-bl-2xl'
                              : 'bg-gray-100 text-gray-800 rounded-t-2xl rounded-br-2xl'}
                            ${msg.isPending ? 'animate-pulse italic opacity-60' : ''}
                          `}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {/* Only show empty state if absolutely no messages exist */}
                    {messages.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-8">
                        Conversation will appear here...
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-10 pb-6 px-8 flex justify-between items-end z-10">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          const newMutedState = !isMuted;
                          setIsMuted(newMutedState);
                          isMutedRef.current = newMutedState;
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <Mic size={20} />
                      </button>
                      <span className="text-[10px] text-gray-400 font-medium">Mute</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={handleEndCall}
                        className="w-12 h-12 rounded-full bg-[#EF4444] hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-lg hover:shadow-red-200 hover:scale-105 active:scale-95"
                      >
                        <PhoneOff size={20} />
                      </button>
                      <span className="text-[10px] text-gray-400 font-medium">End call</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Orb View */
                <div
                  key="orb-view"
                  className="p-6 flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out"
                >
                  <div className="mb-8">
                    <WidgetAvatar
                      avatarType={avatarType}
                      uploadedAvatar={uploadedAvatar}
                      orbColor1={orbColor1}
                      orbColor2={orbColor2}
                      size="huge"
                    />
                  </div>

                  <div className="bg-gray-100/80 px-4 py-1.5 rounded-full text-gray-600 text-xs font-semibold uppercase tracking-wide mb-12 animate-pulse">
                    Listening...
                  </div>

                  <div className="flex items-center justify-between w-full px-8">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          const newMutedState = !isMuted;
                          setIsMuted(newMutedState);
                          isMutedRef.current = newMutedState;
                        }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted ? 'bg-gray-800 text-white shadow-inner' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <Mic size={24} />
                      </button>
                      <span className="text-xs text-gray-400 font-medium">Mute</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={handleEndCall}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-lg hover:shadow-red-200 hover:scale-105 active:scale-95"
                      >
                        <PhoneOff size={24} />
                      </button>
                      <span className="text-xs text-gray-400 font-medium">End</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Launcher Buttons */}
      {size === 'tiny' && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${getPositionClasses()} w-16 h-16 rounded-full bg-black hover:bg-gray-800 transition-colors flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.30)] z-50 group`}
        >
          <Phone className="w-6 h-6 text-white fill-white group-hover:scale-110 transition-transform" />
        </button>
      )}

      {size === 'compact' && !isOpen && (
        <div className={`fixed ${getPositionClasses()} bg-white rounded-full shadow-[0_0_25px_rgba(0,0,0,0.20)] p-2 flex items-center gap-2 z-50 hover:shadow-[0_0_35px_rgba(0,0,0,0.25)] transition-shadow duration-300`}>
          <WidgetAvatar
            avatarType={avatarType}
            uploadedAvatar={uploadedAvatar}
            orbColor1={orbColor1}
            orbColor2={orbColor2}
          />
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 transition-colors text-white font-regular px-3.5 py-2 rounded-full"
          >
            <Phone className="w-4 h-4 fill-white" />
            {callButtonText}
          </button>
        </div>
      )}

      {size === 'full' && !isOpen && (
        <div className={`fixed ${getPositionClasses()} bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-3 z-50`}>
          <div className="flex items-center gap-2 mb-2">
            <WidgetAvatar avatarType={avatarType} uploadedAvatar={uploadedAvatar} orbColor1={orbColor1} orbColor2={orbColor2} />
            <div className=" font-regular text-gray-900">{mainLabel}</div>
          </div>
          <button onClick={() => setIsOpen(true)} className="flex items-center justify-center gap-3 bg-black hover:bg-gray-800 transition-colors text-white font-regular px-16 py-2 rounded-full w-full">
            <Phone className="w-4 h-4 fill-white" />
            {callButtonText}
          </button>
        </div>
      )}
    </>
  );
}