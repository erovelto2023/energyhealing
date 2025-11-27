'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import EntryCard from '@/components/journal/EntryCard'

interface JournalEntry {
    _id: string
    title?: string
    content: string
    mood?: string
    createdAt: string
    tags?: string[]
}

export default function EntriesPage() {
    const { user, isLoaded } = useUser()
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        if (user) {
            fetchEntries(page)
        }
    }, [user, page])

    const fetchEntries = async (pageNum: number) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/journal/entries?page=${pageNum}&limit=12`)
            if (response.ok) {
                const data = await response.json()
                setEntries(data.entries)
                setTotalPages(data.pagination.pages)
            }
        } catch (error) {
            console.error('Error fetching entries:', error)
        } finally {
            setLoading(false)
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
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold">All Entries</h1>
                    </div>
                    <Link
                        href="/activities/healing-journal/write"
                        className="px-6 py-2 rounded-full bg-primary-purple text-white font-medium hover:bg-opacity-90 transition-all shadow-glow"
                    >
                        New Entry
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-secondary">Loading entries...</p>
                    </div>
                ) : entries.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {entries.map(entry => (
                                <EntryCard key={entry._id} entry={entry} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50 hover:bg-gray-700 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-secondary">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50 hover:bg-gray-700 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 glass-card">
                        <div className="text-4xl mb-4">📔</div>
                        <h3 className="text-lg font-semibold mb-2">No Entries Yet</h3>
                        <p className="text-secondary mb-6">Start your healing journey today.</p>
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
    )
}
