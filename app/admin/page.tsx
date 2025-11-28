'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AdminDashboard() {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/')
        }
    }, [user, isLoaded])

    if (!isLoaded) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
    }

    if (!user) return null

    const adminCards = [
        {
            title: 'Booking Requests',
            description: 'View and manage client booking inquiries.',
            href: '/admin/bookings',
            icon: '📬',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Blog Management',
            description: 'Create, edit, and publish blog posts.',
            href: '/admin/blog',
            icon: '✍️',
            color: 'from-purple-500 to-pink-500'
        },
        // Placeholder for future features
        {
            title: 'Journal Entries',
            description: 'Review user journal entries (Coming Soon).',
            href: '#',
            icon: '📔',
            color: 'from-emerald-500 to-teal-500',
            disabled: true
        }
    ]

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-400 mb-12">Welcome back, {user.firstName || 'Admin'}. What would you like to do today?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminCards.map((card, index) => (
                        <Link
                            key={index}
                            href={card.href}
                            className={`block relative group ${card.disabled ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${card.color} rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-300`}></div>
                            <div className="relative h-full glass-card p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform group-hover:-translate-y-1">
                                <div className="text-4xl mb-4">{card.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                                <p className="text-gray-400">{card.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
