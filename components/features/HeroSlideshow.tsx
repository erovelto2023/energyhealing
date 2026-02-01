'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export interface HeroContent {
    title: string;
    subtitle?: string;
    category?: string;
}

const HERO_CONTENT: HeroContent[] = [
    // Healing-Centered & Grounded
    { title: "Healing Through Energy, Awareness & Balance", subtitle: "A practical path to easing chronic pain and emotional stress by restoring harmony.", category: "Healing-Centered & Grounded" },
    { title: "Where Energy Meets Awareness", subtitle: "A grounded approach to healing the body, calming the mind, and restoring balance.", category: "Healing-Centered & Grounded" },
    { title: "Relief Begins With Awareness", subtitle: "Integrating energy work and modern insight to support deep, lasting healing.", category: "Healing-Centered & Grounded" },
    { title: "Restoring Balance From the Inside Out", subtitle: "A holistic approach to pain relief and emotional well-being.", category: "Healing-Centered & Grounded" },
    { title: "Grounded Healing for Lasting Relief", subtitle: "Bridging ancient practices and modern understanding for real transformation.", category: "Healing-Centered & Grounded" },

    // Emotional & Stress Healing Focus
    { title: "Calm the Nervous System. Restore Balance.", subtitle: "A mindful approach to releasing emotional stress and chronic tension.", category: "Emotional & Stress Healing Focus" },
    { title: "Gentle Healing for Deep-Seated Stress", subtitle: "Supporting the body and mind through awareness and energy work.", category: "Emotional & Stress Healing Focus" },
    { title: "Release What Your Body Has Been Holding", subtitle: "A grounded healing approach for emotional stress and physical pain.", category: "Emotional & Stress Healing Focus" },
    { title: "From Overwhelm to Ease", subtitle: "Integrating energy and awareness to support natural healing.", category: "Emotional & Stress Healing Focus" },
    { title: "Healing the Root, Not Just the Symptoms", subtitle: "A balanced path to relief from pain and emotional strain.", category: "Emotional & Stress Healing Focus" },

    // Energy + Modern Wellness
    { title: "Ancient Wisdom. Modern Healing. Real Relief.", subtitle: "Supporting balance through energy, awareness, and wellness practices.", category: "Energy + Modern Wellness" },
    { title: "A Modern Path to Energetic Healing", subtitle: "Grounded methods to restore alignment and reduce pain.", category: "Energy + Modern Wellness" },
    { title: "Where Science Meets Subtle Energy", subtitle: "A thoughtful approach to healing stress and chronic discomfort.", category: "Energy + Modern Wellness" },
    { title: "Integrative Healing for Body and Mind", subtitle: "Balancing energy and awareness to support lasting wellness.", category: "Energy + Modern Wellness" },
    { title: "Healing That Honors the Whole You", subtitle: "A practical blend of ancient insight and modern understanding.", category: "Energy + Modern Wellness" },

    // Empowering & Reassuring
    { title: "Your Body Knows How to Heal", subtitle: "We support the process through awareness, energy, and balance.", category: "Empowering & Reassuring" },
    { title: "Supporting Your Natural Healing Intelligence", subtitle: "A grounded approach to restoring calm and comfort.", category: "Empowering & Reassuring" },
    { title: "Healing With Compassion and Clarity", subtitle: "Helping you reconnect with balance through energy and awareness.", category: "Empowering & Reassuring" },
    { title: "A Safe Space for Deep Healing", subtitle: "Where emotional stress and physical pain can gently release.", category: "Empowering & Reassuring" },
    { title: "Relief That Feels Grounded and Sustainable", subtitle: "Integrative healing for long-term balance and well-being.", category: "Empowering & Reassuring" },

    // Transformation & Balance
    { title: "Move From Pain to Presence", subtitle: "A holistic approach to restoring balance and ease.", category: "Transformation & Balance" },
    { title: "Reclaim Balance. Restore Ease.", subtitle: "Grounded healing for chronic pain and emotional stress.", category: "Transformation & Balance" },
    { title: "Healing That Creates Space to Breathe", subtitle: "Supporting emotional and physical relief through awareness.", category: "Transformation & Balance" },
    { title: "From Discomfort to Alignment", subtitle: "Integrating energy and wellness for meaningful relief.", category: "Transformation & Balance" },
    { title: "Where Healing Feels Natural Again", subtitle: "A grounded, supportive path to balance and ease.", category: "Transformation & Balance" },

    // Soft, Minimal Hero-Friendly Lines
    { title: "Balance the Body. Calm the Mind. Heal Gently.", category: "Soft, Minimal" },
    { title: "Healing Rooted in Awareness and Energy", category: "Soft, Minimal" },
    { title: "A Grounded Path Back to Balance", category: "Soft, Minimal" },
    { title: "Gentle Healing for Lasting Relief", category: "Soft, Minimal" },
    { title: "Restore Balance. Release Stress. Feel Whole.", category: "Soft, Minimal" },
];

interface HeroSlideshowProps {
    images: string[];
    content?: HeroContent[];
    children?: React.ReactNode;
}

export default function HeroSlideshow({ images, content = HERO_CONTENT, children }: HeroSlideshowProps) {
    // Shuffle/Randomize content on mount or just cycle? 
    // Let's cycle sequentially but maybe shuffle images initially if we could (server side is better for consistency or Client useEffect).
    // We'll just cycle.

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Determine interval duration
        // If we have images, cycle.
        if (images.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1));
        }, 6000); // 6 seconds per slide

        return () => clearInterval(timer);
    }, [images]);

    const currentImage = images.length > 0 ? images[currentIndex % images.length] : null;
    const currentText = content[currentIndex % content.length];

    return (
        <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden bg-slate-900">
            {/* Introduction of a black background to prevent white flashes */}
            <div className="absolute inset-0 bg-slate-900 z-0" />

            {/* Background Image Slideshow */}
            <AnimatePresence mode="popLayout">
                {currentImage && (
                    <motion.div
                        key={`bg-${currentIndex % images.length}`}
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for text readability */}
                        {/* Linear Gradient for bottom fade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opactiy-80" />

                        <img
                            src={currentImage}
                            alt="Healing Atmosphere"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`text-${currentIndex % content.length}`}
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center"
                        >
                            {/* Optional Category Tag */}
                            {currentText.category && (
                                <span className="inline-block px-4 py-1 mb-6 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                                    {currentText.category.replace(' & ', ' + ').replace(' Focus', '')}
                                </span>
                            )}

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
                                {currentText.title}
                            </h1>

                            {currentText.subtitle && (
                                <p className="text-lg md:text-2xl text-slate-100 max-w-3xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
                                    {currentText.subtitle}
                                </p>
                            )}

                            {children ? (
                                <div className="mt-8">
                                    {children}
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <Link href="/book-session" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
                                        <Calendar size={20} />
                                        Book a Session
                                    </Link>
                                    <Link href="/stories" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                                        Read Healing Stories
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-10 left-0 w-full z-30 flex justify-center gap-2">
                {content.map((_, idx) => {
                    // Show only a few dots to avoid clutter if list is huge, or just a bar? 
                    // With 30 items, dots are too many. Let's do a simple progress bar or just hidden.
                    // Actually, let's just show active index modulo something if we want, or nothing.
                    // Let's do a simple bar at the bottom.
                    return null;
                })}
                {/* Simple progress bar */}
                <div className="h-1 bg-white/20 w-64 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                        key={currentIndex} // Reset on change
                    />
                </div>
            </div>
        </section>
    );
}
