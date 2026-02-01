
'use client'

import React from 'react'
import { Player } from '@remotion/player'
import { HeroBackground } from './remotion/HeroBackground'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedHeroProps {
    title: React.ReactNode
    subtitle?: string
    children?: React.ReactNode
    className?: string
    variant?: 'default' | 'minimal'
}

export default function AnimatedHero({
    title,
    subtitle,
    children,
    className,
    variant = 'default'
}: AnimatedHeroProps) {
    return (
        <section className={cn("relative overflow-hidden w-full", variant === 'minimal' ? 'h-[40vh] min-h-[400px]' : 'h-[85vh] min-h-[600px]', className)}>
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <Player
                    component={HeroBackground}
                    durationInFrames={300}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={30}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                    loop
                    autoPlay
                    controls={false}
                />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    {/* Title */}
                    <div className="mb-6">
                        {typeof title === 'string' ? (
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
                                {title}
                            </h1>
                        ) : (
                            title
                        )}
                    </div>

                    {/* Subtitle */}
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-lg md:text-2xl text-slate-700 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {/* CTAs / Children */}
                    {children && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row justify-center gap-4"
                        >
                            {children}
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Soft fade at bottom to blend with content */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FDFCFB] to-transparent z-10" />
        </section>
    )
}
