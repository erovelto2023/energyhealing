'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface GlossaryTerm {
    id: string;
    slug?: string;
    term: string;
    shortDefinition?: string;
    definition: string;
    niche?: string;
}

interface GlossaryRotatorProps {
    terms: GlossaryTerm[];
}

export default function GlossaryRotator({ terms }: GlossaryRotatorProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (terms.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % terms.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [terms.length, isPaused]);

    if (!terms || terms.length === 0) return null;

    const current = terms[currentIndex];

    // Clean definition
    const cleanDef = (text: string) => {
        return text.replace(/[#*`]/g, '').substring(0, 180).trim() + (text.length > 180 ? '...' : '');
    };

    const definition = current.shortDefinition || cleanDef(current.definition);

    return (
        <section className="bg-white pb-16">
            <div className="max-w-2xl mx-auto px-6">
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="absolute -top-3 -left-3 -right-3 -bottom-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-[2.5rem] -z-10 transform rotate-1"></div>

                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-emerald-100/50 border border-slate-100 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-500"></div>

                        <div className="mb-4 flex justify-center">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                                Glossary Term
                            </span>
                        </div>

                        <Link href={`/glossary/${current.slug || current.id}`} className="block">
                            <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors">
                                {current.term}
                            </h3>
                            <p className="text-slate-600 text-lg leading-relaxed font-light mb-6 min-h-[5rem]">
                                {definition}
                            </p>

                            <div className="inline-flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
                                Read Definition <ArrowRight size={14} className="ml-2" />
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {terms.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200 hover:bg-emerald-300'}`}
                                aria-label={`View term ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
