import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Headphones, UserCheck, Banknote, Store,
    ArrowRight, CheckCircle2, Sparkles, Zap, MessageSquare
} from 'lucide-react';

// --- Data ---
const useCases = [
    {
        id: 'appointment',
        title: 'Appointment Booking',
        description: 'Handle scheduling, confirmations, cancellations, and reminders automatically.',
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        conversation: {
            user: "I need to reschedule my cleaning to next Tuesday.",
            ai: "I have a slot at 2:00 PM on Tuesday. Shall I book it?",
            action: "Appointment Confirmed"
        }
    },
    {
        id: 'support',
        title: 'Customer Support',
        description: 'Answer common questions, resolve simple issues, and guide callers instantly.',
        icon: Headphones,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        conversation: {
            user: "Where is my order #8821?",
            ai: "It's out for delivery! Expect it by 5 PM today.",
            action: "Status: Out for Delivery"
        }
    },
    {
        id: 'lead',
        title: 'Lead Qualification',
        description: 'Call leads, ask the right questions, qualify them, and pass the hot ones to your team.',
        icon: UserCheck,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        conversation: {
            user: "We need a solution for 500+ employees.",
            ai: "That qualifies for our Enterprise Plan. Connecting you now.",
            action: "Lead Qualified: High Value"
        }
    },
    {
        id: 'collection',
        title: 'Loan Collection',
        description: 'Run repayment reminders, EMI follow-ups, and collection nudges through natural voice conversations.',
        icon: Banknote,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        conversation: {
            user: "I forgot the due date, sorry.",
            ai: "No worries. I can process the $450 payment now securely.",
            action: "Payment Collected: $450"
        }
    },
    {
        id: 'frontdesk',
        title: 'Front Desk',
        description: 'Greet callers, collect details, transfer calls, and handle routine inquiries like a 24/7 receptionist.',
        icon: Store,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        conversation: {
            user: "Can I speak to someone in billing?",
            ai: "Certainly. Transferring you to the billing department now.",
            action: "Call Transferred: Billing"
        }
    }
];

// --- Components ---

const ChatBubble = ({ text, isAi, delay }: { text: string, isAi: boolean, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: isAi ? -10 : 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-6`}
    >
        <div className={`flex gap-3 max-w-[90%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isAi ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                {isAi ? <Sparkles className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isAi
                ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                : 'bg-blue-50 text-blue-900 rounded-tr-none'
                }`}>
                {text}
            </div>
        </div>
    </motion.div>
);

const ActionStatus = ({ action, color }: { action: string, color: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-auto pt-6 border-t border-slate-100"
    >
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            {action}
        </div>
    </motion.div>
);

const Visualizer = ({ activeCase }: { activeCase: typeof useCases[0] }) => {
    return (
        <div className="w-full h-full flex flex-col justify-center">
            <div className="relative w-full bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeCase.bg}`}>
                            <activeCase.icon className={`w-4 h-4 ${activeCase.color}`} />
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{activeCase.title}</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[320px] flex flex-col bg-slate-50/30">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeCase.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-1">
                                <ChatBubble text={activeCase.conversation.user} isAi={false} delay={0.1} />
                                <ChatBubble text={activeCase.conversation.ai} isAi={true} delay={0.6} />
                            </div>
                            <ActionStatus action={activeCase.conversation.action} color={activeCase.color} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const UseCasesSectionV2: React.FC = () => {
    const [activeId, setActiveId] = useState(useCases[0].id);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Left Column: Compact Grid List */}
                    <div className="flex-1 lg:max-w-[55%]">
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight">
                                Real-World Applications
                            </h2>
                            <p className="text-slate-500 text-lg">
                                Automate complex voice interactions across every touchpoint.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {useCases.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setActiveId(item.id)}
                                    className={`cursor-pointer rounded-xl p-6 transition-all duration-200 border-2 text-left ${activeId === item.id
                                        ? 'bg-blue-50/50 border-blue-500 shadow-sm'
                                        : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <h3 className={`font-bold text-lg mb-2 ${activeId === item.id ? 'text-blue-700' : 'text-slate-900'
                                        }`}>
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Sticky Visualizer */}
                    <div className="flex-1 w-full hidden lg:block sticky top-32">
                        <Visualizer activeCase={useCases.find(c => c.id === activeId) || useCases[0]} />
                    </div>

                    {/* Mobile Visualizer */}
                    <div className="lg:hidden w-full mt-8">
                        <Visualizer activeCase={useCases.find(c => c.id === activeId) || useCases[0]} />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default UseCasesSectionV2;
