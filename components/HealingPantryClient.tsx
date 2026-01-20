
"use client";

import React, { useState, useMemo } from 'react';
import { IHerb } from '@/lib/models/Herb';
import Link from 'next/link';
import {
    Search,
    ChevronRight,
    ArrowLeft,
    Leaf,
    ShieldCheck,
    Zap,
    Heart,
    Brain,
    Activity,
    Info,
    Sparkles,
    Wind,
    Scale,
    ExternalLink
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
    "Spices": "bg-amber-100 text-amber-700 border-amber-200",
    "Herbs": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Mushrooms": "bg-stone-100 text-stone-700 border-stone-200",
    "Chiles": "bg-red-100 text-red-700 border-red-200",
    "Superfood": "bg-purple-100 text-purple-700 border-purple-200",
    "Blend": "bg-blue-100 text-blue-700 border-blue-200",
    "Other": "bg-slate-100 text-slate-700 border-slate-200"
};

export default function HealingPantryClient({ herbs, products = [], initialSlug }: { herbs: IHerb[], products?: any[], initialSlug?: string }) {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedHerb, setSelectedHerb] = useState<IHerb | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    // Initial Load for Deep Linking
    React.useEffect(() => {
        if (initialSlug && herbs.length > 0) {
            const passedHerb = herbs.find(h => h.slug === initialSlug);
            if (passedHerb) {
                setSelectedHerb(passedHerb);
                setView('detail');
            }
        }
    }, [initialSlug, herbs]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Letter "Batch" State
    const [letterPage, setLetterPage] = useState(0);
    const LETTERS_PER_PAGE = 13; // 2 batches for A-Z
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const visibleLetters = alphabet.slice(letterPage * LETTERS_PER_PAGE, (letterPage + 1) * LETTERS_PER_PAGE);

    const filteredItems = useMemo(() => {
        return herbs.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.healing.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesLetter = !selectedLetter || item.name.toUpperCase().startsWith(selectedLetter);
            return matchesSearch && matchesLetter;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchTerm, selectedLetter, herbs]);

    // Paginated Items
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedLetter]);

    const handleSelectItem = (herb: IHerb) => {
        setSelectedHerb(herb);
        setView('detail');
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-[#fcfaf8] text-slate-900 font-sans selection:bg-orange-100">
            {view === 'list' ? (
                <>
                    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100">
                        <div className="max-w-4xl mx-auto px-4 py-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h1 className="text-4xl font-black text-orange-950 tracking-tighter flex items-center gap-2">
                                        HEALING PANTRY <Sparkles className="text-orange-400" />
                                    </h1>
                                    <p className="text-orange-800/60 font-bold uppercase text-[10px] tracking-[0.2em]">The Encyclopedia of Therapeutic Spices</p>
                                </div>
                                <div className="flex bg-orange-50 px-4 py-2 rounded-2xl items-center gap-3 text-orange-900 text-xs font-black shadow-inner border border-orange-100/50">
                                    <Scale size={14} /> KITCHEN MEDICINE: ON
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Find relief: 'joint pain', 'anxiety', 'circulation'..."
                                    className="w-full pl-12 pr-4 py-5 bg-orange-50/30 border-2 border-orange-100/50 rounded-[2rem] focus:ring-8 focus:ring-orange-100/50 focus:bg-white focus:border-orange-200 transition-all outline-none text-lg shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Batched Letter Navigation */}
                            <div className="flex items-center gap-2 mt-8 pb-2">
                                <button
                                    onClick={() => setSelectedLetter(null)}
                                    className={`px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest transition-all ${!selectedLetter ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-orange-400 border border-orange-100 hover:bg-orange-50'}`}
                                >
                                    ALL
                                </button>

                                <div className="flex-1 flex items-center justify-center gap-1.5">
                                    <button
                                        onClick={() => setLetterPage(prev => Math.max(0, prev - 1))}
                                        disabled={letterPage === 0}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50 text-orange-400 disabled:opacity-30 disabled:hover:bg-transparent"
                                    >
                                        <ArrowLeft size={14} />
                                    </button>

                                    {visibleLetters.map(letter => (
                                        <button
                                            key={letter}
                                            onClick={() => setSelectedLetter(letter)}
                                            className={`w-9 h-9 flex-shrink-0 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center
                          ${selectedLetter === letter ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-orange-400 border border-orange-100 hover:bg-orange-50'}`}
                                        >
                                            {letter}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setLetterPage(prev => prev + 1)}
                                        disabled={(letterPage + 1) * LETTERS_PER_PAGE >= alphabet.length}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50 text-orange-400 disabled:opacity-30 disabled:hover:bg-transparent"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-4xl mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            {paginatedItems.map((herb) => {
                                const colors = CATEGORY_COLORS[herb.category] || CATEGORY_COLORS["Other"];
                                return (
                                    <button
                                        key={herb.id}
                                        onClick={() => handleSelectItem(herb)}
                                        className="group relative p-8 bg-white rounded-[2.5rem] border border-orange-100/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left overflow-hidden min-h-[220px] flex flex-col justify-between"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-orange-600 transition-colors duration-500" />
                                        <ChevronRight className="absolute top-6 right-6 text-orange-200 group-hover:text-white z-10" size={24} />

                                        <div className="relative z-10 w-full">
                                            <span className={`inline-block text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full border mb-4 ${colors}`}>
                                                {herb.category}
                                            </span>
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-950 mb-3 leading-tight">{herb.name}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {herb.healing.map((h, i) => (
                                                    <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                            {paginatedItems.length === 0 && (
                                <div className="col-span-full text-center py-20 text-slate-400">
                                    <p className="text-lg font-medium">No remedies found matching your search.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.max(1, p - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-6 py-3 rounded-2xl bg-white border border-orange-100 text-orange-900 font-bold text-xs uppercase tracking-widest hover:bg-orange-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-xs font-black text-orange-400 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.min(totalPages, p + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-3 rounded-2xl bg-white border border-orange-100 text-orange-900 font-bold text-xs uppercase tracking-widest hover:bg-orange-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </main>
                </>
            ) : (
                selectedHerb && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        {/* Detailed View Header */}
                        <div className="h-[40vh] bg-slate-900 relative overflow-hidden flex items-end">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                                <Leaf size={400} className="text-orange-500" />
                            </div>

                            <button
                                onClick={() => setView('list')}
                                className="absolute top-8 left-8 bg-white/10 backdrop-blur-2xl text-white p-4 rounded-full hover:bg-white/20 transition-all border border-white/20 z-20"
                            >
                                <ArrowLeft size={24} />
                            </button>

                            <div className="max-w-4xl mx-auto w-full px-8 pb-12 relative z-20">
                                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border ${CATEGORY_COLORS[selectedHerb.category] || CATEGORY_COLORS["Other"]}`}>
                                    {selectedHerb.category}
                                </span>
                                <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">{selectedHerb.name}</h2>
                            </div>
                        </div>

                        <main className="max-w-4xl mx-auto px-8 py-20">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                                <div className="lg:col-span-8 space-y-16">
                                    {/* Botanical/Remedy Intro */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                                                <Info size={24} />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">The Remedy</h3>
                                        </div>
                                        <p className="text-xl text-slate-600 leading-relaxed font-medium bg-white p-10 rounded-[3rem] border border-orange-50 shadow-sm">
                                            {selectedHerb.description}
                                        </p>
                                    </section>

                                    {/* Physical Restoration */}
                                    {selectedHerb.physical && (
                                        <section>
                                            <div className="flex items-center gap-4 mb-4">
                                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight pl-4 border-l-4 border-red-500">Physical Restoration</h3>
                                            </div>
                                            <p className="text-lg text-slate-700 leading-relaxed mb-6 pl-5">
                                                {selectedHerb.physical}
                                            </p>

                                            {selectedHerb.benefits && (
                                                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3 flex items-center gap-2">
                                                        <ShieldCheck size={14} /> The Science of Benefit
                                                    </h4>
                                                    <p className="text-emerald-900 font-bold leading-relaxed">{selectedHerb.benefits}</p>
                                                </div>
                                            )}
                                        </section>
                                    )}

                                    {/* Emotional Support */}
                                    {selectedHerb.emotional && (
                                        <section>
                                            <div className="flex items-center gap-4 mb-4">
                                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight pl-4 border-l-4 border-blue-500">Emotional & Energetic</h3>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                                                <Sparkles className="absolute -top-10 -right-10 text-white/10" size={200} />
                                                <p className="text-xl font-bold leading-snug relative z-10 italic">
                                                    "{selectedHerb.emotional}"
                                                </p>
                                            </div>
                                        </section>
                                    )}

                                    {/* RECOMMENDED PRODUCTS - NEW! */}
                                    {(selectedHerb.recommendedProducts && selectedHerb.recommendedProducts.length > 0) && (
                                        <section className="pt-8 border-t border-slate-200">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                    <ExternalLink size={24} />
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Recommended Pairings</h3>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {selectedHerb.recommendedProducts.map((rec) => {
                                                    const product = products.find(p => String(p.id) === String(rec.productId));
                                                    if (!product) return null;

                                                    return (
                                                        <Link key={product.id} href={product.affiliateLink || '#'} target="_blank" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all flex items-start gap-4 group">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">{product.type || "Tool"}</span>
                                                                </div>
                                                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                                                                <p className="text-slate-500 text-sm">{product.shortDescription || product.description?.substring(0, 80) + "..."}</p>
                                                                {rec.note && <p className="mt-2 text-xs font-medium text-slate-600 italic bg-slate-50 p-2 rounded">Note: {rec.note}</p>}
                                                            </div>
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                                <ExternalLink size={16} />
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="lg:col-span-4 space-y-8">
                                    <div className="sticky top-24 space-y-8">
                                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-8 border-b border-white/10 pb-4">Focus Areas</h4>
                                            <div className="space-y-6">
                                                {selectedHerb.healing.map((factor, i) => (
                                                    <div key={i} className="flex items-center gap-4 group">
                                                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                                                            {factor.includes('Heart') ? <Heart size={18} /> :
                                                                factor.includes('Brain') || factor.includes('Neuro') || factor.includes('Cognitive') ? <Brain size={18} /> :
                                                                    <Leaf size={18} />}
                                                        </div>
                                                        <span className="font-bold text-slate-400 group-hover:text-white transition-colors">{factor}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedHerb.usage && (
                                            <div className="bg-orange-100 p-10 rounded-[3rem] border border-orange-200">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-orange-900 mb-6 flex items-center gap-2">
                                                    <Zap size={16} /> Culinary Ritual
                                                </h4>
                                                <p className="text-orange-900 text-sm font-bold leading-relaxed italic">
                                                    {selectedHerb.usage}
                                                </p>
                                            </div>
                                        )}

                                        <div className="px-6 py-4 opacity-40">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-relaxed">
                                                Holistic Disclaimer: complementary support, not replacement for professional medical care.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                )
            )}
        </div>
    );
}
