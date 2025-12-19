import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, ChevronRight, Activity } from 'lucide-react';

const industries = [
    {
        id: 'banking',
        label: 'Real Estate',
        title: 'Website Assistant',
        description: 'Property inquiries and lead booking',
        duration: '3:33',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_6yb218sktu8t.wav',
        callType: 'webcall',
        language: 'Hindi',
    },
    {
        id: 'real-estate',
        label: 'Real Estate',
        title: 'Lead Qualification',
        description: 'Qualify your leads and book appointments',
        duration: '2:19',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_ev9cd6b766wr.wav',
        callType: 'outbound',
        language: 'English',
    },
    
    {
        id: 'edtech',
        label: 'EdTech',
        title: 'Student Counseling',
        description: 'Course information & enrollment support',
        duration: '2:28',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_9d9yzzodosqw.wav',
        callType: 'outbound',
        language: 'English',
    },
    {
        id: 'ecommerce',
        label: 'E-commerce',
        title: 'Shopping assistant',
        description: 'Tracking, returns & modifications',
        duration: '2:33',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_0x9z1ncai85k.wav',
        callType: 'webcall',
        language: 'English',
    }
    
];

const RealCallsSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState(industries[0].id);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const audioRef = useRef<HTMLAudioElement>(null);

    const activeIndustry = industries.find(i => i.id === activeTab) || industries[0];

    // Handle Tab Change
    useEffect(() => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.load();
        }
    }, [activeTab]);

    // Handle Play/Pause
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const onTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setCurrentTime(formatTime(current));
            if (total) {
                setProgress((current / total) * 100);
            }
        }
    };

    const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const width = bounds.width;
        const percent = x / width;

        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = percent * audioRef.current.duration;
            setProgress(percent * 100);
        }
    };

    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#f7f9ff] via-white to-[#eef3ff]">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.06),transparent_30%)] pointer-events-none" />
            <div className="hidden md:block absolute inset-8 rounded-[32px] border border-white/50 shadow-[0_10px_80px_rgba(59,130,246,0.08)] bg-white/30 backdrop-blur-[2px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-gray-900 font-heading tracking-tight"
                    >
                        Hear the
                        <span className="text-blue-600 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Difference</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-base sm:text-lg md:text-xl text-gray-500 font-light"
                    >
                        Listen to real conversations handled entirely by our AI across different industries.
                    </motion.p>
                </div>

                {/* Shared audio element for all layouts */}
                <audio
                    ref={audioRef}
                    src={activeIndustry.audioUrl}
                    onTimeUpdate={onTimeUpdate}
                    onEnded={onEnded}
                />

                {/* Mobile layout: stacked cards with inline recordings */}
                <div className="max-w-3xl mx-auto md:hidden">
                    <div className="space-y-5">
                        {industries.map((industry) => {
                            const isActive = activeTab === industry.id;

                            return (
                                <motion.div
                                    key={industry.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-md shadow-blue-900/5 overflow-hidden"
                                >
                                    {/* Demo header (clickable) */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab(industry.id)}
                                        className={`w-full flex items-start justify-between gap-4 px-4 py-4 text-left transition-colors ${
                                            isActive ? 'bg-blue-50/50' : 'bg-white/40 hover:bg-blue-50/30'
                                        }`}
                                    >
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                {industry.label}
                                            </p>
                                            <h3 className="mt-1 text-base font-semibold text-gray-900">
                                                {industry.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {industry.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                                                {industry.callType}
                                            </span>
                                            <span className="text-xs font-mono text-gray-400">
                                                {industry.duration}
                                            </span>
                                            <span
                                                className={`mt-1 inline-flex items-center text-[11px] font-medium ${
                                                    isActive ? 'text-blue-600' : 'text-gray-400'
                                                }`}
                                            >
                                                {isActive ? '' : 'Listen to recording'}
                                            </span>
                                        </div>
                                    </button>

                                    {/* Inline recording card, only for active demo */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="px-4 pb-4 pt-3"
                                        >
                                            <div className="flex flex-col gap-6">
                                                {/* Visualization & Controls */}
                                                <div className="bg-white/80 rounded-2xl p-4 border border-white/60 shadow-lg shadow-blue-900/5 backdrop-blur">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={togglePlay}
                                                            className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95"
                                                        >
                                                            {isPlaying ? (
                                                                <Pause size={28} className="fill-current" />
                                                            ) : (
                                                                <Play size={28} className="fill-current ml-1" />
                                                            )}
                                                        </button>

                                                        <div className="flex-1 space-y-2">
                                                            {/* Timeline */}
                                                            <div
                                                                className="h-10 flex items-center gap-[2px] cursor-pointer group select-none"
                                                                onClick={handleTimelineClick}
                                                            >
                                                                {Array.from({ length: 60 }).map((_, i) => {
                                                                    const barActive = (i / 60) * 100 <= progress;
                                                                    const height =
                                                                        20 + (Math.sin(i * 0.5) * 50 + 50) * 0.4;

                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className={`rounded-full flex-1 transition-all duration-300 ease-in-out ${
                                                                                barActive
                                                                                    ? 'bg-blue-600 opacity-100'
                                                                                    : 'bg-gray-200 group-hover:bg-gray-300'
                                                                            }`}
                                                                            style={{
                                                                                height:
                                                                                    isPlaying && barActive
                                                                                        ? `${height + Math.random() * 20}%`
                                                                                        : `${height}%`,
                                                                                minHeight: '10%',
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>

                                                            <div className="flex justify-between text-xs font-medium text-gray-400 font-mono">
                                                                <span>{currentTime}</span>
                                                                <span>{industry.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Language badge */}
                                                <div className="flex items-center justify-center">
                                                    <div className="inline-flex items-center gap-2 text-gray-500 text-xs bg-white/80 border border-white/70 px-3 py-1.5 rounded-full shadow-sm shadow-blue-900/5 backdrop-blur">
                                                        <Volume2 size={16} />
                                                        <span>{industry.language}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop layout: original two-column design */}
                <div className="hidden md:block max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
                        {/* Selector Column */}
                        <div className="lg:col-span-4 space-y-3 order-2 lg:order-1 max-w-md w-full mx-auto lg:mx-0">
                            {industries.map((industry) => (
                                <button
                                    key={industry.id}
                                    onClick={() => setActiveTab(industry.id)}
                                    className={`
                                        w-full text-left px-4 py-4 md:px-6 md:py-5 rounded-xl transition-all duration-300 group relative overflow-hidden border backdrop-blur
                                        ${activeTab === industry.id
                                            ? 'bg-white/90 border-blue-100 shadow-xl shadow-blue-900/10 ring-1 ring-blue-100/80'
                                            : 'bg-white/50 border-white/60 hover:bg-white/70 hover:border-blue-50'}
                                    `}
                                >
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <h3 className={`font-semibold text-base mb-1 ${activeTab === industry.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {industry.label}
                                            </h3>
                                            <p className={`text-sm ${activeTab === industry.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                                {industry.title}
                                            </p>
                                        </div>
                                        {activeTab === industry.id && (
                                            <motion.div
                                                layoutId="playing-indicator"
                                                className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                                            />
                                        )}
                                    </div>

                                    {/* Active State Gradient Border */}
                                    {activeTab === industry.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Player Column */}
                        <div className="lg:col-span-8 order-1 lg:order-2">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="relative bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-blue-900/10 ring-1 ring-white/60"
                            >
                                <div className="flex flex-col gap-8 md:gap-10">
                                    {/* Info Header */}
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-blue-700 text-xs font-semibold tracking-wide uppercase mb-3 shadow-sm shadow-blue-100">
                                                <Activity size={14} />
                                                {activeIndustry.callType}
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{activeIndustry.title}</h3>
                                            <p className="text-gray-500 text-sm sm:text-base md:text-lg">{activeIndustry.description}</p>
                                        </div>
                                        <div className="hidden md:block text-right">
                                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Duration</p>
                                            <p className="text-2xl font-bold text-gray-900 font-mono">{activeIndustry.duration}</p>
                                        </div>
                                    </div>

                                    {/* Visualization & Controls */}
                                    <div className="bg-white/70 rounded-2xl p-4 sm:p-5 md:p-6 border border-white/60 shadow-lg shadow-blue-900/5 backdrop-blur">
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                                            <button
                                                onClick={togglePlay}
                                                className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95 mx-auto sm:mx-0"
                                            >
                                                {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
                                            </button>

                                            <div className="flex-1 space-y-2">
                                                {/* Timeline */}
                                                <div
                                                    className="h-10 sm:h-12 flex items-center gap-[2px] cursor-pointer group select-none"
                                                    onClick={handleTimelineClick}
                                                >
                                                    {Array.from({ length: 60 }).map((_, i) => {
                                                        const isActive = (i / 60) * 100 <= progress;
                                                        const height = 20 + (Math.sin(i * 0.5) * 50 + 50) * 0.4;

                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`rounded-full flex-1 transition-all duration-300 ease-in-out ${isActive
                                                                    ? 'bg-blue-600 opacity-100'
                                                                    : 'bg-gray-200 group-hover:bg-gray-300'
                                                                    }`}
                                                                style={{
                                                                    height: isPlaying && isActive ? `${height + Math.random() * 20}%` : `${height}%`,
                                                                    minHeight: '10%'
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex justify-between text-xs font-medium text-gray-400 font-mono">
                                                    <span>{currentTime}</span>
                                                    <span>{activeIndustry.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Badge */}
                                    <div className="flex items-center justify-center">
                                        <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-white/80 border border-white/70 px-4 py-2 rounded-full shadow-sm shadow-blue-900/5 backdrop-blur">
                                            <Volume2 size={16} />
                                            <span>{activeIndustry.language}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RealCallsSection;
