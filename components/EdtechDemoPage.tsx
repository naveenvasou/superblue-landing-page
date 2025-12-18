import React, { useEffect } from 'react';

// This tells TypeScript that <superblue-voiceai> is a valid HTML element
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'superblue-voiceai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'agent-id': string;
            };
        }
    }
}

const EdtechDemoPage: React.FC = () => {
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
            <h1 className="text-2xl font-bold">Edtech Demo</h1>
            <p className="text-gray-600">The Voice AI widget should appear in the corner.</p>

            {/* The custom element now works with the 'agent-id' prop */}
            <superblue-voiceai agent-id="agent_rnrp7rn5efgp"></superblue-voiceai>
        </div>
    );
};

export default EdtechDemoPage;
