import React from 'react';

const features = [
    {
        title: "Context-Aware Conversations",
        description: "Agents that know exactly which page your user is viewing, allowing for smarter, relevant assistance tailored to their journey.",
        icon: "🧠"
    },
    {
        title: "Multi-lingual Mastery",
        description: "Speak to your global audience in 50+ languages instantly. Break down language barriers and expand your market reach.",
        icon: "🌍"
    },
    {
        title: "Seamless Handoff",
        description: "Smart escalation ensures complex queries are smoothly transferred to human support when empathy and nuanced understanding are needed.",
        icon: "🤝"
    },
    {
        title: "Deep Analytics",
        description: "Track conversation quality, sentiment analysis, and conversion rates in real-time to optimize your customer experience.",
        icon: "📊"
    }
];

const WebFeatures: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                        More Than Just a Voice Bot
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Packed with powerful features designed to drive engagement and results designed for the modern web.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebFeatures;
