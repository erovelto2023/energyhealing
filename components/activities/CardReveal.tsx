'use client'

import { motion } from 'framer-motion'
import { EnergyCard } from '@/lib/cardData'
import { useState } from 'react'

interface CardRevealProps {
    card: EnergyCard
    onSave?: () => void
    onShare?: () => void
}

export default function CardReveal({ card, onSave, onShare }: CardRevealProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Card flip animation */}
            <motion.div
                className="relative w-full"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
                onAnimationComplete={() => {
                    if (!isFlipped) setIsFlipped(true)
                }}
            >
                {/* Card front (revealed content) */}
                <motion.div
                    className="glass-card p-8 md:p-12"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    {/* Chakra indicator */}
                    <div className="flex items-center justify-center mb-6">
                        <div
                            className="px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide"
                            style={{
                                background: `${card.color}33`,
                                color: card.color,
                                boxShadow: `0 0 20px ${card.color}44`,
                            }}
                        >
                            {card.chakra} Chakra
                        </div>
                    </div>

                    {/* Mantra */}
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        &quot;{card.mantra}&quot;
                    </motion.h2>

                    {/* Message */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-lg leading-relaxed text-secondary text-center">
                            {card.message}
                        </p>
                    </motion.div>

                    {/* Micro-action */}
                    <motion.div
                        className="p-6 rounded-xl mb-8"
                        style={{
                            background: 'hsla(270, 60%, 65%, 0.1)',
                            border: '1px solid hsla(270, 60%, 65%, 0.3)',
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h3 className="text-sm uppercase tracking-wide mb-2 opacity-70">
                            Your Micro-Action
                        </h3>
                        <p className="text-lg font-medium" style={{ color: 'var(--primary-purple-light)' }}>
                            {card.microAction}
                        </p>
                    </motion.div>

                    {/* Metadata */}
                    <motion.div
                        className="flex items-center justify-center gap-6 mb-8 text-sm opacity-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.9 }}
                    >
                        <div className="flex items-center gap-2">
                            <span>Element:</span>
                            <span className="font-semibold">{card.element}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        <div className="flex items-center gap-2">
                            <span>Intention:</span>
                            <span className="font-semibold">{card.intention}</span>
                        </div>
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        className="flex gap-4 justify-center flex-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                    >
                        {onSave && (
                            <button
                                onClick={onSave}
                                className="px-6 py-3 rounded-full font-medium transition-all duration-300"
                                style={{
                                    background: 'hsla(270, 60%, 65%, 0.2)',
                                    border: '1px solid var(--primary-purple)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                💾 Save to Journal
                            </button>
                        )}
                        {onShare && (
                            <button
                                onClick={onShare}
                                className="px-6 py-3 rounded-full font-medium transition-all duration-300"
                                style={{
                                    background: 'hsla(180, 55%, 55%, 0.2)',
                                    border: '1px solid var(--secondary-teal)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                ✨ Share Card
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Affirmation prompt */}
            <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
            >
                <p className="text-muted text-sm">
                    Take a moment to breathe deeply and let this message settle into your heart. 🌟
                </p>
            </motion.div>
        </div>
    )
}
