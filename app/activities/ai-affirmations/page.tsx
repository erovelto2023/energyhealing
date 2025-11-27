'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function AIAffirmationsPage() {
    const { user, isLoaded } = useUser()
    const [mood, setMood] = useState('')
    const [challenge, setChallenge] = useState('')
    const [affirmations, setAffirmations] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const moods = [
        'peaceful', 'anxious', 'joyful', 'sad', 'overwhelmed',
        'hopeful', 'frustrated', 'grateful', 'uncertain', 'energized'
    ]

    const handleGenerate = async () => {
        if (!mood) {
            setError('Please select a mood')
            return
        }

        setLoading(true)
        setError('')
        setAffirmations([])

        try {
            const response = await fetch('/api/ai/affirmations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood, challenge: challenge || undefined })
            })

            if (!response.ok) {
                throw new Error('Failed to generate affirmations')
            }

            const data = await response.json()
            setAffirmations(data.affirmations)
        } catch (err) {
            setError('Failed to generate affirmations. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-lg text-secondary">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center max-w-md mx-auto p-8">
                    <h1 className="text-4xl font-bold mb-4 text-gradient">AI Affirmations</h1>
                    <p className="text-lg text-secondary mb-8">
                        Sign in to generate personalized affirmations powered by AI.
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
            <div className="container-custom py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient mb-2">AI Affirmations</h1>
                        <p className="text-secondary">Personalized affirmations powered by AI</p>
                    </div>
                    <Link href="/activities" className="text-secondary hover:text-primary-purple transition-colors">
                        ← Back to Activities
                    </Link>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Input Section */}
                    <div className="glass-card p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">How are you feeling?</h2>

                        {/* Mood Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 opacity-70">Select your current mood</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {moods.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMood(m)}
                                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${mood === m
                                                ? 'bg-primary-purple text-white shadow-glow'
                                                : 'bg-gray-800 bg-opacity-50 hover:bg-opacity-70'
                                            }`}
                                    >
                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Challenge Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 opacity-70">
                                What challenge are you facing? (optional)
                            </label>
                            <textarea
                                value={challenge}
                                onChange={(e) => setChallenge(e.target.value)}
                                placeholder="e.g., starting a new job, dealing with loss, making a big decision..."
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 focus:border-primary-purple focus:outline-none resize-none"
                                rows={3}
                                maxLength={200}
                            />
                            <div className="text-xs text-muted mt-1">{challenge.length}/200</div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !mood}
                            className="w-full px-6 py-4 rounded-full font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: loading || !mood ? 'var(--bg-dark-secondary)' : 'var(--gradient-accent)',
                                color: 'white',
                                boxShadow: loading || !mood ? 'none' : 'var(--shadow-glow)'
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⚡</span>
                                    Generating...
                                </span>
                            ) : (
                                '✨ Generate Affirmations'
                            )}
                        </button>

                        {error && (
                            <div className="mt-4 p-4 rounded-lg bg-red-900 bg-opacity-30 border border-red-700 text-red-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Affirmations Display */}
                    <AnimatePresence>
                        {affirmations.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-card p-8 mb-8"
                            >
                                <h2 className="text-2xl font-bold mb-6 text-center">Your Personalized Affirmations</h2>
                                <div className="space-y-6">
                                    {affirmations.map((affirmation, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                            className="p-6 rounded-xl"
                                            style={{
                                                background: 'hsla(270, 60%, 65%, 0.1)',
                                                border: '1px solid hsla(270, 60%, 65%, 0.3)'
                                            }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="text-3xl">💜</div>
                                                <div className="flex-1">
                                                    <p className="text-xl font-semibold mb-2" style={{ color: 'var(--primary-purple-light)' }}>
                                                        {affirmation}
                                                    </p>
                                                    <p className="text-sm text-muted">
                                                        Repeat this affirmation throughout your day
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleGenerate}
                                        className="px-6 py-3 rounded-full font-medium transition-all duration-300"
                                        style={{
                                            background: 'hsla(180, 55%, 55%, 0.2)',
                                            border: '1px solid var(--secondary-teal)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        🔄 Generate New Affirmations
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* View History Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/profile"
                            className="inline-block px-6 py-3 rounded-full font-medium transition-all duration-300"
                            style={{
                                background: 'hsla(180, 55%, 55%, 0.2)',
                                border: '1px solid var(--secondary-teal)',
                                color: 'var(--text-primary)'
                            }}
                        >
                            📚 View All Past Affirmations
                        </Link>
                    </div>
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
