'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Testimonial {
    id: string;
    clientName: string;
    clientInitials?: string;
    clientPhoto?: string;
    rating: number;
    testimonialText: string;
    issue?: string;
    outcome?: string;
    sessionType?: string;
    location?: string;
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying || testimonials.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000); // Auto-advance every 6 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const current = testimonials[currentIndex];

    const nextSlide = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={18}
                className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
            />
        ));
    };

    return (
        <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/4" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-emerald-100">
                        <Star size={14} className="fill-emerald-600" />
                        Client Experiences
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Healing Stories from Real People
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Discover how energy healing has transformed lives and brought relief to those seeking natural wellness.
                    </p>
                </div>

                <div className="relative">
                    {/* Main Testimonial Card */}
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
                        {/* Quote Icon */}
                        <div className="absolute top-8 left-8 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <Quote size={32} className="text-emerald-600" />
                        </div>

                        <div className="mt-12">
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-6">
                                {renderStars(current.rating)}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 font-light italic">
                                "{current.testimonialText}"
                            </blockquote>

                            {/* Issue & Outcome Tags */}
                            {(current.issue || current.outcome) && (
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {current.issue && (
                                        <div className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
                                            Issue: {current.issue}
                                        </div>
                                    )}
                                    {current.outcome && (
                                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                                            Outcome: {current.outcome}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Client Info */}
                        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                {current.clientPhoto ? (
                                    <img
                                        src={current.clientPhoto}
                                        alt={current.clientName}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                                        {current.clientInitials || current.clientName.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-slate-900">
                                        {current.clientInitials || current.clientName}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        {current.sessionType && <span>{current.sessionType}</span>}
                                        {current.location && (
                                            <>
                                                <span>•</span>
                                                <span>{current.location}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            {testimonials.length > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center text-slate-600"
                                        aria-label="Previous testimonial"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center text-slate-600"
                                        aria-label="Next testimonial"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    {testimonials.length > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentIndex(index);
                                        setIsAutoPlaying(false);
                                    }}
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

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/bookings"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-200"
                    >
                        Start Your Healing Journey
                    </Link>
                </div>
            </div>
        </section>
    );
}
