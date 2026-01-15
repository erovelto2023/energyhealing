'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { LayoutDashboard, Calendar, FileText, BookOpen, Settings, ChevronRight, Star, BookHeart, MessageCircle } from 'lucide-react'

export default function AdminDashboardClient() {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/')
        }
    }, [user, isLoaded])

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Authenticating Admin...</p>
            </div>
        )
    }

    if (!user) return null

    const adminCards = [
        {
            title: 'Booking Requests',
            description: 'View and manage client booking inquiries.',
            href: '/admin/bookings',
            icon: <Calendar size={24} />,
            color: 'from-blue-500 to-cyan-500',
            tag: 'Needs Attention'
        },
        {
            title: 'Testimonial Review',
            description: 'Approve and feature client testimonials.',
            href: '/admin/testimonials',
            icon: <Star size={24} />,
            color: 'from-emerald-500 to-teal-500',
            tag: 'Needs Review'
        },
        {
            title: 'User Stories Review',
            description: 'Approve community healing journey stories.',
            href: '/admin/user-stories',
            icon: <BookHeart size={24} />,
            color: 'from-indigo-500 to-purple-500',
            tag: 'Community'
        },
        {
            title: 'Comment Review',
            description: 'Moderate and approve story comments.',
            href: '/admin/comments',
            icon: <MessageCircle size={24} />,
            color: 'from-cyan-500 to-blue-500',
            tag: 'Moderation'
        },
        {
            title: 'Blog Management',
            description: 'Create, edit, and publish blog posts.',
            href: '/admin/blog',
            icon: <FileText size={24} />,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Glossary & Products',
            description: 'Manage glossary terms, products, and reviews.',
            href: '/admin/dmn',
            icon: <BookOpen size={24} />,
            color: 'from-orange-500 to-amber-500'
        },
        {
            title: 'Internal Tools',
            description: 'Platform settings and system maintenance.',
            href: '#',
            icon: <Settings size={24} />,
            color: 'from-slate-500 to-slate-700',
            disabled: true
        }
    ]

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 text-emerald-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                        <LayoutDashboard size={14} /> Admin Access
                    </div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight">
                        Platform Control
                    </h1>
                    <p className="text-slate-500 text-lg font-light max-w-2xl">
                        Welcome, {user.firstName || 'Manager'}. Everything you need to guide the healing energy of this platform is at your fingertips.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {adminCards.map((card, index) => (
                        <Link
                            key={index}
                            href={card.href}
                            className={`group relative ${card.disabled ? 'pointer-events-none opacity-40' : ''}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2rem] hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-500 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/20`}>
                                        {card.icon}
                                    </div>
                                    {card.tag && (
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                                            {card.tag}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">{card.title}</h3>
                                <p className="text-slate-400 font-light leading-relaxed mb-8">{card.description}</p>

                                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest py-2">
                                    {card.disabled ? 'Planned Feature' : 'Enter Module'}
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 pt-12 border-t border-slate-900">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Platform Version 1.4.2 &bull; Encrypted Session
                        </div>
                        <div className="flex gap-8">
                            <Link href="/" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Main Site</Link>
                            <Link href="/bookings" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Client Form</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
