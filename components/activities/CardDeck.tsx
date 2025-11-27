'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnergyCard } from '@/lib/cardData'

interface CardDeckProps {
    onCardSelect: (index: number) => void
    disabled: boolean
}

export default function CardDeck({ onCardSelect, disabled }: CardDeckProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    // Create 7 cards in the deck (representing 7 chakras)
    const cardCount = 7

    const handleCardClick = (index: number) => {
        if (disabled || selectedIndex !== null) return
        setSelectedIndex(index)
        setTimeout(() => {
            onCardSelect(index)
        }, 300)
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center">
            {/* Floating particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: `hsla(${Math.random() * 360}, 70%, 70%, 0.3)`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Card deck */}
            <div className="relative w-full h-full flex items-center justify-center">
                {[...Array(cardCount)].map((_, index) => {
                    const totalCards = cardCount
                    const middleIndex = (totalCards - 1) / 2
                    const offset = (index - middleIndex) * 60 // Horizontal spacing
                    const rotation = (index - middleIndex) * 8 // Rotation angle
                    const zIndex = selectedIndex === index ? 50 : totalCards - Math.abs(index - middleIndex)

                    return (
                        <motion.div
                            key={index}
                            className="absolute cursor-pointer"
                            style={{
                                zIndex,
                            }}
                            initial={{
                                x: offset,
                                rotate: rotation,
                                y: 0,
                            }}
                            animate={{
                                x: selectedIndex === index ? 0 : offset,
                                rotate: selectedIndex === index ? 0 : rotation,
                                y: hoveredIndex === index && selectedIndex === null ? -20 : 0,
                                scale: selectedIndex === index ? 1.1 : hoveredIndex === index ? 1.05 : 1,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                            }}
                            onHoverStart={() => !disabled && setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                            onClick={() => handleCardClick(index)}
                        >
                            <div
                                className="relative w-[200px] h-[300px] rounded-2xl overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, hsla(270, 60%, 30%, 0.9) 0%, hsla(180, 55%, 35%, 0.9) 100%)',
                                    boxShadow: hoveredIndex === index
                                        ? '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(94, 234, 212, 0.4)'
                                        : '0 8px 32px rgba(0, 0, 0, 0.3)',
                                    border: '1px solid hsla(270, 60%, 65%, 0.3)',
                                }}
                            >
                                {/* Card back design */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Mystical pattern */}
                                    <motion.div
                                        className="w-32 h-32 rounded-full"
                                        style={{
                                            background: 'radial-gradient(circle, hsla(270, 60%, 65%, 0.4) 0%, transparent 70%)',
                                        }}
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.5, 0.8, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    />

                                    {/* Center symbol */}
                                    <div className="absolute text-6xl opacity-60">✨</div>
                                </div>

                                {/* Glow effect on hover */}
                                {hoveredIndex === index && (
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'radial-gradient(circle at center, hsla(270, 60%, 65%, 0.2) 0%, transparent 70%)',
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Instruction text */}
            {!disabled && selectedIndex === null && (
                <motion.p
                    className="absolute bottom-0 text-center text-lg"
                    style={{ color: 'var(--text-secondary)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Choose a card to receive your daily energy message
                </motion.p>
            )}
        </div>
    )
}
