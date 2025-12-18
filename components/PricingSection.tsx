import React from 'react';
import { Check, X } from 'lucide-react';

const PricingSection: React.FC = () => {
    const plans = [
        {
            name: 'Starter',
            price: '₹2,000',
            period: '/ month',
            validity: '1 Month',
            description: 'Perfect for individuals and small tests.',
            features: [
                { text: '250 Free Call Minutes', included: true },
                { text: 'Create up to 1 Agent', included: true },
                { text: 'Validity: 1 Month', included: true },
                { text: 'Additional mins: ₹5 / min', included: true },
                { text: 'Real-time Actions', included: false },
            ],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Growth',
            price: '₹6,000',
            period: '/ month',
            validity: '1 Month',
            description: 'Ideal for growing businesses.',
            features: [
                { text: '1,000 Free Call Minutes', included: true },
                { text: 'Create up to 3 Agents', included: true },
                { text: 'Validity: 1 Month', included: true },
                { text: 'Additional mins: ₹4 / min', included: true },
                { text: 'Real-time Actions', included: true },
            ],
            cta: 'Choose Growth',
            popular: true,
        },
        {
            name: 'Business',
            price: '₹12,000',
            period: '/ 3 months',
            validity: '3 Months',
            description: 'For power users and scaling teams.',
            features: [
                { text: '3,000 Free Call Minutes', included: true },
                { text: 'Create up to 5 Agents', included: true },
                { text: 'Validity: 3 Months', included: true },
                { text: 'Additional mins: ₹3 / min', included: true },
                { text: 'Real-time Actions', included: true },
            ],
            cta: 'Go Business',
            popular: false,
        },
    ];

    return (
        <section className="relative py-24 bg-slate-50 overflow-hidden" id="pricing">
            {/* Background Decor - Simplified */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60 mix-blend-multiply" />
                <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-slate-100 rounded-full blur-3xl opacity-60 mix-blend-multiply" />
            </div>

            <div className="container relative mx-auto px-4 z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-600">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative group bg-white rounded-3xl p-8 border transition-all duration-300 ${plan.popular ? 'border-blue-600 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-sm hover:shadow-md'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm tracking-wide">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <p className="text-slate-500 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500 ml-2 text-sm">{plan.period}</span>
                                </div>
                                <div className="mt-2 text-xs font-medium text-slate-400">
                                    Validity: <span className="text-slate-600">{plan.validity}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className={`flex items-center ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                                        <div className={`p-1 rounded-full mr-3 shrink-0 ${feature.included ? 'bg-blue-50' : 'bg-slate-100'}`}>
                                            {feature.included ? (
                                                <Check size={14} className="text-blue-600" strokeWidth={3} />
                                            ) : (
                                                <X size={14} className="text-slate-400" strokeWidth={3} />
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${feature.included ? '' : 'line-through decoration-slate-300'}`}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-200 ${plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                                    : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 text-sm">
                        Need more agents or custom minutes? <a href="#contact" className="text-blue-600 font-semibold hover:underline">Contact Sales</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
