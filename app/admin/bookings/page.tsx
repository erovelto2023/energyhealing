import React from 'react';
import dynamic from 'next/dynamic';

const AdminBookingsClient = dynamic(() => import('@/components/admin/AdminBookingsClient'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">Entering Secure Area...</p>
        </div>
    )
});

export const metadata = {
    title: 'Admin: Booking Requests | Kathleen Heals',
    description: 'Manage healing session bookings and client inquiries.',
};

export default function AdminBookingsPage() {
    return <AdminBookingsClient />;
}
