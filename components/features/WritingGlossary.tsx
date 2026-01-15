"use client";

import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Lightbulb, Zap, Copy, Check, Filter, ArrowRight, Grid, List, Sparkles } from 'lucide-react';
import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';

interface WritingGlossaryProps {
    terms: IGlossaryTerm[];
}

const Card = ({ term }: { term: IGlossaryTerm }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(term.term);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Extract Why and Example from definition markdown
    // We expect: 
    // ### Marketing Strategy
    // Why it works...
    // ### Examples
    // * **Primary Example:** "..."

    // Simple extraction logic for our specific format
    const definitionParts = term.definition?.split('###');
    const whyPart = definitionParts?.find(p => p.includes('Marketing Strategy'))?.replace('Marketing Strategy', '').trim();
    const examplePart = definitionParts?.find(p => p.includes('Examples'))?.replace('Examples', '').trim()
        .split('\n').find(l => l.includes('Example:'))?.replace(/^\*?\s*\*\*?.*?\*\*?\s*:?\s*"?(.*?)"?$/, '$1').trim();

    return (
        <div className="rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full bg-white group">
            <div className="flex justify-between items-start mb-6">
                <span className="inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                    {term.synonyms?.[0] || 'General'}
                </span>
                <button
                    onClick={handleCopy}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-inner group-hover:scale-110"
                    title="Copy phrase"
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-indigo-600 transition-colors">"{term.term}"</h3>

            <div className="space-y-6 flex-grow">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 mb-3 uppercase tracking-widest opacity-40">
                        <Lightbulb size={14} className="text-amber-500" />
                        <span>The Psychology</span>
                    </div>
                    <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                        {whyPart || "A persuasive phrase designed to trigger cognitive hooks and emotional resonance in your reader."}
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                        <Zap size={48} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-900/40 mb-3 uppercase tracking-widest relative z-10">
                        <Zap size={14} className="text-indigo-500" />
                        <span>In Action</span>
                    </div>
                    <p className="text-indigo-900 text-[15px] italic font-serif leading-relaxed relative z-10">
                        "{examplePart || term.shortDefinition || '...'}"
                    </p>
                </div>
            </div>
        </div>
    );
};

const SimpleListItem = ({ term }: { term: IGlossaryTerm }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(term.term);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
            <span className="font-bold text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">{term.term}</span>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleCopy}
                    className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-green-100 text-green-600' : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-indigo-600 hover:shadow-md'}`}
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
        </div>
    );
};

export default function WritingGlossary({ terms }: WritingGlossaryProps) {
    const [view, setView] = useState<'featured' | 'library'>('featured');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredTerms = useMemo(() => {
        return terms.filter(t => {
            const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.definition?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || t.synonyms?.[0] === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, terms]);

    // Split into Detailed (ones with long definitions) vs Simple
    // For featured view, we only want ones that have the ### structure
    const featured = useMemo(() => {
        return filteredTerms.filter(t => t.definition?.includes('###')).slice(0, 50);
    }, [filteredTerms]);

    const categories = useMemo(() => {
        const cats = new Set(terms.filter(t => t.definition?.includes('###')).map(t => t.synonyms?.[0]).filter(Boolean));
        return ['All', ...Array.from(cats as Set<string>).sort()];
    }, [terms]);

    return (
        <div className="w-full">
            {/* Search & Toggle Bar */}
            <div className="max-w-5xl mx-auto mb-16 space-y-10">
                <div className="relative group">
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-indigo-600/5 blur-2xl -mb-2 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Search hypnotic patterns..."
                        className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-3xl text-xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-xl shadow-slate-200/50 transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex justify-center">
                    <div className="bg-slate-100/50 p-1.5 rounded-2xl inline-flex shadow-inner border border-slate-200/50 backdrop-blur-sm">
                        <button
                            onClick={() => setView('featured')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'featured' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Grid size={16} /> Featured & Analyzed
                        </button>
                        <button
                            onClick={() => setView('library')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'library' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <List size={16} /> Full Library ({filteredTerms.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured View */}
            {view === 'featured' && (
                <div className="space-y-12">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 justify-center pb-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${selectedCategory === cat
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featured.map((term) => (
                            <Card key={term.id} term={term} />
                        ))}
                        {featured.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Sparkles size={48} className="mx-auto text-slate-200 mb-4 animate-pulse" />
                                <h3 className="text-xl font-bold text-slate-900">No analyzed patterns found</h3>
                                <p className="text-slate-500">Try searching for broad terms or broaden your category filter.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] p-12 mt-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4">Master the Complete Inventory</h2>
                            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto font-medium">The full index contains {terms.length} phrases and power patterns designed to bypass logical resistance.</p>
                            <button
                                onClick={() => setView('library')}
                                className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-900/20"
                            >
                                Open Full Library <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Library View */}
            {view === 'library' && (
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col h-[75vh]">
                    <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">The Complete Index</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredTerms.length} patterns available</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto p-10 flex-grow scrollbar-hide">
                        {filteredTerms.length === 0 ? (
                            <div className="p-20 text-center text-slate-300 font-bold text-xl uppercase tracking-tighter italic">No transmission matches.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {filteredTerms.map((term) => (
                                    <SimpleListItem key={term.id} term={term} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
