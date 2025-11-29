import React, { useEffect } from 'react';

const WaitlistPage: React.FC = () => {
    useEffect(() => {
        // Check if script is already present to avoid duplicates
        if (!document.querySelector('script[src="https://app.youform.com/embed.js"]')) {
            const script = document.createElement('script');
            script.src = "https://app.youform.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-32 min-h-screen">
            <div
                data-youform-embed="true"
                data-form="55i3w2js"
                data-width="100%"
                data-height="700"
            ></div>
        </div>
    );
};

export default WaitlistPage;
