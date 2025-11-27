'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import EntryCard from '@/components/journal/EntryCard'
import PromptCard from '@/components/journal/PromptCard'

interface JournalEntry {
    _id: string
    title?: string
    content: string
    mood?: string
    createdAt: string
    tags?: string[]
}

interface Prompt {
    prompt: string
    category?: string
    type?: string
}

export default function JournalDashboard() {
    const { user, isLoaded } = useUser()
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        try {
            const [entriesRes, promptsRes] = await Promise.all([
                fetch('/api/journal/entries?limit=6'),
                fetch('/api/journal/prompts?limit=3')
            ])

            if (entriesRes.ok) {
                const data = await entriesRes.json()
                setEntries(data.entries)
            }

            if (promptsRes.ok) {
                const data = await promptsRes.json()
                setPrompts(data.prompts)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-lg text-secondary">Loading your healing space...</p>
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
                        <h1 className="text-4xl font-bold text-gradient mb-2">Healing Journal</h1>
                        <p className="text-secondary">Your safe space for reflection and growth</p>
                    </div>
                    <Link href="/activities" className="text-secondary hover:text-primary-purple transition-colors">
                        ← Back to Activities
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Quick Actions */}
                        <div className="glass-card p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-purple opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>
                            <p className="text-secondary mb-6 max-w-lg">
                                Take a moment to check in with yourself. Your feelings are valid and worthy of attention.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/activities/healing-journal/write"
                                    className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-purple to-secondary-teal text-white font-semibold shadow-glow hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <span>✏️</span> New Entry
                                </Link>
                                <Link
                                    href="/activities/healing-journal/mood"
                                    className="px-6 py-3 rounded-full bg-gray-800 bg-opacity-50 border border-gray-700 hover:bg-opacity-70 transition-all flex items-center gap-2"
                                >
                                    <span>📊</span> Log Mood
                                </Link>
                            </div>
                        </div>

                        {/* Recent Entries */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Recent Entries</h3>
                                <Link href="/activities/healing-journal/entries" className="text-sm text-primary-purple-light hover:text-white transition-colors">
                                    View All
                                </Link>
                            </div>

                            {entries.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {entries.map(entry => (
                                        <EntryCard key={entry._id} entry={entry} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 glass-card">
                                    <div className="text-4xl mb-4">📔</div>
                                    <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
                                    <p className="text-secondary mb-6">You haven&apos;t created any journal entries yet.</p>
                                    <Link
                                        href="/activities/healing-journal/write"
                                        className="text-primary-purple-light hover:text-white underline"
                                    >
                                        Write your first entry
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-8">

                        {/* Daily Inspiration */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span>✨</span> Daily Inspiration
                            </h3>
                            <blockquote className="italic text-secondary mb-4">
                                &quot;Healing is not about becoming the best version of yourself. It is about allowing yourself to be who you are.&quot;
                            </blockquote>
                        </div>

                        {/* Suggested Prompts */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Suggested Prompts</h3>
                                <button className="text-xs text-muted hover:text-white">Refresh</button>
                            </div>
                            <div className="space-y-3">
                                {prompts.map((prompt, i) => (
                                    <PromptCard
                                        key={i}
                                        prompt={prompt}
                                        onSelect={(p) => window.location.href = `/activities/healing-journal/write?prompt=${encodeURIComponent(p)}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Stats/Streak Placeholder */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold mb-4">Your Progress</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-secondary">Entries this month</span>
                                <span className="font-bold text-xl">{entries.length}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-secondary-teal h-2 rounded-full" style={{ width: `${Math.min(entries.length * 10, 100)}%` }}></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
