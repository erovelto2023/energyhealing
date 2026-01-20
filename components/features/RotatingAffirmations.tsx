"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IAffirmation } from '@/lib/models/Affirmation';
import { Sparkles, ArrowRight, Pause, Play } from 'lucide-react';

interface RotatingAffirmationsProps {
    affirmations: IAffirmation[];
    intervalSeconds?: number;
}

export default function RotatingAffirmations({ affirmations, intervalSeconds = 6 }: RotatingAffirmationsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        if (affirmations.length <= 1) return;
        if (isPaused) return;

        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % affirmations.length);
                setFade(true);
            }, 500); // 500ms fade out
        }, intervalSeconds * 1000);

        return () => clearInterval(interval);
    }, [affirmations.length, intervalSeconds, isPaused]);

    if (!affirmations || affirmations.length === 0) return null;

    const current = affirmations[currentIndex];

    // If data is somehow missing titles/slugs, fallback safely
    if (!current) return null;

    return (
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 border-y border-purple-100 py-16 px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white bg-opacity-80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-purple-800 mb-8 border border-purple-100 shadow-sm">
                    <Sparkles size={14} className="text-purple-500" />
                    Daily Rituals
                </div>

                <div
                    className={`transition-all duration-700 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <Link href={`/affirmations/${current.slug}`} className="block group">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-purple-900 transition-colors">
                            {current.title}
                        </h2>
                        <p className="font-serif italic text-xl md:text-3xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8 group-hover:text-purple-700 transition-colors">
                            "{current.affirmation}"
                        </p>

                        <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-purple-600 uppercase tracking-wider transition-colors">
                            Start Ritual <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mt-12">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="text-slate-300 hover:text-purple-500 transition-colors p-2"
                        title={isPaused ? "Resume" : "Pause"}
                    >
                        {isPaused ? <Play size={16} strokeWidth={3} /> : <Pause size={16} strokeWidth={3} />}
                    </button>
                    <div className="flex gap-2">
                        {affirmations.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setFade(false); setTimeout(() => { setCurrentIndex(idx); setFade(true); }, 200); }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-purple-600' : 'bg-slate-300 hover:bg-purple-300'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
