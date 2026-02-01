
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const HeroBackground: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Gentle pulsing animation
    const pulse = Math.sin(frame / 30) * 0.1 + 1;

    // Slow rotation
    const rotation = frame * 0.2;

    // Color shifting gradient background
    // We can simulate this by moving a large gradient background
    const bgPos = interpolate(
        frame,
        [0, durationInFrames],
        [0, 100]
    );

    // Floating orbs configuration
    const orb1Y = interpolate(frame, [0, durationInFrames / 2, durationInFrames], [20, 40, 20], { extrapolateRight: "clamp" });
    const orb2Y = interpolate(frame, [0, durationInFrames / 2, durationInFrames], [60, 40, 60], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: '#F0FDF4', overflow: 'hidden' }}>
            {/* Animated Gradient Background Layer */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'linear-gradient(120deg, #ecfdf5 0%, #d1fae5 50%, #ccfbf1 100%)',
                    transform: `scale(1.5) translate(${Math.sin(frame * 0.01) * 5}%, ${Math.cos(frame * 0.01) * 5}%)`
                }}
            />

            {/* Floating Orb 1 (Emerald) */}
            <div
                className="absolute rounded-full blur-3xl opacity-30"
                style={{
                    width: '600px',
                    height: '600px',
                    background: '#10b981', // emerald-500
                    top: `${orb1Y - 20}%`,
                    left: '10%',
                    transform: `scale(${pulse}) rotate(${rotation}deg)`,
                }}
            />

            {/* Floating Orb 2 (Teal) */}
            <div
                className="absolute rounded-full blur-3xl opacity-20"
                style={{
                    width: '700px',
                    height: '700px',
                    background: '#14b8a6', // teal-500
                    bottom: `${orb2Y - 20}%`,
                    right: '10%',
                    transform: `scale(${pulse * 0.9}) rotate(-${rotation}deg)`,
                }}
            />

            {/* Floating Orb 3 (White/Light for contrast) */}
            <div
                className="absolute rounded-full blur-3xl opacity-40"
                style={{
                    width: '400px',
                    height: '400px',
                    background: '#ffffff',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${pulse * 1.1})`,
                }}
            />

            {/* Subtle Texture/Noise overlay if desired (optional) */}
            <AbsoluteFill className="opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,...")' }} />
        </AbsoluteFill>
    );
};
