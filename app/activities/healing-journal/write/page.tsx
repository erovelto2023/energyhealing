'use client'

import { useState, useEffect, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import EntryEditor from '@/components/journal/EntryEditor'
import MoodSelector from '@/components/journal/MoodSelector'
import AIInsightPanel from '@/components/journal/AIInsightPanel'

function WritePageContent() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [mood, setMood] = useState('')
    const [isPrivate, setIsPrivate] = useState(false)
    const [saving, setSaving] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [step, setStep] = useState<'write' | 'mood' | 'review'>('write')

    const [entryId, setEntryId] = useState<string | null>(null)

    // Load prompt or existing entry
    useEffect(() => {
        const prompt = searchParams.get('prompt')
        const id = searchParams.get('id')

        if (id) {
            setEntryId(id)
            // Fetch existing entry
            fetch(`/api/journal/entries/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.entry) {
                        setTitle(data.entry.title || '')
                        setContent(data.entry.content || '')
                        setMood(data.entry.mood || '')
                        setIsPrivate(data.entry.isPrivate || false)
                        if (data.entry.aiInsights) {
                            setAnalysis(data.entry.aiInsights)
                        }
                    }
                })
                .catch(err => console.error('Error fetching entry:', err))
        } else if (prompt) {
            setTitle(prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt)
            setContent(`\n\nPrompt: ${prompt}\n\n`)
        }
    }, [searchParams])

    const handleSave = async (withAnalysis: boolean) => {
        if (!content.trim()) return

        if (withAnalysis) {
            setAnalyzing(true)
        } else {
            setSaving(true)
        }

        try {
            const url = entryId ? `/api/journal/entries/${entryId}` : '/api/journal/entries'
            const method = entryId ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    mood,
                    isPrivate,
                    analyze: withAnalysis
                })
            })

            if (response.ok) {
                const data = await response.json()
                if (withAnalysis && data.entry.aiInsights) {
                    setAnalysis(data.entry.aiInsights)
                    setStep('review')
                } else {
                    router.push('/activities/healing-journal/entries')
                }
            }
        } catch (error) {
            console.error('Save failed:', error)
        } finally {
            setSaving(false)
            setAnalyzing(false)
        }
    }

    if (!isLoaded) return null

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
            <div className="container-custom py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/activities/healing-journal" className="text-secondary hover:text-white transition-colors">
                            ← Cancel
                        </Link>
                        <h1 className="text-2xl font-bold">{entryId ? 'Edit Entry' : 'New Entry'}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer mr-4">
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                className="rounded bg-gray-700 border-gray-600 text-primary-purple focus:ring-primary-purple"
                            />
                            <span>Private Entry</span>
                        </label>

                        {step === 'write' && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSave(false)}
                                    disabled={!content.trim() || saving || analyzing}
                                    className="px-6 py-2 rounded-full bg-gray-600 text-white font-medium disabled:opacity-50 hover:bg-gray-500 transition-all"
                                >
                                    {saving ? 'Saving...' : 'Save Entry'}
                                </button>
                                <button
                                    onClick={() => handleSave(true)}
                                    disabled={!content.trim() || saving || analyzing}
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-purple to-secondary-teal text-white font-medium disabled:opacity-50 hover:scale-105 transition-all shadow-glow"
                                >
                                    {analyzing ? 'Analyzing...' : 'Analyze & Save'}
                                </button>
                            </div>
                        )}

                        {step === 'review' && (
                            <button
                                onClick={() => router.push('/activities/healing-journal/entries')}
                                className="px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-500 transition-all shadow-lg"
                            >
                                Done
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Main Editor Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Entry Title (optional)"
                            className="w-full bg-transparent text-3xl font-bold placeholder-gray-600 focus:outline-none border-b border-transparent focus:border-gray-700 pb-2 transition-all"
                        />

                        <EntryEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Express yourself freely..."
                        />
                    </div>

                    {/* Sidebar / Analysis Panel */}
                    <div className="space-y-6">
                        {step === 'write' && (
                            <>
                                <div className="glass-card p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <MoodSelector
                                        selectedMood={mood}
                                        onSelect={setMood}
                                        label="How are you feeling?"
                                    />
                                </div>

                                <div className="glass-card p-6">
                                    <h3 className="font-bold mb-4">Writing Tips</h3>
                                    <ul className="space-y-3 text-sm text-secondary">
                                        <li className="flex gap-2">
                                            <span>🌊</span> Let your thoughts flow without judgment
                                        </li>
                                        <li className="flex gap-2">
                                            <span>🧘‍♀️</span> Focus on your feelings, not just events
                                        </li>
                                        <li className="flex gap-2">
                                            <span>💜</span> Be kind to yourself as you write
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {step === 'review' && analysis && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <AIInsightPanel insights={analysis} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function WritePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WritePageContent />
        </Suspense>
    )
}
