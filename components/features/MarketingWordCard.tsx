"use client";

import React, { useState } from 'react';
import { Copy, Check, Lightbulb, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';
import Link from 'next/link';

export default function MarketingWordCard({ term }: { term: IGlossaryTerm }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(term.term);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper to extract content from markdown definition
    const extractSection = (content: string, heading: string) => {
        if (!content) return "";
        const parts = content.split(`### ${heading}`);
        if (parts.length < 2) return "";
        return parts[1].split('###')[0].trim();
    };

    const psychology = extractSection(term.definition, "Why it Works (Psychology)");
    const example = extractSection(term.definition, "Example Usage").replace(/^\* /, "");
    const category = term.synonyms?.[0] || term.niche;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 relative group flex flex-col h-full">
            {/* Header: Category & Copy */}
            <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.15em] rounded-full">
                    {category}
                </span>
                <button
                    onClick={handleCopy}
                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Copy Phrase"
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
            </div>

            {/* Main Phrase */}
            <Link href={`/glossary/${term.slug || term.id}`} className="block group/title">
                <h3 className="text-3xl font-black text-slate-800 mb-8 leading-tight group-hover/title:text-indigo-600 transition-colors">
                    "{term.term}"
                </h3>
            </Link>

            {/* Why it Works */}
            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-500">
                    <Lightbulb size={18} />
                    <span>Why it works</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[15px]">
                    {psychology || term.shortDefinition}
                </p>
            </div>

            {/* In Action */}
            <div className="mt-auto pt-6">
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 mb-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 mb-3">
                        <Zap size={16} />
                        <span>In Action</span>
                    </div>
                    <p className="text-slate-700 font-medium italic leading-relaxed">
                        {example || `Example: "With our new system, ${term.term} results are finally possible."`}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <Link
                        href={`/glossary/${term.slug || term.id}`}
                        className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center gap-2 group"
                    >
                        Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {(term.recommendedTools?.length || 0) > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">
                            <Sparkles size={10} />
                            {(term.recommendedTools?.length || 0)} Tools
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
