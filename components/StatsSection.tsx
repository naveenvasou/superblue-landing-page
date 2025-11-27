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
        <section className="w-full py-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
            {/* Subtle Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-center gap-4 py-4 md:py-0">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 text-blue-600">
                                <stat.icon size={20} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-semibold text-slate-900 leading-none mb-1">
                                    {stat.value}
                                </span>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
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
