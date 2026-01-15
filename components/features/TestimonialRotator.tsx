'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

interface Testimonial {
    id: string;
    clientName: string;
    clientInitials?: string;
    rating: number;
    testimonialText: string;
}

interface TestimonialRotatorProps {
    testimonials: Testimonial[];
}

export default function TestimonialRotator({ testimonials }: TestimonialRotatorProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (testimonials.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [testimonials.length]);

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const current = testimonials[currentIndex];

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={20}
                        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-30 translate-y-1/2 translate-x-1/4" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-emerald-100">
                        <Star size={14} className="fill-emerald-600" />
                        Client Testimonials
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        What Clients Say About Kathleen
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Real experiences from clients who have found relief through energy healing.
                    </p>
                </div>

                {/* Rotating Testimonial */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-200/50 border border-emerald-100 p-8 md:p-12 min-h-[280px] flex flex-col justify-center transition-all duration-500">
                        {/* Rating */}
                        <div className="mb-6">
                            {renderStars(current.rating)}
                        </div>

                        {/* Testimonial Text */}
                        <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-6 text-center italic">
                            "{current.testimonialText}"
                        </blockquote>

                        {/* Author */}
                        <p className="text-center text-slate-600 font-semibold">
                            — {current.clientInitials || current.clientName}
                        </p>
                    </div>

                    {/* Pagination Dots */}
                    {testimonials.length > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'w-8 bg-emerald-600'
                                            : 'w-2 bg-slate-300 hover:bg-emerald-400'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        href="/testimonials"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-200"
                    >
                        Read All Testimonials
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
