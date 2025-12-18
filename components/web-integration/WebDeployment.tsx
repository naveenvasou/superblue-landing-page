import React from 'react';

const WebDeployment: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Abstract background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                        Deploy in Minutes,<br />
                        <span className="text-blue-400">No Engineering Required.</span>
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                        Integrating SuperBlue into your website is as simple as copying and pasting a single line of code.
                        We handle the hosting, scaling, and maintenance.
                    </p>

                    <ul className="space-y-4 mb-8">
                        {[
                            "Universal compatibility (React, Vue, WordPress, etc.)",
                            "Lightweight script (< 5kb)",
                            "Fully customizable appearance"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mock Code Snippet Block */}
                <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700 font-mono text-sm overflow-hidden">
                    <div className="flex gap-2 mb-4 opacity-50">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-slate-300">
                        <span className="text-blue-400">&lt;script</span> <span className="text-purple-400">src</span>=<span className="text-green-400">"https://cdn.superblue.ai/widget.js"</span><span className="text-blue-400">&gt;&lt;/script&gt;</span>
                        <br />
                        <span className="text-blue-400">&lt;script&gt;</span>
                        <br />
                        &nbsp;&nbsp;SuperBlue.<span className="text-yellow-400">init</span>({'{'}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">agentId</span>: <span className="text-green-400">"your-agent-id"</span>,
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">theme</span>: <span className="text-green-400">"light"</span>
                        <br />
                        &nbsp;&nbsp;{'}'});
                        <br />
                        <span className="text-blue-400">&lt;/script&gt;</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WebDeployment;
