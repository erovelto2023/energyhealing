"use client";

import React, { useState, useMemo } from 'react';
import { LayoutGrid, ChevronRight, Search } from 'lucide-react';
import { IProduct } from '@/lib/models/Product';
import Link from 'next/link';

export default function ToolsAlphabeticalList({ tools }: { tools: IProduct[] }) {
    const [activeLetter, setActiveLetter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const filteredTools = useMemo(() => {
        // Sort tools alphabetically by name first
        const sorted = [...tools].sort((a, b) => a.name.localeCompare(b.name));
        if (activeLetter === 'All') return sorted;
        return sorted.filter(t => t.name.toUpperCase().startsWith(activeLetter));
    }, [activeLetter, tools]);

    // Reset to page 1 when filter changes
    const handleLetterChange = (letter: string) => {
        setActiveLetter(letter);
        setCurrentPage(1);
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

    const alphabet = ['All', ...Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i))];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar / Index */}
                <div className="hidden lg:block lg:col-span-1 space-y-4">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6 flex items-center">
                            <LayoutGrid size={18} className="mr-2 text-indigo-600" /> Tool Directory
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {alphabet.map(char => (
                                <button
                                    key={char}
                                    onClick={() => handleLetterChange(char)}
                                    className={`aspect-square flex items-center justify-center text-[10px] font-black rounded-xl transition-all ${activeLetter === char
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110'
                                        : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
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
                                onClick={() => handleLetterChange(char)}
                                className={`flex-shrink-0 px-5 py-2 text-[10px] font-black uppercase rounded-full border transition-all ${activeLetter === char
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                    : 'bg-white text-slate-400 border-slate-100'
                                    }`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>

                    {paginatedTools.length > 0 ? (
                        <div className="space-y-4">
                            {paginatedTools.map((item) => (
                                <Link
                                    href={`/tool/${item.id}`}
                                    key={item.id}
                                    className="group block bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all active:scale-[0.99]"
                                >
                                    <div className="flex justify-between items-center gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${item.logoColor}`}>
                                                    {item.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                    {item.niche}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl font-medium">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-45 transition-all shrink-0">
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                            <div className="bg-slate-50 p-6 rounded-full inline-block mb-4 text-slate-300">
                                <Search size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">No tools found</h3>
                            <p className="text-slate-500 mt-2">We couldn't find any tools starting with "{activeLetter}"</p>
                            <button
                                onClick={() => handleLetterChange('All')}
                                className="mt-6 text-sm font-black text-indigo-600 uppercase tracking-widest hover:underline"
                            >
                                View All Tools
                            </button>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredTools.length > 0 && totalPages > 1 && (
                        <div className="mt-12 flex flex-col md:flex-row items-center justify-between bg-white px-8 py-6 rounded-[2rem] border border-slate-100 shadow-sm gap-6">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest order-2 md:order-1">
                                Showing <span className="text-slate-900">{startIndex + 1}</span> - <span className="text-slate-900">{Math.min(startIndex + itemsPerPage, filteredTools.length)}</span> of {filteredTools.length} tools
                            </div>

                            <div className="flex items-center gap-2 order-1 md:order-2">
                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.max(1, p - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} className="rotate-180" />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => {
                                                    setCurrentPage(pageNum);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${currentPage === pageNum
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110'
                                                        : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.min(totalPages, p + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
