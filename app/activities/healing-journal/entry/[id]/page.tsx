'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AIInsightPanel from '@/components/journal/AIInsightPanel'

export default function EntryDetailPage() {
    const { user, isLoaded } = useUser()
    const params = useParams()
    const [entry, setEntry] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const response = await fetch(`/api/journal/entries/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setEntry(data.entry)
                }
            } catch (error) {
                console.error('Error fetching entry:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user && params.id) {
            fetchEntry()
        }
    }, [user, params.id])

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-lg text-secondary">Loading entry...</p>
                </div>
            </div>
        )
    }

    if (!entry) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Entry Not Found</h1>
                    <Link href="/activities/healing-journal" className="text-primary-purple-light hover:underline">
                        Return to Journal
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
            <div className="container-custom py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/activities/healing-journal" className="text-secondary hover:text-white transition-colors">
                            ← Back to Journal
                        </Link>
                        <Link
                            href={`/activities/healing-journal/write?id=${params.id}`}
                            className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                        >
                            Edit Entry
                        </Link>
                    </div>
                    <div className="text-sm text-muted">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-8 min-h-[500px]">
                            {entry.title && (
                                <h1 className="text-3xl font-bold mb-6 text-gradient">{entry.title}</h1>
                            )}

                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-200">
                                    {entry.content}
                                </p>
                            </div>

                            {entry.tags && entry.tags.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-700 flex gap-2">
                                    {entry.tags.map((tag: string, i: number) => (
                                        <span key={i} className="text-sm px-3 py-1 rounded-full bg-gray-800 text-muted">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Mood Card */}
                        {entry.mood && (
                            <div className="glass-card p-6 flex items-center gap-4">
                                <div className="text-4xl">
                                    {{
                                        joyful: '😊', calm: '😌', anxious: '😰', sad: '😢',
                                        angry: '😠', peaceful: '🕊️', energized: '⚡', tired: '😴',
                                        overwhelmed: '🤯', hopeful: '🌱', grateful: '🙏', uncertain: '🤔'
                                    }[entry.mood as string] || '😐'}
                                </div>
                                <div>
                                    <div className="text-sm text-muted uppercase tracking-wider">Mood</div>
                                    <div className="text-xl font-bold capitalize">{entry.mood}</div>
                                </div>
                            </div>
                        )}

                        {/* AI Insights */}
                        {entry.aiInsights && (
                            <AIInsightPanel insights={entry.aiInsights} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
