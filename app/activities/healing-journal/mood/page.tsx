'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MoodSelector from '@/components/journal/MoodSelector'

export default function MoodLogPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const [mood, setMood] = useState('')
    const [energyLevel, setEnergyLevel] = useState(5)
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        if (!mood) return

        setSaving(true)
        try {
            const response = await fetch('/api/journal/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: new Date(),
                    mood,
                    energyLevel,
                    notes
                })
            })

            if (response.ok) {
                router.push('/activities/healing-journal')
            }
        } catch (error) {
            console.error('Failed to log mood:', error)
        } finally {
            setSaving(false)
        }
    }

    if (!isLoaded) return null

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
            <div className="container-custom py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/activities/healing-journal" className="text-secondary hover:text-white transition-colors">
                            ← Cancel
                        </Link>
                        <h1 className="text-2xl font-bold">Daily Check-in</h1>
                        <div className="w-16"></div> {/* Spacer for centering */}
                    </div>

                    <div className="glass-card p-8 space-y-8">
                        {/* Mood Selection */}
                        <section>
                            <h2 className="text-xl font-bold mb-6 text-center">How are you feeling right now?</h2>
                            <MoodSelector selectedMood={mood} onSelect={setMood} label="" />
                        </section>

                        {/* Energy Level */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Energy Level</h2>
                                <span className="text-2xl font-bold text-primary-purple-light">{energyLevel}/10</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={energyLevel}
                                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-purple"
                            />
                            <div className="flex justify-between text-xs text-muted mt-2">
                                <span>Exhausted</span>
                                <span>Balanced</span>
                                <span>Energized</span>
                            </div>
                        </section>

                        {/* Quick Notes */}
                        <section>
                            <h2 className="text-lg font-bold mb-4">Any quick thoughts? (Optional)</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Briefly note what's influencing your mood..."
                                className="w-full p-4 rounded-xl bg-gray-800 bg-opacity-50 border border-gray-700 focus:border-primary-purple focus:outline-none resize-none h-32"
                            />
                        </section>

                        {/* Submit Button */}
                        <button
                            onClick={handleSave}
                            disabled={!mood || saving}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-purple to-secondary-teal text-white font-bold text-lg shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {saving ? 'Saving...' : 'Log Mood'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
