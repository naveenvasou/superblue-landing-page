
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Headphones, UserCheck, Banknote, Truck, Star, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

const useCases = [
  {
    id: 'appointment',
    title: 'Appointment Booking',
    description: 'Handle scheduling, confirmations, cancellations, and reminders automatically.',
    icon: Calendar,
    conversation: {
      user: "I need to reschedule my dental cleaning to next Tuesday.",
      ai: "I see a slot at 2:00 PM on Tuesday. Shall I lock that in for you?",
      action: "Appointment Updated: Tue, 2:00 PM"
    }
  },
  {
    id: 'support',
    title: 'Customer Support',
    description: 'Answer common questions, resolve simple issues, and guide callers instantly.',
    icon: Headphones,
    conversation: {
      user: "My order #8821 hasn't arrived yet.",
      ai: "It looks like it's out for delivery and should arrive by 5 PM today.",
      action: "Status Sent: Out for Delivery"
    }
  },
  {
    id: 'lead',
    title: 'Lead Qualification',
    description: 'Call leads, ask the right questions, qualify them, and pass the hot ones to your team.',
    icon: UserCheck,
    conversation: {
      user: "Yes, we are looking for enterprise solutions for 500+ seats.",
      ai: "Great. That qualifies for our Volume Plan. I'll connect you with sales.",
      action: "Lead Qualified: High Value"
    }
  },
  {
    id: 'collection',
    title: 'Loan Collection',
    description: 'Run repayment reminders, EMI follow-ups, and collection nudges naturally.',
    icon: Banknote,
    conversation: {
      user: "I totally forgot about the due date.",
      ai: "No problem. I can process the $450 payment securely right now.",
      action: "Payment Collected: $450.00"
    }
  },
  {
    id: 'cod',
    title: 'COD Confirmation',
    description: 'Confirm COD orders, verify addresses, and reduce RTO effortlessly.',
    icon: Truck,
    conversation: {
      user: "Yes, that's my correct address.",
      ai: "Perfect. I've confirmed your order. It will ship tomorrow morning.",
      action: "Order Verified & Confirmed"
    }
  },
  {
    id: 'feedback',
    title: 'Feedback & Surveys',
    description: 'Collect post-interaction feedback and CSAT scores with zero friction.',
    icon: Star,
    conversation: {
      user: "The agent was very helpful, definitely 5 stars.",
      ai: "Wonderful! Thanks for your feedback. Have a great day.",
      action: "CSAT Score Recorded: 5/5"
    }
  }
];

const VoiceVisualizer = ({ activeId }: { activeId: string }) => {
  const activeCase = useCases.find(c => c.id === activeId) || useCases[0];
  const [step, setStep] = useState(0);

  // Pre-calculate waveform heights for consistent animation
  const waveformHeights = useMemo(() => [16, 28, 24, 20, 12], []);

  // Reset animation step when activeId changes - optimized timing
  useEffect(() => {
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 300);  // User speaks (faster)
    const t2 = setTimeout(() => setStep(2), 1200); // AI speaks
    const t3 = setTimeout(() => setStep(3), 2400); // Action happens

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeId]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl md:rounded-[2.5rem]" />

      {/* Central Visual Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6 md:gap-8">

        {/* The AI Avatar / Voice Waveform */}
        <div className="relative">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl shadow-blue-900/20 transition-all duration-500 ${step >= 2 ? 'scale-110 ring-4 ring-blue-100' : ''}`}>
            {/* Animated Waveform Bars */}
            <div className="flex items-center gap-1 h-8">
              {waveformHeights.map((height, i) => (
                <div
                  key={i}
                  className={`w-1 bg-white rounded-full transition-all duration-300 ${step === 2
                    ? 'animate-[pulse_0.8s_ease-in-out_infinite]'
                    : 'h-2 opacity-50'
                    }`}
                  style={{
                    height: step === 2 ? `${height}px` : undefined,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
          {/* Status Badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            SuperBlue AI
          </div>
        </div>

        {/* Conversation Bubbles */}
        <div className="w-full space-y-3 md:space-y-4">
          {/* User Bubble */}
          <div className={`flex items-start gap-2 md:gap-3 transition-all duration-500 transform ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500" />
            </div>
            <div className="bg-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-slate-700 text-xs md:text-sm max-w-[240px] md:max-w-[280px] break-words">
              "{activeCase.conversation.user}"
            </div>
          </div>

          {/* AI Bubble */}
          <div className={`flex items-start gap-2 md:gap-3 flex-row-reverse transition-all duration-500 transform ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <div className="bg-blue-600 px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tr-none shadow-md shadow-blue-200 text-white text-xs md:text-sm max-w-[240px] md:max-w-[280px] break-words">
              "{activeCase.conversation.ai}"
            </div>
          </div>
        </div>

        {/* Result / Action Card */}
        <div className={`transition-all duration-700 transform ${step >= 3 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
          }`}>
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3 md:p-4 flex items-center gap-3 md:gap-4 w-full max-w-[280px] md:max-w-[320px]">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wide">Action Completed</p>
              <p className="text-slate-900 font-semibold text-xs md:text-sm truncate">{activeCase.conversation.action}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const UseCasesSection: React.FC = () => {
  const [activeId, setActiveId] = useState(useCases[0].id);

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight mb-4 md:mb-6">
            Voice AI for all workflows
          </h2>
          <p className="text-base md:text-lg text-slate-500">
            From support to sales to operations, SuperBlue adapts to the work your team does every day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Navigation List */}
          <div className="space-y-2">
            {useCases.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className={`group cursor-pointer rounded-xl p-4 md:p-5 transition-all duration-300 border-l-4 ${activeId === item.id
                  ? 'bg-slate-50 border-blue-600 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-slate-50/50'
                  }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`mt-1 p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${activeId === item.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base md:text-lg font-semibold mb-1 transition-colors ${activeId === item.id ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className={`w-5 h-5 mt-2 transition-all duration-300 flex-shrink-0 ${activeId === item.id ? 'text-blue-600 opacity-100 translate-x-0' : 'text-slate-400 opacity-0 -translate-x-4'
                    }`} />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Visual Preview (Sticky on Desktop, Mobile Card Below) */}
          {/* Desktop Version */}
          <div className="hidden lg:block min-h-[500px] lg:min-h-[600px] sticky top-32">
            <div className="w-full h-full bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden relative shadow-2xl shadow-slate-200/50">
              <VoiceVisualizer activeId={activeId} />
            </div>
          </div>

          {/* Mobile Version - Shows below active use case */}
          <div className="lg:hidden">
            <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden relative shadow-xl shadow-slate-200/50 min-h-[400px]">
              <VoiceVisualizer activeId={activeId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
