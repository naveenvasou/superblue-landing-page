
import React from 'react';
import { Zap, Languages, Globe, Command, UserCheck, AudioWaveform, ArrowUpRight } from 'lucide-react';

const features = [
  {
    title: 'Lowest Latency',
    description: 'Sub-second responses for smooth, human-like conversations that feel natural and engaging.',
    icon: Zap,
    colSpan: 'md:col-span-1 lg:col-span-1',
  },
  {
    title: 'Global Language Support',
    description: 'Instantly switch between languages based on user preference, making your agent truly global.',
    icon: Languages,
    colSpan: 'md:col-span-1 lg:col-span-1',
  },
  {
    title: 'Seamless Web Integration',
    description: 'Embed powerful voice capabilities directly into your website with just a few lines of code.',
    icon: Globe,
    colSpan: 'md:col-span-2 lg:col-span-1',
  },
  {
    title: 'Real-time Actions',
    description: 'Perform complex tasks while on the call—sending emails, scheduling, and verifying data.',
    icon: Command,
    colSpan: 'md:col-span-2 lg:col-span-2',
  },
  {
    title: 'Smart Human Handoff',
    description: 'Intelligently transfer calls to human agents with full context when complex situations arise.',
    icon: UserCheck,
    colSpan: 'md:col-span-2 lg:col-span-1',
  },
  {
    title: 'Natural Interruption Handling',
    description: 'Our agents handle interruptions gracefully, stopping and listening just like a real person would.',
    icon: AudioWaveform,
    colSpan: 'md:col-span-2 lg:col-span-3',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Powerful Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight mb-6 leading-tight">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">human connection</span>,<br />
            engineered for scale.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Experience the next generation of voice AI. Fast, intelligent, and indistinguishable from magic.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 ${feature.colSpan}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 rounded-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
