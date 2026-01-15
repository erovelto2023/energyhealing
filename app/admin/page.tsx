import React from 'react';
import dynamic from 'next/dynamic';

const AdminDashboardClient = dynamic(() => import('@/components/admin/AdminDashboardClient'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Authenticating Administration...</p>
        </div>
    )
});

export const metadata = {
    title: 'Admin Dashboard | Kathleen Heals',
    description: 'Secure control panel for managing healer operations.',
};

export default function AdminPage() {
    return <AdminDashboardClient />;
}
