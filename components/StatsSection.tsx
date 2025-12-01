import React from 'react';
import { Zap, ShieldCheck, Hourglass } from 'lucide-react';

const stats = [
    {
        value: '<500 ms',
        label: 'Response Latency',
        icon: Zap,
    },
    {
        value: '99%',
        label: 'Uptime',
        icon: ShieldCheck,
    },
    {
        value: '15 min+',
        label: 'Call Duration',
        icon: Hourglass,
    },
];

const StatsSection: React.FC = () => {
     return (
         <section className="w-full py-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden" aria-label="Key statistics">
             {/* Subtle Background Gradients */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px]" />
            </div>

            <div className="mx-3 max-w-6xl mx-auto px-2 md:px-12 relative z-10">
                <div className="grid grid-cols-3 gap-2 md:gap-8 divide-x divide-slate-200/60" role="list" aria-label="Performance metrics">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 py-2 md:py-0" role="listitem">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 text-blue-600">
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <div className="flex flex-col text-center md:text-left">
                                <span className="text-xs md:text-xl font-semibold font-heading text-slate-900 leading-none mb-1">
                                    {stat.value}
                                </span>
                                <span className="text-[8px] md:text-xs font-medium text-slate-500 tracking-wider leading-tight">
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
