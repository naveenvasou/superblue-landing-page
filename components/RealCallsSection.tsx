import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, ChevronRight, Activity } from 'lucide-react';

const industries = [
    {
        id: 'real-estate',
        label: 'Real Estate',
        title: 'Lead Qualification',
        description: 'Automated scheduling & property inquiries',
        duration: '2:19',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_ev9cd6b766wr.wav',
    },
    {
        id: 'edtech',
        label: 'EdTech',
        title: 'Student Counseling',
        description: 'Course information & enrollment support',
        duration: '2:15',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_18x2ya2wtvp8.wav',
    },
    {
        id: 'ecommerce',
        label: 'E-commerce',
        title: 'Order Support',
        description: 'Tracking, returns & modifications',
        duration: '0:55',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_18x2ya2wtvp8.wav',
    },
    {
        id: 'banking',
        label: 'Banking',
        title: 'Loan Inquiry',
        description: 'Eligibility checks & application help',
        duration: '1:20',
        audioUrl: 'https://storage.googleapis.com/superblue-call-recordings/recordings/conv_18x2ya2wtvp8.wav',
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
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 font-heading tracking-tight"
                    >
                        Hear the
                        <span className="text-blue-600 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Difference</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-gray-500 font-light"
                    >
                        Listen to real conversations handled entirely by our AI across different industries.
                    </motion.p>
                </div>

                {/* Main Content Layout */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Selector Column */}
                        <div className="lg:col-span-4 space-y-3">
                            {industries.map((industry) => (
                                <button
                                    key={industry.id}
                                    onClick={() => setActiveTab(industry.id)}
                                    className={`
                                        w-full text-left px-6 py-5 rounded-xl transition-all duration-300 group relative overflow-hidden border
                                        ${activeTab === industry.id
                                            ? 'bg-white border-blue-100 shadow-xl shadow-blue-900/5'
                                            : 'bg-transparent border-transparent hover:bg-gray-50'}
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
                        <div className="lg:col-span-8">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="relative bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-gray-200/50"
                            >
                                <audio
                                    ref={audioRef}
                                    src={activeIndustry.audioUrl}
                                    onTimeUpdate={onTimeUpdate}
                                    onEnded={onEnded}
                                />

                                <div className="flex flex-col gap-10">
                                    {/* Info Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-xs font-semibold tracking-wide uppercase mb-3">
                                                <Activity size={14} />
                                                Live Recording
                                            </div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{activeIndustry.title}</h3>
                                            <p className="text-gray-500 text-lg">{activeIndustry.description}</p>
                                        </div>
                                        <div className="hidden md:block text-right">
                                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Duration</p>
                                            <p className="text-2xl font-bold text-gray-900 font-mono">{activeIndustry.duration}</p>
                                        </div>
                                    </div>

                                    {/* Visualization & Controls */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/50">
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={togglePlay}
                                                className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95"
                                            >
                                                {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
                                            </button>

                                            <div className="flex-1 space-y-2">
                                                {/* Timeline */}
                                                <div
                                                    className="h-12 flex items-center gap-[2px] cursor-pointer group select-none"
                                                    onClick={handleTimelineClick}
                                                >
                                                    {Array.from({ length: 60 }).map((_, i) => {
                                                        const isActive = (i / 60) * 100 <= progress;
                                                        // Create a random-looking but static pattern based on index
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
                                        <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                                            <Volume2 size={16} />
                                            <span>High Fidelity Neural Voice • English (US)</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer Stat */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-block bg-white border border-gray-100 shadow-sm rounded-full px-8 py-3">
                            <span className="text-gray-500">Proven Results: </span>
                            <span className="text-gray-900 font-bold">80% higher conversion rate</span>
                            <span className="text-gray-500"> vs human agents</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default RealCallsSection;
