import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Headphones, UserCheck, Banknote, Store,
    Sparkles, User, PackageCheck
} from 'lucide-react';

// --- Data ---
const useCases = [
    {
        id: 'appointment',
        title: 'Appointment Booking',
        description: 'Handle scheduling, confirmations, cancellations, and reminders automatically.',
        icon: Calendar,
        conversation: {
            user: "I need to reschedule my cleaning to next Tuesday.",
            userDuration: "01:56",
            aiThought: "Checking available slots for next Tuesday in the calendar system.",
            ai: "I have a slot at 2:00 PM on Tuesday. Shall I book it for you?",
            aiDuration: "00:45"
        }
    },
    {
        id: 'support',
        title: 'Customer Support',
        description: 'Answer common questions, resolve simple issues, and guide callers instantly.',
        icon: Headphones,
        conversation: {
            user: "Where is my order #8821?",
            userDuration: "00:48",
            aiThought: "Looking up order status in the system database.",
            ai: "It's out for delivery! You can expect it by 5 PM today.",
            aiDuration: "00:52"
        }
    },
    {
        id: 'frontdesk',
        title: 'Front Desk',
        description: 'Greet callers, collect details, transfer calls, and handle routine inquiries like a 24/7 receptionist.',
        icon: Store,
        conversation: {
            user: "Can I speak to someone in billing?",
            userDuration: "00:38",
            aiThought: "Routing request to billing department.",
            ai: "Certainly. Transferring you to the billing department now.",
            aiDuration: "00:42"
        }
    },
    {
        id: 'lead',
        title: 'Lead Qualification',
        description: 'Call leads, ask the right questions, qualify them, and pass the hot ones to your team.',
        icon: UserCheck,
        conversation: {
            user: "We need a solution for 500+ employees.",
            userDuration: "01:12",
            aiThought: "Large enterprise requirement detected. Qualifying for Enterprise tier.",
            ai: "That qualifies for our Enterprise Plan. Let me connect you with our team.",
            aiDuration: "01:05"
        }
    },
    {
        id: 'collection',
        title: 'Loan Collection',
        description: 'Run repayment reminders, EMI follow-ups, and collection nudges through natural voice conversations.',
        icon: Banknote,
        conversation: {
            user: "I'm unable to pay as the system keeps hanging.",
            userDuration: "01:32",
            aiThought: "Customer wants to pay but is getting disconnected. Identifying potential problem areas with internal systems.",
            ai: "I'm sorry. There was a technical glitch earlier. Can you try now?",
            aiDuration: "00:45"
        }
    },
    {
        id: 'cod',
        title: 'COD Confirmation',
        description: 'Confirm COD orders, verify details, and reduce RTO with automated follow-up calls.',
        icon: PackageCheck,
        conversation: {
            user: "Yes, that's my correct address.",
            userDuration: "00:36",
            aiThought: "Confirming COD intent and marking the order as accepted to reduce RTO.",
            ai: "Great! Your COD order #7842 for ₹1,499 is scheduled for delivery tomorrow. Will you be available to receive it?",
            aiDuration: "00:48"
        }
    }


];

// --- Components ---

const Waveform = ({ duration, isUser }: { duration: string; isUser: boolean }) => {
    const bars = Array.from({ length: 40 }, () => Math.random() * 100);

    return (
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-[2px] h-4 flex-1 mr-4">
                {bars.map((height, i) => (
                    <div
                        key={i}
                        className={`w-[2px] rounded-full ${isUser ? 'bg-slate-300' : 'bg-blue-200'
                            }`}
                        style={{ height: `${Math.max(height * 0.15, 2)}px` }}
                    />
                ))}
            </div>
            <span className={`text-[10px] font-medium flex-shrink-0 ${isUser ? 'text-slate-500' : 'text-blue-600'
                }`}>
                {duration}
            </span>
        </div>
    );
};

