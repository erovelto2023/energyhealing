"use client";

import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Filter, ChevronRight } from 'lucide-react';
import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';
import Link from 'next/link';
import MarketingWordCard from './MarketingWordCard';

export default function WritingGlossaryList({ terms }: { terms: IGlossaryTerm[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLetter, setActiveLetter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const alphabet = ['All', '#', ...Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i))];

    const filteredTerms = useMemo(() => {
        return terms.filter(t => {
            // Search filter
            const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.definition.toLowerCase().includes(searchTerm.toLowerCase());

            // Letter filter
            let matchesLetter = activeLetter === 'All';
            if (activeLetter === '#') {
                matchesLetter = /^[0-9]/.test(t.term);
            } else if (activeLetter !== 'All') {
                matchesLetter = t.term.toUpperCase().startsWith(activeLetter);
            }

            return matchesSearch && matchesLetter;
        });
    }, [searchTerm, activeLetter, terms]);

    // Reset to page 1 when filters change
    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setter(value);
        setCurrentPage(1);
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTerms = filteredTerms.slice(startIndex, endIndex);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar / Index */}
                <div className="hidden lg:block lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-4 flex items-center">
                            <BookOpen size={18} className="mr-2 text-indigo-500" /> Index
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {alphabet.map(char => (
                                <button
                                    key={char}
                                    onClick={() => handleFilterChange(setActiveLetter, char)}
                                    className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${activeLetter === char
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* List Content */}
                <div className="lg:col-span-3">
                    {/* Search Bar at top of list */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search persuasive patterns or psychological triggers..."
                            value={searchTerm}
                            onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none shadow-sm"
                        />
                    </div>

                    {/* Mobile Alphabet Scroller */}
                    <div className="mb-6 lg:hidden overflow-x-auto pb-2 flex gap-2">
                        {alphabet.map(char => (
                            <button
                                key={char}
                                onClick={() => handleFilterChange(setActiveLetter, char)}
                                className={`flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${activeLetter === char
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                    : 'bg-white text-slate-500 border-slate-200'
                                    }`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>


                    {paginatedTerms.length > 0 ? (
                        <>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                                {paginatedTerms.map((item) => (
                                    <Link
                                        href={`/glossary/${item.slug || item.id}`}
                                        key={item.id}
                                        className="p-6 md:p-8 hover:bg-slate-50 transition-all cursor-pointer group block"
                                    >
                                        <div className="flex justify-between items-center gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                        "{item.term}"
                                                    </h3>
                                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-wider rounded-full">
                                                        {item.synonyms?.[0] || item.niche}
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl">
                                                    {item.shortDefinition || item.definition.substring(0, 150)}
                                                </p>
                                            </div>
                                            <div className="text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all flex-shrink-0">
                                                <ChevronRight size={32} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="text-sm text-slate-600 font-medium">
                                        Showing <span className="text-indigo-600">{startIndex + 1}</span> to <span className="text-indigo-600">{Math.min(endIndex, filteredTerms.length)}</span> of {filteredTerms.length} patterns
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Previous
                                        </button>
                                        <div className="hidden md:flex items-center gap-1">
                                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 7) pageNum = i + 1;
                                                else if (currentPage <= 4) pageNum = i + 1;
                                                else if (currentPage >= totalPages - 3) pageNum = totalPages - 6 + i;
                                                else pageNum = currentPage - 3 + i;

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === pageNum
                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                            : 'border border-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
                            <div className="bg-slate-50 p-6 rounded-full inline-block mb-4 text-slate-300">
                                <Search size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No patterns found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your filters or search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
