'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Booking {
    _id: string
    name: string
    email: string
    phone?: string
    service?: string
    message: string
    status: 'new' | 'contacted' | 'completed' | 'archived'
    notes?: string
    createdAt: string
}

export default function AdminBookings() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [noteContent, setNoteContent] = useState('')

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/')
        } else if (user) {
            fetchBookings()
        }
    }, [user, isLoaded])

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/admin/bookings')
            if (res.ok) {
                const data = await res.json()
                setBookings(data.bookings)
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            })

            if (res.ok) {
                setBookings(bookings.map(b =>
                    b._id === id ? { ...b, status: status as any } : b
                ))
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const saveNote = async (id: string) => {
        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, notes: noteContent })
            })

            if (res.ok) {
                setBookings(bookings.map(b =>
                    b._id === id ? { ...b, notes: noteContent } : b
                ))
                setEditingNoteId(null)
            }
        } catch (error) {
            console.error('Error saving note:', error)
        }
    }

    const startEditingNote = (booking: Booking) => {
        setEditingNoteId(booking._id)
        setNoteContent(booking.notes || '')
    }

    if (!isLoaded || loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Booking Requests</h1>
                    <Link href="/admin" className="text-purple-400 hover:text-white transition-colors">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <div className="glass-card p-6 mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="border-b border-gray-700 bg-gray-800/50">
                                <tr>
                                    <th className="p-4 rounded-tl-lg">Date</th>
                                    <th className="p-4">Client</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Service</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 rounded-tr-lg">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <React.Fragment key={booking._id}>
                                        <tr className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 text-gray-400 whitespace-nowrap">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-medium">{booking.name}</td>
                                            <td className="p-4">
                                                <div className="text-sm">{booking.email}</div>
                                                {booking.phone && <div className="text-sm text-gray-400">{booking.phone}</div>}
                                            </td>
                                            <td className="p-4">{booking.service || 'General'}</td>
                                            <td className="p-4">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                                                    className={`bg-gray-700 border-none rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 cursor-pointer ${booking.status === 'new' ? 'text-green-400 font-bold' :
                                                        booking.status === 'contacted' ? 'text-blue-400' :
                                                            'text-gray-400'
                                                        }`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                                                    className="text-sm text-purple-400 hover:text-purple-300 underline"
                                                >
                                                    {expandedId === booking._id ? 'Hide' : 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedId === booking._id && (
                                            <tr className="bg-gray-800/30">
                                                <td colSpan={6} className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Message</h4>
                                                            <div className="bg-gray-800 p-4 rounded-lg text-gray-300 whitespace-pre-wrap">
                                                                {booking.message}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Admin Notes</h4>
                                                                {editingNoteId !== booking._id && (
                                                                    <button
                                                                        onClick={() => startEditingNote(booking)}
                                                                        className="text-xs text-purple-400 hover:text-purple-300"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {editingNoteId === booking._id ? (
                                                                <div className="space-y-2">
                                                                    <textarea
                                                                        value={noteContent}
                                                                        onChange={(e) => setNoteContent(e.target.value)}
                                                                        className="w-full bg-gray-700 border-gray-600 rounded p-3 text-white focus:ring-2 focus:ring-purple-500"
                                                                        rows={4}
                                                                        placeholder="Add internal notes about this client..."
                                                                    />
                                                                    <div className="flex gap-2 justify-end">
                                                                        <button
                                                                            onClick={() => setEditingNoteId(null)}
                                                                            className="px-3 py-1 text-sm text-gray-400 hover:text-white"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={() => saveNote(booking._id)}
                                                                            className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-500 rounded text-white"
                                                                        >
                                                                            Save Note
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-gray-800 p-4 rounded-lg text-gray-300 min-h-[100px]">
                                                                    {booking.notes ? (
                                                                        booking.notes
                                                                    ) : (
                                                                        <span className="text-gray-500 italic">No notes added.</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {bookings.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No booking requests yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
