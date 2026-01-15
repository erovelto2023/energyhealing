'use client';

import React from 'react';
import Link from 'next/link';
import { Network, ArrowRight } from 'lucide-react';

interface RelatedTerm {
    id: string;
    term: string;
    slug: string;
    category?: string;
    shortDefinition?: string;
}

interface RelatedConceptsProps {
    relatedTerms: RelatedTerm[];
    currentTermName: string;
}

export default function RelatedConcepts({ relatedTerms, currentTermName }: RelatedConceptsProps) {
    if (!relatedTerms || relatedTerms.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-[3rem] border border-indigo-100">
            <div className="px-8 md:px-12">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Network size={24} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Related Concepts</h3>
                        <p className="text-sm text-slate-500">
                            Explore connected healing principles
                        </p>
                    </div>
                </div>

                {/* Visual Connection Hint */}
                <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-100">
                    <p className="text-sm text-slate-600 text-center">
                        <span className="font-bold text-indigo-600">{currentTermName}</span> is connected to these concepts in the healing ecosystem
                    </p>
                </div>

                {/* Related Terms Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedTerms.map((term) => (
                        <Link
                            key={term.id}
                            href={`/glossary/${term.slug || term.id}`}
                            className="group relative bg-white rounded-2xl border-2 border-slate-100 p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Connection Line Visual */}
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Category Badge */}
                            {term.category && (
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 border border-indigo-100">
                                    {term.category}
                                </span>
                            )}

                            {/* Term Name */}
                            <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                                {term.term}
                                <ArrowRight
                                    size={18}
                                    className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                                />
                            </h4>

                            {/* Short Definition */}
                            {term.shortDefinition && (
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                    {term.shortDefinition}
                                </p>
                            )}

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/0 via-purple-100/0 to-indigo-100/0 group-hover:from-indigo-100/20 group-hover:via-purple-100/10 group-hover:to-indigo-100/20 rounded-2xl transition-all pointer-events-none" />
                        </Link>
                    ))}
                </div>

                {/* Network Visualization Teaser */}
                <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-indigo-200 text-center">
                    <p className="text-sm text-slate-600 mb-3">
                        💡 <span className="font-bold">Pro Tip:</span> Understanding how these concepts connect deepens your healing practice
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 font-medium">
                        <Network size={14} />
                        <span>Each term builds on the others to create a complete understanding</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
