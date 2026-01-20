import React from 'react';
import Link from 'next/link';
import { getAffirmationBySlug } from '@/lib/actions';
import { Sparkles, ArrowLeft, Leaf, Moon, Wind, Heart, Info, BookOpen } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = params.slug;
    const affirmation = await getAffirmationBySlug(slug);

    if (!affirmation) {
        return {
            title: 'Ritual Not Found | Kathleen Heals',
        };
    }

    return {
        title: `${affirmation.title} | Daily Ritual`,
        description: affirmation.intention || `A daily ritual for ${affirmation.category}`,
    };
}

export default async function AffirmationDetailPage({ params }: Props) {
    const affirmation = await getAffirmationBySlug(params.slug);

    if (!affirmation) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">

            {/* Header / Nav */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/affirmations" className="text-slate-500 hover:text-purple-600 font-bold text-sm flex items-center gap-2 transition-colors">
                        <ArrowLeft size={16} /> Back to Library
                    </Link>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Ritual</span>
                </div>
            </div>

            {/* Hero Card */}
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-purple-100 border border-slate-100 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400"></div>

                    <span className="inline-block bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
                        {affirmation.category}
                    </span>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">
                        {affirmation.title}
                    </h1>

                    <div className="relative">
                        <span className="text-9xl text-purple-100 absolute -top-12 -left-4 md:left-12 font-serif opacity-50">“</span>
                        <p className="relative z-10 text-2xl md:text-4xl font-serif italic text-slate-700 leading-relaxed max-w-2xl mx-auto">
                            {affirmation.affirmation}
                        </p>
                        <span className="text-9xl text-purple-100 absolute -bottom-24 -right-4 md:right-12 font-serif opacity-50">”</span>
                    </div>
                </div>
            </div>

            {/* Ritual Steps */}
            <div className="max-w-3xl mx-auto px-6 mt-16 space-y-12">

                {/* Intention & Science */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="flex items-center gap-3 font-black text-slate-900 mb-4">
                            <Heart className="text-pink-400" size={20} /> The Intention
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            {affirmation.intention}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="flex items-center gap-3 font-black text-slate-900 mb-4">
                            <BookOpen className="text-blue-400" size={20} /> Why It Works
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {affirmation.whyItWorks}
                        </p>
                    </div>
                </div>

                {/* The Pairing Ritual */}
                <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
                        <Sparkles className="text-amber-400" /> Sacred Pairing
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Herb */}
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                            <h4 className="flex items-center gap-2 text-emerald-800 font-bold mb-2 text-sm uppercase tracking-wider">
                                <Leaf size={16} /> Plant Ally
                            </h4>
                            <p className="text-emerald-900 font-bold text-lg mb-1">{affirmation.primaryHerb}</p>
                            {affirmation.pairing?.herbs?.length > 0 && (
                                <p className="text-emerald-700 text-xs">Pairs with: {affirmation.pairing.herbs.join(', ')}</p>
                            )}
                        </div>

                        {/* Breathwork */}
                        <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
                            <h4 className="flex items-center gap-2 text-sky-800 font-bold mb-2 text-sm uppercase tracking-wider">
                                <Wind size={16} /> Breathwork
                            </h4>
                            <p className="text-sky-900 font-bold text-lg">{affirmation.pairing?.breathwork || 'Deep Diaphragmatic Breathing'}</p>
                        </div>

                        {/* Ritual Action */}
                        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 md:col-span-2">
                            <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-2 text-sm uppercase tracking-wider">
                                <Sparkles size={16} /> Ritual Action
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {affirmation.pairing?.rituals?.map((ritual: string, idx: number) => (
                                    <span key={idx} className="bg-white bg-opacity-60 border border-amber-200 px-3 py-1 rounded-full text-amber-900 font-medium text-sm">
                                        {ritual}
                                    </span>
                                )) || <span className="text-amber-900 italic">Sit in stillness.</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reflection Prompt */}
                {affirmation.userPrompt && (
                    <div className="bg-slate-900 text-slate-200 p-8 md:p-12 rounded-[2rem] text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Moon size={120} />
                        </div>
                        <h3 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-4">Journal Prompt</h3>
                        <p className="text-2xl md:text-3xl font-serif italic text-white leading-normal">
                            "{affirmation.userPrompt}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
