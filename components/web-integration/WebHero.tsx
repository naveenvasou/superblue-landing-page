import React, { useState } from 'react';
import PilotDialog from '../PilotDialog';

const WebHero: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <section className="relative w-full pt-18 md:pt-48 md:pb-24 overflow-hidden flex flex-col items-center justify-center min-h-[70vh] md:min-h-[80vh] bg-white">
            {/* Aesthetic Gradient Background - Reusing the "Rotating Aura" from Home Hero */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div
                    className="hidden md:block w-[300vw] h-[300vw] opacity-40 blur-[150px] animate-[spin_6s_linear_infinite]"
                    style={{
                        background: `conic-gradient(
              from 0deg at 50% 50%,
              #FFFFFF 0deg,
              #E0F2FE 60deg,
              #3B82F6 120deg,
              #E0F2FE 180deg,
              #FFFFFF 240deg,
              #60A5FA 300deg,
              #FFFFFF 360deg
            )`
                    }}
                />
                <div
                    className="md:hidden w-[240vw] h-[240vw] opacity-50 blur-[80px] animate-[spin_8s_linear_infinite]"
                    style={{
                        background: `conic-gradient(
              from 0deg at 50% 50%,
              #DBEAFE 0deg,
              #3B82F6 120deg,
              #DBEAFE 180deg,
              #60A5FA 300deg,
              #DBEAFE 360deg
            )`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/60 md:to-white/90"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                <h1 className="px-4 md:px-20 text-[2rem] md:text-[4rem] lg:text-[4.5rem] font-regular tracking-tight text-slate-900 leading-[1.2] mb-8">
                    Transform Your Website with <span className="text-blue-600">Intelligent Voice Agents</span>
                </h1>

                <p className="px-4 md:px-32 text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
                    Engage visitors, capture leads, and provide instant support with human-like voice interactions.
                    Deploy in minutes, no coding required.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="px-8 py-4 bg-slate-950 text-white rounded-full text-lg font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-[90%] md:w-auto min-w-[200px]"
                    >
                        Start a pilot
                    </button>

                    <a href="#features" className="px-8 py-4 bg-white text-slate-900 border border-slate-900 rounded-full text-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 w-[90%] md:w-auto min-w-[200px]">
                        Explore features
                    </a>
                </div>
            </div>
            <PilotDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </section>
    );
};

export default WebHero;
