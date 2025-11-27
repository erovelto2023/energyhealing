'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import CardDeck from '@/components/activities/CardDeck'
import CardReveal from '@/components/activities/CardReveal'
import StreakTracker from '@/components/activities/StreakTracker'
import { EnergyCard } from '@/lib/cardData'

export default function DailyCardPage() {
    const { user, isLoaded } = useUser()
    const [canPull, setCanPull] = useState<boolean | null>(null)
    const [pulledCard, setPulledCard] = useState<EnergyCard | null>(null)
    const [streak, setStreak] = useState({ current: 0, longest: 0, achievements: [] })
    const [loading, setLoading] = useState(true)
    const [showCard, setShowCard] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            if (user) {
                checkCardPullStatus()
                fetchStreak()
            } else {
                setLoading(false)
            }
        }
    }, [isLoaded, user])

    const checkCardPullStatus = async () => {
        try {
            const response = await fetch('/api/card-pull')
            const data = await response.json()

            setCanPull(data.canPull)
            if (!data.canPull && data.lastPull) {
                setPulledCard(data.lastPull.card)
                setShowCard(true)
            }
            setLoading(false)
        } catch (error) {
            console.error('Error checking card pull status:', error)
            setLoading(false)
        }
    }

    const fetchStreak = async () => {
        try {
            const response = await fetch('/api/streak')
            const data = await response.json()
            setStreak({
                current: data.currentStreak,
                longest: data.longestStreak,
                achievements: data.achievements || []
            })
        } catch (error) {
            console.error('Error fetching streak:', error)
        }
    }

    const handleCardSelect = async (index: number) => {
        try {
            const response = await fetch('/api/card-pull', {
                method: 'POST',
            })

            const data = await response.json()

            if (data.card) {
                setPulledCard(data.card)
                setShowCard(true)
                setCanPull(false)

                // Update streak
                if (data.streak) {
                    setStreak({
                        current: data.streak.current,
                        longest: data.streak.longest,
                        achievements: data.streak.newAchievements || []
                    })
                }
            }
        } catch (error) {
            console.error('Error pulling card:', error)
        }
    }

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-lg text-secondary">Loading your energy space...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center max-w-md mx-auto p-8">
                    <h1 className="text-4xl font-bold mb-4 text-gradient">Daily Energy Card Pull</h1>
                    <p className="text-lg text-secondary mb-8">
                        Sign in to access your personalized daily energy cards and track your healing journey.
                    </p>
                    <a href="/sign-in" className="btn-primary">
                        Sign In to Continue
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
            {/* Header */}
            <div className="container-custom py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient mb-2">Daily Energy Card Pull</h1>
                        <p className="text-secondary">Welcome back, {user.firstName || 'friend'} 🌟</p>
                    </div>
                    <a href="/" className="text-secondary hover:text-primary-purple transition-colors">
                        ← Back to Home
                    </a>
                </div>

                {/* Streak Tracker */}
                <div className="mb-12">
                    <StreakTracker
                        currentStreak={streak.current}
                        longestStreak={streak.longest}
                        achievements={streak.achievements}
                    />
                </div>

                {/* Main Content */}
                <div className="section-padding">
                    <AnimatePresence mode="wait">
                        {!showCard && canPull && (
                            <motion.div
                                key="deck"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl font-bold mb-4">Choose Your Card</h2>
                                <p className="text-lg text-secondary mb-12">
                                    Take a deep breath, center yourself, and select the card that calls to you.
                                </p>
                                <CardDeck onCardSelect={handleCardSelect} disabled={!canPull} />
                            </motion.div>
                        )}

                        {showCard && pulledCard && (
                            <motion.div
                                key="reveal"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-3xl font-bold text-center mb-8">Your Energy Card for Today</h2>
                                <CardReveal card={pulledCard} />

                                {/* Come back tomorrow message */}
                                <motion.div
                                    className="mt-12 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                >
                                    <div className="glass-card p-6 max-w-md mx-auto">
                                        <p className="text-lg text-secondary mb-2">
                                            ✨ Your next card will be available tomorrow
                                        </p>
                                        <p className="text-sm text-muted">
                                            Return each day to continue your energy journey
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
        .btn-primary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: var(--transition-smooth);
          background: var(--gradient-accent);
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }
      `}</style>
        </div>
    )
}
