'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Mail, Phone, User, Clock, Calendar, CheckCircle, MessageSquare, StickyNote, ArrowLeft, ExternalLink, X } from 'lucide-react'

interface Booking {
    _id: string
    name: string
    email: string
    phone?: string
    service?: string
    message: string
    bookingDate?: string
    bookingTime?: string
    status: 'new' | 'contacted' | 'completed' | 'archived'
    notes?: string
    createdAt: string
}

export default function AdminBookingsClient() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [noteContent, setNoteContent] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/')
        } else if (user) {
            fetchBookings()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const deleteBooking = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/bookings?id=${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setBookings(bookings.filter(b => b._id !== id))
                setDeletingId(null)
                if (expandedId === id) setExpandedId(null)
            }
        } catch (error) {
            console.error('Error deleting booking:', error)
        }
    }

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">Loading secure dashboard...</p>
            </div>
        );
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Booking Requests
                        </h1>
                        <p className="text-slate-500">Manage and respond to healing session inquiries.</p>
                    </div>
                    <Link href="/admin" className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:border-slate-700 transition-all text-sm font-medium flex items-center gap-2">
                        <ArrowLeft size={16} /> Dashboard
                    </Link>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Client</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Session</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Service</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {bookings.map(booking => (
                                    <React.Fragment key={booking._id}>
                                        <tr className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="p-6 text-slate-400">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">
                                                        {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-tighter opacity-50">
                                                        {new Date(booking.createdAt).getFullYear()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 font-bold text-white">{booking.name}</td>
                                            <td className="p-6">
                                                {booking.bookingDate || (booking as any).date ? (
                                                    <div className="flex flex-col bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 w-fit">
                                                        <span className="text-emerald-400 font-bold text-sm">
                                                            {booking.bookingDate || (booking as any).date}
                                                        </span>
                                                        <span className="text-[10px] text-emerald-500/60 uppercase tracking-widest font-bold">
                                                            {booking.bookingTime || (booking as any).time || 'TBD'} PST
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col opacity-20 group-hover:opacity-40 transition-opacity">
                                                        <span className="text-slate-400 italic text-xs">No slot selected</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm text-slate-300 mb-1">{booking.email}</div>
                                                {booking.phone && <div className="text-xs text-slate-500">{booking.phone}</div>}
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                                                    {booking.service || 'General'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                                                    className={`bg-slate-800 border-none rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all ${booking.status === 'new' ? 'text-emerald-400' :
                                                        booking.status === 'contacted' ? 'text-blue-400' :
                                                            'text-slate-500'
                                                        }`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                                                        className={`p-2 rounded-xl transition-all ${expandedId === booking._id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                                        title="View Details"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(booking._id)}
                                                        className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                        title="Delete Booking"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedId === booking._id && (
                                            <tr className="bg-slate-900/80">
                                                <td colSpan={7} className="p-8">
                                                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                                        {/* Premium Detailed Card */}
                                                        <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                                            <div className="grid md:grid-cols-3">
                                                                {/* Left Col: Info */}
                                                                <div className="p-8 border-b md:border-b-0 md:border-r border-slate-800 space-y-8">
                                                                    <div>
                                                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Client Information</h4>
                                                                        <div className="space-y-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                                                                                    <User size={18} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-white font-bold">{booking.name}</p>
                                                                                    <p className="text-xs text-slate-500">Full Name</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                                                                                    <Mail size={18} />
                                                                                </div>
                                                                                <div className="min-w-0">
                                                                                    <p className="text-white font-medium truncate">{booking.email}</p>
                                                                                    <p className="text-xs text-slate-500">Email Address</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                                                                                    <Phone size={18} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-white font-medium">{booking.phone || 'Not provided'}</p>
                                                                                    <p className="text-xs text-slate-500">Phone Number</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="pt-8 border-t border-slate-800">
                                                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Session Details</h4>
                                                                        <div className="space-y-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                                                                                    <Calendar size={18} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-white font-medium">{booking.bookingDate || 'TBD'}</p>
                                                                                    <p className="text-xs text-slate-500">Scheduled Date</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                                                                                    <Clock size={18} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-white font-medium">{booking.bookingTime ? `${booking.bookingTime} PST` : 'TBD'}</p>
                                                                                    <p className="text-xs text-slate-500">Scheduled Time</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center">
                                                                                    <CheckCircle size={18} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-white font-medium capitalize">{booking.status}</p>
                                                                                    <p className="text-xs text-slate-500">Current Status</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Center Col: Message */}
                                                                <div className="p-8 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/30">
                                                                    <div className="flex items-center justify-between mb-6">
                                                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inquiry Message</h4>
                                                                        <MessageSquare size={16} className="text-emerald-500/50" />
                                                                    </div>
                                                                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                                                                        {booking.message}
                                                                    </div>
                                                                </div>

                                                                {/* Right Col: Admin Notes */}
                                                                <div className="p-8 space-y-6">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Internal Admin Notes</h4>
                                                                        <StickyNote size={16} className="text-blue-500/50" />
                                                                    </div>

                                                                    {editingNoteId === booking._id ? (
                                                                        <div className="space-y-4">
                                                                            <textarea
                                                                                value={noteContent}
                                                                                onChange={(e) => setNoteContent(e.target.value)}
                                                                                className="w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                                                rows={6}
                                                                                placeholder="Add internal observations, follow-up status..."
                                                                            />
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={() => saveNote(booking._id)}
                                                                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                                                                                >
                                                                                    SAVE NOTES
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setEditingNoteId(null)}
                                                                                    className="px-4 py-3 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-700 transition-all"
                                                                                >
                                                                                    CANCEL
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="group relative">
                                                                            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm italic min-h-[150px]">
                                                                                {booking.notes || 'No internal notes have been added yet for this client.'}
                                                                            </div>
                                                                            <button
                                                                                onClick={() => startEditingNote(booking)}
                                                                                className="absolute top-4 right-4 text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    <div className="pt-4 flex justify-between items-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                                                        <span>ID: {booking._id.substring(0, 8)}</span>
                                                                        <span>Received: {new Date(booking.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
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
                        <div className="py-20 text-center">
                            <p className="text-slate-600 font-medium">No booking requests found in the system.</p>
                        </div>
                    )}
                </div>

                {/* Deletion Confirmation Modal */}
                {deletingId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setDeletingId(null)}></div>
                        <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white text-center mb-2">Delete Booking?</h3>
                            <p className="text-slate-400 text-center mb-8 text-sm leading-relaxed">
                                This action cannot be undone. All information for <span className="text-white font-bold">{bookings.find(b => b._id === deletingId)?.name}</span> will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => deleteBooking(deletingId)}
                                    className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20"
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    onClick={() => setDeletingId(null)}
                                    className="px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
