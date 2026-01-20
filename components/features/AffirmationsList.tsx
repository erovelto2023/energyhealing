"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IAffirmation } from '@/lib/models/Affirmation';
import { Sparkles, ArrowRight, Leaf, Moon, Search, Shuffle } from 'lucide-react';

interface AffirmationsListProps {
    initialAffirmations: any[]; // Using any to avoid strict type issues with serialized data
}

export default function AffirmationsList({ initialAffirmations }: AffirmationsListProps) {
    const [affirmations, setAffirmations] = useState<any[]>(initialAffirmations);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'random' | 'newest'>('random');
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    // Randomize on mount
    useEffect(() => {
        if (sort === 'random') {
            const shuffled = [...initialAffirmations].sort(() => Math.random() - 0.5);
            setAffirmations(shuffled);
        } else {
            // Newest (Default DB order usually, or parse dates)
            const sorted = [...initialAffirmations].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            setAffirmations(sorted);
        }
        setPage(1); // Reset page on sort change
    }, [sort, initialAffirmations]);

    // Filtering
    const filteredItems = affirmations.filter(item => {
        const term = search.toLowerCase();
        return (
            item.title?.toLowerCase().includes(term) ||
            item.affirmation?.toLowerCase().includes(term) ||
            item.category?.toLowerCase().includes(term) ||
            item.intention?.toLowerCase().includes(term)
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by intention, category, or keyword..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-700 font-medium"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                    <button
                        onClick={() => setSort('random')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${sort === 'random' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Shuffle size={14} /> Randomize
                    </button>
                    <button
                        onClick={() => setSort('newest')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${sort === 'newest' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Sparkles size={14} /> Newest
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {paginatedItems.map((affirmation) => (
                    <Link
                        href={`/affirmations/${affirmation.slug}`}
                        key={affirmation.id}
                        className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 block h-full flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">
                                    {affirmation.category}
                                </span>
                                {affirmation.pairing?.moonPhase && (
                                    <span className="text-slate-400" title={`Best for ${affirmation.pairing.moonPhase} Moon`}>
                                        <Moon size={16} />
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-purple-700 transition-colors">
                                {affirmation.title}
                            </h3>
                            <p className="font-serif italic text-xl text-slate-600 leading-relaxed mb-6">
                                "{affirmation.affirmation}"
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-6 flex items-center justify-between text-sm font-bold text-slate-500 group-hover:text-purple-600 transition-colors">
                            <span className="flex items-center gap-2">
                                <Leaf size={16} className="text-emerald-500" />
                                {affirmation.primaryHerb || 'Daily Practice'}
                            </span>
                            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Sparkles size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-xl font-bold text-slate-400">No rituals found matching your vibe.</p>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Previous
                    </button>
                    <span className="px-6 py-3 font-bold text-slate-400">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
