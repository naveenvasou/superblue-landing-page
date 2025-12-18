import React, { useState } from 'react';
import PilotDialog from '../PilotDialog';

const WebCTA: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <section className="py-32 bg-white text-center">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-8 tracking-tight">
                    Ready to Upgrade Your Website Experience?
                </h2>
                <p className="text-xl text-slate-600 mb-12">
                    Join forward-thinking businesses using SuperBlue to connect with customers in a whole new way.
                </p>

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="px-10 py-5 bg-blue-600 text-white rounded-full text-xl font-medium hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                    Start Your Pilot Now
                </button>
            </div>

            <PilotDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </section>
    );
};

export default WebCTA;
