import React from 'react';
import { getAffirmations } from '@/lib/actions';
import { Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import AffirmationsList from '@/components/features/AffirmationsList';

export const metadata: Metadata = {
    title: 'Daily Rituals & Affirmations | Kathleen Heals',
    description: 'A collection of somatic affirmations, daily rituals, and herbal pairings to regulate your nervous system and expand your worth.',
};

export default async function AffirmationsPage() {
    const affirmations = await getAffirmations();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <div className="bg-purple-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                        <span className="bg-purple-800 text-purple-200 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={16} /> Somatic Healing Library
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                        Daily <span className="text-purple-300 font-serif italic">Rituals</span>
                    </h1>
                    <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                        A curated collection of neuro-somatic affirmations and herbal pairings designed to regulate your nervous system and rewire your beliefs.
                    </p>
                </div>
            </div>

            <AffirmationsList initialAffirmations={affirmations} />
        </div>
    );
}
