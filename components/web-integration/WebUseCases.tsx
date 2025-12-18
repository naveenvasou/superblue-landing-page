import React from 'react';

const useCases = [
    {
        title: "E-commerce",
        heading: "Guide Shoppers to the Perfect Product",
        description: "Act as a personal shopper, helping customers find items, check stock, and complete purchases with voice commands.",
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "SaaS Onboarding",
        heading: "Walk Users Through Complex Flows",
        description: "Provide real-time, interactive guidance for new users navigating your dashboard, reducing churn and support tickets.",
        color: "bg-purple-50 text-purple-600"
    },
    {
        title: "Real Estate",
        heading: "Qualify Buyers & Schedule Viewings",
        description: "Engage visitors instantly, answer property questions, and book appointments directly into your calendar.",
        color: "bg-green-50 text-green-600"
    }
];

const WebUseCases: React.FC = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="mb-16">
                    <span className="text-blue-600 font-medium tracking-wide uppercase text-sm">Use Cases</span>
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mt-2 mb-4">
                        Built for Every Business Model
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {useCases.map((useCase, index) => (
                        <div key={index} className="group relative bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors duration-300">
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 ${useCase.color}`}>
                                {useCase.title}
                            </div>
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                {useCase.heading}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {useCase.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebUseCases;
