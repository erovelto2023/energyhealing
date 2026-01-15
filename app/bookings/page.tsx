import React from 'react';
import dynamic from 'next/dynamic';

const BookingsClient = dynamic(() => import('@/components/bookings/BookingsClient'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Preparing your session...</p>
        </div>
    )
});

export const metadata = {
    title: 'Book a Healing Session | Kathleen Heals',
    description: 'Schedule your personalized energy healing session. Remote and in-person options available.',
};

export default function BookingsPage() {
    return <BookingsClient />;
}
