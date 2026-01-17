"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Search } from 'lucide-react';
import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface GlossaryListProps {
    terms: IGlossaryTerm[];
    initialTotalPages: number;
    initialPage: number;
}

export default function GlossaryList({ terms, initialTotalPages, initialPage }: GlossaryListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Sync state with URL params
    const activeLetter = searchParams.get('letter') || 'All';
    const searchQuery = searchParams.get('q') || '';
    const currentPage = parseInt(searchParams.get('page') || String(initialPage));

    // Local state for input to allow typing without constant router push
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                updateParams({ q: localSearch, page: 1, letter: undefined });
            }
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSearch, searchQuery]);

    const updateParams = (updates: any) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.keys(updates).forEach(key => {
            if (updates[key] === undefined || updates[key] === null || updates[key] === '') {
                params.delete(key);
            } else {
                params.set(key, updates[key]);
            }
        });

        // If we change search or filters, usually reset page to 1, unless page is explicitly passed
        if (!updates.page && (updates.q !== undefined || updates.letter !== undefined)) {
            params.set('page', '1');
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const alphabet = ['All', ...Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i))];

    // Cleaning utility for short definitions
    const cleanDefinition = (text: string) => {
        if (!text) return "";
        return text
            .replace(/[#*`_~]/g, '') // Strip markdown characters
            .replace(/^Definition:\s*/i, '')
            .substring(0, 160).trim() + "...";
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative -mt-10 z-10">
            {/* Search Input Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-2 mb-12 flex items-center max-w-2xl mx-auto">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-xl mr-3">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by term, definition, or concept..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 font-medium placeholder:text-slate-400 h-10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar / Index */}
                <div className="hidden lg:block lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 sticky top-24">
                        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center">
                            <BookOpen size={16} className="mr-2 text-teal-600" /> A-Z Filter
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {alphabet.map(char => (
                                <button
                                    key={char}
                                    onClick={() => {
                                        setLocalSearch('');
                                        updateParams({ letter: char === 'All' ? undefined : char, q: undefined, page: 1 });
                                    }}
                                    className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-xl transition-all ${activeLetter === char && !searchQuery
                                        ? 'bg-teal-700 text-white shadow-lg shadow-teal-200 scale-110'
                                        : 'text-slate-400 hover:text-teal-700 hover:bg-teal-50'
                                        }`}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-3">
                    {/* Mobile Navigation */}
                    <div className="mb-8 lg:hidden overflow-x-auto pb-4 flex gap-2 no-scrollbar">
                        {alphabet.map(char => (
                            <button
                                key={char}
                                onClick={() => {
                                    setLocalSearch('');
                                    updateParams({ letter: char === 'All' ? undefined : char, q: undefined, page: 1 });
                                }}
                                className={`flex-shrink-0 px-4 py-2 text-[10px] font-bold uppercase rounded-full border transition-all ${activeLetter === char && !searchQuery
                                    ? 'bg-teal-700 text-white border-teal-700 shadow-lg shadow-teal-100'
                                    : 'bg-white text-slate-400 border-stone-200'
                                    }`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>

                    {terms.length > 0 ? (
                        <div className="space-y-4">
                            {terms.map((item) => (
                                <Link
                                    href={`/glossary/${item.slug || item.id}`}
                                    key={item.id}
                                    className="group block bg-white rounded-2xl border border-stone-100 p-6 md:p-8 hover:border-teal-200 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex justify-between items-start gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                                                    {item.term}
                                                </h3>
                                                {item.niche && (
                                                    <span className="px-3 py-1 bg-stone-50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-stone-100">
                                                        {item.niche}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl font-light">
                                                {cleanDefinition(item.shortDefinition || item.definition)}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-slate-300 group-hover:bg-teal-700 group-hover:text-white group-hover:rotate-45 transition-all duration-300 shrink-0 shadow-inner">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
                            <div className="bg-stone-50 p-6 rounded-full inline-block mb-4 text-stone-300">
                                <Search size={40} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900">No results found</h3>
                            <p className="text-slate-500 mt-2">
                                {searchQuery ? `We couldn't find anything for "${searchQuery}"` : `No terms found for "${activeLetter}"`}
                            </p>
                            <button
                                onClick={() => {
                                    setLocalSearch('');
                                    updateParams({ letter: undefined, q: undefined, page: 1 });
                                }}
                                className="mt-6 text-sm font-bold text-teal-700 uppercase tracking-widest hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {initialTotalPages > 1 && (
                        <div className="mt-12 flex items-center justify-between bg-white px-8 py-6 rounded-3xl border border-stone-100 shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Page <span className="text-slate-900">{currentPage}</span> / {initialTotalPages}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        updateParams({ page: Math.max(1, currentPage - 1) });
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-6 py-2 rounded-xl border border-stone-200 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => {
                                        updateParams({ page: Math.min(initialTotalPages, currentPage + 1) });
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === initialTotalPages}
                                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-teal-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-stone-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
