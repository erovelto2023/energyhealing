'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface EntryCardProps {
    entry: {
        _id: string
        title?: string
        content: string
        mood?: string
        createdAt: string
        tags?: string[]
    }
}

const moodEmojis: Record<string, string> = {
    joyful: '😊', calm: '😌', anxious: '😰', sad: '😢',
    angry: '😠', peaceful: '🕊️', energized: '⚡', tired: '😴',
    overwhelmed: '🤯', hopeful: '🌱', grateful: '🙏', uncertain: '🤔'
}

export default function EntryCard({ entry }: EntryCardProps) {
    const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    const preview = entry.content.length > 150
        ? entry.content.substring(0, 150) + '...'
        : entry.content

    return (
        <Link href={`/activities/healing-journal/entry/${entry._id}`}>
            <motion.div
                whileHover={{ y: -2 }}
                className="glass-card p-5 hover:bg-opacity-40 transition-all cursor-pointer h-full flex flex-col"
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        {entry.mood && (
                            <span className="text-xl" title={entry.mood}>
                                {moodEmojis[entry.mood] || '😐'}
                            </span>
                        )}
                        <span className="text-xs text-muted font-medium uppercase tracking-wide">
                            {date}
                        </span>
                    </div>
                </div>

                {entry.title && (
                    <h3 className="text-lg font-bold mb-2 text-primary-purple-light line-clamp-1">
                        {entry.title}
                    </h3>
                )}

                <p className="text-secondary text-sm leading-relaxed mb-4 flex-grow">
                    {preview}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {entry.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-800 bg-opacity-50 text-muted">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </motion.div>
        </Link>
    )
}
