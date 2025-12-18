import React, { useEffect } from 'react';



const RealEstateDemoPage: React.FC = () => {
    useEffect(() => {
        // 1. Create the script element
        const script = document.createElement('script');
        script.src = "https://unpkg.com/superblue-webcall-widget@latest/dist/superblue-voiceai.umd.js";
        script.async = true;

        // 2. Append it to the body
        document.body.appendChild(script);

        // 3. Optional: Cleanup script when component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Real Estate Demo</h1>
            <p className="text-gray-600">The Voice AI widget should appear in the corner.</p>

            {/* The custom element now works with the 'agent-id' prop */}
            <superblue-voiceai agent-id="agent_ojbqujkrhuwo"></superblue-voiceai>
        </div>
    );
};

export default RealEstateDemoPage;
