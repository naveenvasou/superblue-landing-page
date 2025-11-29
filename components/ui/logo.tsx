import React from 'react';

interface SuperblueLogoProps {
    className?: string;
    withText?: boolean;
}

export default function SuperblueLogo({ className = "w-10 h-10", withText = false }: SuperblueLogoProps) {
    const glowId = React.useId();
    const gradientId = React.useId();

    return (
        <div className="flex items-center gap-2">
            <svg
                viewBox="0 0 300 300"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                        <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.1" />
                        <stop offset="60%" stopColor="#2563eb" stopOpacity="0.6" />
                        <stop offset="80%" stopColor="#1d4ed8" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <circle
                    cx="150"
                    cy="150"
                    r="120"
                    fill={`url(#${gradientId})`}
                    filter={`url(#${glowId})`}
                />

                {/* Inner subtle ring for detail */}
                <circle
                    cx="150"
                    cy="150"
                    r="90"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    filter={`url(#${glowId})`}
                />
            </svg>

            {withText && (
                <h1 className="text-4xl font-bold text-gray-900 tracking-wider">
                    superblue
                </h1>
            )}
        </div>
    );
}
