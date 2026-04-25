'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const isAdmin = user?.publicMetadata?.role === 'admin' || user?.emailAddresses[0]?.emailAddress === 'erove@example.com';

    useEffect(() => {
        if (isLoaded && (!user || !isAdmin)) {
            router.push('/')
        }
    }, [user, isLoaded, router, isAdmin])

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Authenticating Admin...</p>
            </div>
        )
    }

    if (!user || !isAdmin) return null

    return <>{children}</>
}