const ConversationBubble = ({
    text,
    type,
    delay,
    avatar,
    duration = "00:05"
}: {
    text: string;
    type: 'user' | 'ai' | 'thought';
    delay: number;
    avatar?: string;
    duration?: string;
}) => {
    const isUser = type === 'user';
    const isThought = type === 'thought';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className={`flex gap-4 mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
            )}

            <div className="flex flex-col max-w-[85%]">
                {isThought ? (
                    <div className="flex items-start gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex-1 text-xs text-slate-500 italic">
                            {text}
                        </div>
                    </div>
                ) : (
                    <div className={`p-4 rounded-lg shadow-sm border min-h-[100px] ${isUser
                        ? 'bg-white text-slate-800 rounded-tr-md border-slate-100'
                        : 'bg-white text-slate-800 rounded-tl-md border-slate-100'
                        }`}>
                        <Waveform duration={duration} isUser={isUser} />

                        <div className="text-[8px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                            {isUser ? 'Customer' : 'SuperBlue AI'}
                        </div>
                        <div className="text-slate-900 text-sm font-medium leading-relaxed">
                            {text}
                        </div>
                    </div>
                )}
            </div>

            {isUser && avatar && (
                <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-slate-100 shadow-md mt-1">
                    <img src={avatar} alt="User" className="w-full h-full object-cover" />
                </div>
            )}
            {isUser && !avatar && (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                    <User className="w-5 h-5 text-slate-500" />
                </div>
            )}
        </motion.div>
    );
};

const Visualizer = ({ activeCase }: { activeCase: typeof useCases[0] }) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            {/* TUNING VARIABLE: max-w-2xl controls width (options: max-w-xl, max-w-2xl, max-w-3xl) */}
            <div className="relative w-full max-w-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 rounded-2xl" />

                {/* TUNING VARIABLES: px-14 controls horizontal padding, py-14 controls vertical padding (height) */}
                <div className="relative p-10 md:p-14">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCase.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ConversationBubble
                                text={activeCase.conversation.user}
                                type="user"
                                delay={0.1}
                                duration={activeCase.conversation.userDuration}
                            />

                            <ConversationBubble
                                text={activeCase.conversation.aiThought}
                                type="thought"
                                delay={0.4}
                            />

                            <ConversationBubble
                                text={activeCase.conversation.ai}
                                type="ai"
                                delay={0.7}
                                duration={activeCase.conversation.aiDuration}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const UseCaseItem = ({
    item,
    isActive,
    onClick
}: {
    item: typeof useCases[0];
    isActive: boolean;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer transition-all duration-200 ${isActive ? '' : 'opacity-60 hover:opacity-100'
                }`}
        >
            <div className="flex items-start gap-5 py-6 border-b border-slate-100">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                    <item.icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                    <h3 className={`text-xl font-semibold mb-2 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                        {item.title}
                    </h3>

                    <AnimatePresence>
                        {isActive && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-sm text-slate-500 leading-relaxed overflow-hidden"
                            >
                                {item.description}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const UseCasesSectionV3: React.FC = () => {
    const [activeId1, setActiveId1] = useState(useCases[0].id);
    const [activeId2, setActiveId2] = useState(useCases[3].id);
    const [activeMobileId, setActiveMobileId] = useState(useCases[0].id);

    const group1 = useCases.slice(0, 3);
    const group2 = useCases.slice(3, 6);

    return (
        <section id="use-cases" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-medium text-slate-900 tracking-tight mb-6">
                        Use Cases
                    </h2>
                    <p className="text-lg text-slate-500">
                        SuperBlue handles complex conversations with human-like empathy and precision.
                    </p>
                </div>

                {/* Mobile View: Single List */}
                <div className="lg:hidden space-y-3">
                    {useCases.map((item) => (
                        <div key={item.id}>
                            <UseCaseItem
                                item={item}
                                isActive={activeMobileId === item.id}
                                onClick={() => setActiveMobileId(item.id)}
                            />
                            <AnimatePresence>
                                {activeMobileId === item.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 mb-8">
                                            <Visualizer activeCase={item} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Split Groups */}
                <div className="hidden lg:block space-y-24">
                    {/* Group 1 */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="lg:order-1">
                            <Visualizer activeCase={useCases.find(c => c.id === activeId1) || group1[0]} />
                        </div>
                        <div className="lg:order-2">
                            <div className="space-y-3">
                                {group1.map((item) => (
                                    <div key={item.id}>
                                        <UseCaseItem
                                            item={item}
                                            isActive={activeId1 === item.id}
                                            onClick={() => setActiveId1(item.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Group 2 */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="order-1">
                            <div className="space-y-0">
                                {group2.map((item) => (
                                    <div key={item.id}>
                                        <UseCaseItem
                                            item={item}
                                            isActive={activeId2 === item.id}
                                            onClick={() => setActiveId2(item.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-2">
                            <Visualizer activeCase={useCases.find(c => c.id === activeId2) || group2[0]} />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default UseCasesSectionV3;
