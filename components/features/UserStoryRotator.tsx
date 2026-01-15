'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookHeart, ArrowRight } from 'lucide-react';

interface UserStory {
    id: string;
    title: string;
    authorName: string;
    authorInitials?: string;
}

interface UserStoryRotatorProps {
    stories: UserStory[];
}

export default function UserStoryRotator({ stories }: UserStoryRotatorProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (stories.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(interval);
    }, [stories.length]);

    if (!stories || stories.length === 0) {
        return null;
    }

    const current = stories[currentIndex];

    return (
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 -translate-x-1/4" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-indigo-100">
                        <BookHeart size={14} />
                        Healing Stories from Real People
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        You're Not Alone in Your Journey
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Real stories from people living with pain, sharing what they've learned along the way.
                    </p>
                </div>

                {/* Rotating Story Preview */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 border border-indigo-100 p-8 md:p-12 min-h-[200px] flex flex-col justify-center transition-all duration-500">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">
                            {current.title}
                        </h3>
                        <p className="text-center text-slate-600 text-lg">
                            — {current.authorInitials || current.authorName}
                        </p>
                    </div>

                    {/* Pagination Dots */}
                    {stories.length > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {stories.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'w-8 bg-indigo-600'
                                            : 'w-2 bg-slate-300 hover:bg-indigo-400'
                                        }`}
                                    aria-label={`Go to story ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        href="/stories"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200"
                    >
                        Read All Stories
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
