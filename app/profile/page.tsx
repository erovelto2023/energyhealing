'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Modal from '@/components/Modal'
import { energyCards } from '@/lib/cardData'
import AIInsightPanel from '@/components/journal/AIInsightPanel'

interface Activity {
    id: string
    type: 'affirmation' | 'chakra' | 'card' | 'journal' | 'mood'
    date: string
    data: any
}

// Helper function to get card by ID
const getCardById = (cardId: number) => {
    return energyCards.find(card => card.id === cardId)
}

export default function ProfilePage() {
    const { user, isLoaded } = useUser()
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [activities, setActivities] = useState<Record<string, Activity[]>>({})
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState<'all' | 'affirmation' | 'chakra' | 'card' | 'journal' | 'mood'>('all')

    const activityIcons: Record<string, string> = {
        affirmation: '💜',
        chakra: '🌈',
        card: '🔮',
        journal: '📔',
        mood: '📊'
    }

    const activityLabels: Record<string, string> = {
        affirmation: 'Affirmation',
        chakra: 'Chakra Analysis',
        card: 'Card Pull',
        journal: 'Journal Entry',
        mood: 'Mood Log'
    }

    // Load activities when month or filter changes
    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true)
            try {
                const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
                const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)

                const params = new URLSearchParams({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    type: filter
                })

                const response = await fetch(`/api/user/history?${params}`)
                if (response.ok) {
                    const data = await response.json()
                    setActivities(data.groupedByDate)
                }
            } catch (error) {
                console.error('Failed to fetch activities:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchActivities()
        }
    }, [selectedMonth, filter, user])

    // Generate calendar days
    const getDaysInMonth = () => {
        const year = selectedMonth.getFullYear()
        const month = selectedMonth.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days: (number | null)[] = []

        // Add empty slots for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i)
        }

        return days
    }

    const changeMonth = (delta: number) => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + delta, 1))
    }

    const getDateKey = (day: number) => {
        const year = selectedMonth.getFullYear()
        const month = selectedMonth.getMonth()
        return new Date(year, month, day).toISOString().split('T')[0]
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
                    <h1 className="text-4xl font-bold mb-4 text-gradient">Profile</h1>
                    <p className="text-lg text-secondary mb-8">
                        Sign in to view your healing journey history.
                    </p>
                    <a href="/sign-in" className="btn-primary">
                        Sign In to Continue
                    </a>
                </div>
            </div>
        )
    }

    const days = getDaysInMonth()
    const selectedActivities = selectedDate ? activities[selectedDate] || [] : []

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
            <div className="container-custom py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient mb-2">My Healing Journey</h1>
                        <p className="text-secondary">View your activity history and progress</p>
                    </div>
                    <Link href="/" className="text-secondary hover:text-primary-purple transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Filter Tabs */}
                    <div className="glass-card p-4 mb-6">
                        <div className="flex gap-2 flex-wrap">
                            {(['all', 'affirmation', 'chakra', 'card', 'journal', 'mood'] as const).map((filterType) => (
                                <button
                                    key={filterType}
                                    onClick={() => setFilter(filterType)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${filter === filterType
                                        ? 'bg-primary-purple text-white shadow-glow'
                                        : 'bg-gray-800 bg-opacity-50 hover:bg-opacity-70'
                                        }`}
                                >
                                    {filterType === 'all' ? '📅 All Activities' : `${activityIcons[filterType]} ${activityLabels[filterType]}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="glass-card p-6">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="px-4 py-2 rounded-lg bg-gray-800 bg-opacity-50 hover:bg-opacity-70 transition-all"
                            >
                                ← Previous
                            </button>
                            <h2 className="text-2xl font-bold">
                                {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button
                                onClick={() => changeMonth(1)}
                                className="px-4 py-2 rounded-lg bg-gray-800 bg-opacity-50 hover:bg-opacity-70 transition-all"
                            >
                                Next →
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="text-center font-semibold text-sm text-muted py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {days.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} className="aspect-square" />
                                }

                                const dateKey = getDateKey(day)
                                const dayActivities = activities[dateKey] || []
                                const hasActivities = dayActivities.length > 0

                                return (
                                    <motion.button
                                        key={day}
                                        onClick={() => hasActivities && setSelectedDate(dateKey)}
                                        whileHover={hasActivities ? { scale: 1.05 } : {}}
                                        className={`aspect-square rounded-lg p-2 transition-all relative ${hasActivities
                                            ? 'bg-primary-purple bg-opacity-20 border-2 border-primary-purple cursor-pointer hover:bg-opacity-30'
                                            : 'bg-gray-800 bg-opacity-30'
                                            }`}
                                    >
                                        <div className="text-lg font-semibold">{day}</div>
                                        {hasActivities && (
                                            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                                                {dayActivities.slice(0, 3).map((activity, i) => (
                                                    <span key={i} className="text-xs">
                                                        {activityIcons[activity.type]}
                                                    </span>
                                                ))}
                                                {dayActivities.length > 3 && (
                                                    <span className="text-xs">+{dayActivities.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl mb-1">💜</div>
                            <div className="text-2xl font-bold text-primary-purple-light">
                                {Object.values(activities).flat().filter(a => a.type === 'affirmation').length}
                            </div>
                            <div className="text-xs text-muted">Affirmations</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl mb-1">🌈</div>
                            <div className="text-2xl font-bold text-primary-purple-light">
                                {Object.values(activities).flat().filter(a => a.type === 'chakra').length}
                            </div>
                            <div className="text-xs text-muted">Chakra</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl mb-1">🔮</div>
                            <div className="text-2xl font-bold text-primary-purple-light">
                                {Object.values(activities).flat().filter(a => a.type === 'card').length}
                            </div>
                            <div className="text-xs text-muted">Cards</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl mb-1">📔</div>
                            <div className="text-2xl font-bold text-primary-purple-light">
                                {Object.values(activities).flat().filter(a => a.type === 'journal').length}
                            </div>
                            <div className="text-xs text-muted">Journal</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-2xl mb-1">📊</div>
                            <div className="text-2xl font-bold text-primary-purple-light">
                                {Object.values(activities).flat().filter(a => a.type === 'mood').length}
                            </div>
                            <div className="text-xs text-muted">Mood</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Details Modal */}
            <Modal
                isOpen={selectedDate !== null}
                onClose={() => setSelectedDate(null)}
                title={selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            >
                <div className="space-y-6">
                    {selectedActivities.map((activity) => (
                        <div key={activity.id} className="p-6 rounded-xl" style={{ background: 'hsla(270, 60%, 65%, 0.1)', border: '1px solid hsla(270, 60%, 65%, 0.3)' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{activityIcons[activity.type]}</span>
                                <div>
                                    <h3 className="text-xl font-bold">{activityLabels[activity.type]}</h3>
                                    <p className="text-sm text-muted">{new Date(activity.date).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            {activity.type === 'affirmation' && (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted">Mood: </span>
                                        <span className="text-primary-purple-light">{activity.data.metadata?.mood}</span>
                                    </div>
                                    {activity.data.metadata?.challenge && (
                                        <div>
                                            <span className="text-sm text-muted">Challenge: </span>
                                            <span>{activity.data.metadata.challenge}</span>
                                        </div>
                                    )}
                                    <div className="space-y-2 mt-4">
                                        {activity.data.response.split('\n').filter((a: string) => a.trim()).map((aff: string, i: number) => (
                                            <div key={i} className="p-3 rounded-lg" style={{ background: 'hsla(270, 60%, 65%, 0.05)' }}>
                                                <p className="text-secondary">{aff}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activity.type === 'chakra' && (
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-muted">Symptoms: </span>
                                        <span>{activity.data.metadata?.symptoms?.join(', ')}</span>
                                    </div>
                                    {JSON.parse(activity.data.response).map((chakra: any, i: number) => (
                                        <div key={i} className="p-4 rounded-lg" style={{ background: 'hsla(0, 0%, 100%, 0.03)' }}>
                                            <h4 className="font-bold text-lg mb-2">{chakra.chakra} Chakra</h4>
                                            <p className="text-secondary mb-3">{chakra.analysis}</p>
                                            <div className="space-y-2">
                                                {chakra.recommendations.map((rec: string, j: number) => (
                                                    <div key={j} className="flex items-start gap-2">
                                                        <span>✨</span>
                                                        <span className="text-sm text-secondary">{rec}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activity.type === 'card' && (
                                <div>
                                    {(() => {
                                        const card = getCardById(activity.data.cardId)
                                        return card ? (
                                            <div className="space-y-4">
                                                <div className="p-6 rounded-xl" style={{
                                                    background: 'linear-gradient(135deg, hsla(270, 60%, 65%, 0.15) 0%, hsla(180, 55%, 55%, 0.15) 100%)',
                                                    border: '1px solid hsla(270, 60%, 65%, 0.3)'
                                                }}>
                                                    <div className="text-center mb-4">
                                                        <h4 className="text-2xl font-bold mb-2" style={{ color: card.color }}>{card.chakra} Chakra</h4>
                                                        <p className="text-sm text-muted">{card.element} • {card.intention}</p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h5 className="text-sm font-semibold text-secondary-teal mb-2">MANTRA</h5>
                                                            <p className="text-lg italic" style={{ color: 'var(--primary-purple-light)' }}>
                                                                &quot;{card.mantra}&quot;
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <h5 className="text-sm font-semibold text-secondary-teal mb-2">MESSAGE</h5>
                                                            <p className="text-secondary leading-relaxed">{card.message}</p>
                                                        </div>

                                                        <div>
                                                            <h5 className="text-sm font-semibold text-secondary-teal mb-2">MICRO-ACTION</h5>
                                                            <p className="text-secondary leading-relaxed">{card.microAction}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {activity.data.mood && (
                                                    <div className="p-3 rounded-lg" style={{ background: 'hsla(270, 60%, 65%, 0.05)' }}>
                                                        <span className="text-sm text-muted">Mood when pulled: </span>
                                                        <span className="text-primary-purple-light">{activity.data.mood}</span>
                                                    </div>
                                                )}

                                                {activity.data.notes && (
                                                    <div className="p-4 rounded-lg" style={{ background: 'hsla(270, 60%, 65%, 0.05)' }}>
                                                        <h5 className="text-sm font-semibold text-muted mb-2">Your Notes</h5>
                                                        <p className="text-secondary">{activity.data.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-muted">Card #{activity.data.cardId} - Card data not found</div>
                                        )
                                    })()}
                                </div>
                            )}

                            {activity.type === 'journal' && (
                                <div className="space-y-4">
                                    {activity.data.title && (
                                        <h4 className="text-lg font-bold text-primary-purple-light">{activity.data.title}</h4>
                                    )}

                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-secondary whitespace-pre-wrap line-clamp-6">
                                            {activity.data.content}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {activity.data.mood && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-muted">
                                                Mood: {activity.data.mood}
                                            </span>
                                        )}
                                        {activity.data.tags?.map((tag: string, i: number) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-muted">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {activity.data.aiInsights && (
                                        <div className="mt-4">
                                            <AIInsightPanel insights={activity.data.aiInsights} />
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <Link
                                            href={`/activities/healing-journal/entry/${activity.id}`}
                                            className="text-primary-purple-light hover:underline text-sm"
                                        >
                                            View Full Entry →
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {activity.type === 'mood' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">
                                            {{
                                                joyful: '😊', calm: '😌', anxious: '😰', sad: '😢',
                                                angry: '😠', peaceful: '🕊️', energized: '⚡', tired: '😴',
                                                overwhelmed: '🤯', hopeful: '🌱', grateful: '🙏', uncertain: '🤔'
                                            }[activity.data.mood as string] || '😐'}
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold capitalize">{activity.data.mood}</div>
                                            <div className="text-sm text-muted">Energy Level: {activity.data.energyLevel}/10</div>
                                        </div>
                                    </div>

                                    {activity.data.notes && (
                                        <div className="p-4 rounded-lg bg-gray-800 bg-opacity-50">
                                            <p className="text-secondary italic">&quot;{activity.data.notes}&quot;</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Modal>

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
