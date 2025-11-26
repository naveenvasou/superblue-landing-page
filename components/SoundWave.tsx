import React, { useEffect, useRef } from "react";

const SoundWave: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        // Much smoother, slower, more premium wave
        const getWaveY = (mathX: number, t: number, phase: number) => {
            const oscillation = Math.sin(mathX + t + phase);
            const decay = Math.exp(-0.01 * mathX); // gentler decay
            return oscillation * decay * 50; // lowered amplitude
        };

        const render = () => {
            time += 0.01; // slower animation
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const height = canvas.height;
            const baseHeight = height * 0.5 ;

            // One unified soft gradient (premium)
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.25)");
            gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.15)");
            gradient.addColorStop(1, "rgba(59, 130, 246, 0.25)");

            // --- LEFT WAVES ---
            for (let i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = gradient;
                ctx.globalAlpha = 1 - i * 0.2;

                for (let x = 0; x <= width; x += 6) {
                    const mathX = x * 0.02;
                    const yOffset = getWaveY(mathX, time, i * 1.2);
                    const y = baseHeight + yOffset;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // --- RIGHT WAVES (phase offset, slight speed shift) ---
            for (let i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = gradient;
                ctx.globalAlpha = 0.4 - i * 0.15;

                for (let x = 0; x <= width; x += 6) {
                    const mathX = (width - x) * 0.02;
                    const yOffset = getWaveY(mathX, time * 0.9, i * 1.8 + 2.5);
                    const y = baseHeight + yOffset;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default SoundWave;
