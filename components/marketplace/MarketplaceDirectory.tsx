'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Tag, ArrowRight, LayoutTemplate, Search, Compass, ChevronRight, BookOpen, Sparkles } from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    description: string;
    price: string | number;
    niche: string;
    slug: string;
    type: string;
    link: string;
    source: string;
}

export default function MarketplaceDirectory({ resources }: { resources: Resource[] }) {
    const [activeLetter, setActiveLetter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const alphabet = ['All', ...Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i))];

    const filteredResources = useMemo(() => {
        let result = [...resources];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
        }

        // Letter Filter
        if (activeLetter !== 'All') {
            result = result.filter(p => p.title.toUpperCase().startsWith(activeLetter));
        }

        // Sort Alphabetically
        return result.sort((a, b) => a.title.localeCompare(b.title));
    }, [resources, activeLetter, searchQuery]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeLetter, searchQuery]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

    if (!resources || resources.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Compass size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No resources found</h3>
                <p className="font-light">We haven't added any resources to the directory yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 relative -mt-8 z-10">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-slate-100 p-2 mb-12 flex items-center max-w-2xl mx-auto">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mr-3">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by title, tool, or educational concept..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 font-medium placeholder:text-slate-400 h-10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Index */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-28">
                        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center">
                            <Tag size={16} className="mr-2 text-emerald-600" /> A-Z Index
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {alphabet.map(char => (
                                <button
                                    key={char}
                                    onClick={() => {
                                        setActiveLetter(char);
                                        setSearchQuery('');
                                    }}
                                    className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-xl transition-all ${activeLetter === char && !searchQuery
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110'
                                        : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main List */}
                <div className="lg:col-span-3">
                    {/* Mobile Index */}
                    <div className="mb-8 lg:hidden overflow-x-auto pb-4 flex gap-2 no-scrollbar">
                        {alphabet.map(char => (
                            <button
                                key={char}
                                onClick={() => {
                                    setActiveLetter(char);
                                    setSearchQuery('');
                                }}
                                className={`flex-shrink-0 px-5 py-2 text-[10px] font-bold uppercase rounded-full border transition-all ${activeLetter === char && !searchQuery
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100'
                                    : 'bg-white text-slate-400 border-slate-100'
                                    }`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>

                    {paginatedResources.length > 0 ? (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {paginatedResources.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.link}
                                        target={item.link.startsWith('http') ? '_blank' : undefined}
                                        className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all flex flex-col h-full group border-b-4 border-b-transparent hover:border-b-emerald-500"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-12 h-12 ${item.source === 'SalesPage' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                                {item.source === 'SalesPage' ? <BookOpen size={24} /> : <Sparkles size={24} />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        {item.type}
                                                    </span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                        {item.niche}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-500 leading-relaxed mb-8 line-clamp-3 flex-grow font-light">
                                            {item.description || "Explore this specialized resource designed to enhance your energetic well-being."}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Investment</span>
                                                <span className="text-lg font-bold text-slate-800">
                                                    {item.price ? (typeof item.price === 'number' ? `$${item.price}` : item.price) : 'Contact for Info'}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-between bg-white px-8 py-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Page <span className="text-slate-900">{currentPage}</span> / {totalPages}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.max(1, prev - 1));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === 1}
                                            className="px-6 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === totalPages}
                                            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                            <div className="bg-slate-50 p-6 rounded-full inline-block mb-4 text-slate-300">
                                <Search size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No matches found</h3>
                            <p className="text-slate-400 font-light mt-2 max-w-sm mx-auto">
                                We couldn't find any tools or resources matching your criteria. Try a different letter or broader search term.
                            </p>
                            <button
                                onClick={() => {
                                    setActiveLetter('All');
                                    setSearchQuery('');
                                }}
                                className="mt-8 text-xs font-bold text-emerald-600 uppercase tracking-widest hover:underline"
                            >
                                View All Resources
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
