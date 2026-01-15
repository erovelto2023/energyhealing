'use client';

import React, { useState } from 'react';
import {
    Book,
    Zap,
    Activity,
    GraduationCap,
    ShieldAlert,
    Search,
    ChevronRight,
    Info,
    ExternalLink,
    Wind,
    Layers,
    Sparkles,
    Volume2,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import RelatedConcepts from './RelatedConcepts';
import { generateGlossarySchema, generateArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema';

interface GlossaryTermLayoutProps {
    term: IGlossaryTerm;
    relatedProducts?: any[];
    relatedTerms?: any[];
}

export default function GlossaryTermLayout({ term, relatedProducts = [], relatedTerms = [] }: GlossaryTermLayoutProps) {
    const [activeTab, setActiveTab] = useState('definition');

    // Helper to turn newline strings into arrays for list items if needed
    const toList = (str?: string) => {
        if (!str) return [];
        return str.split('\n').filter(s => s.trim().length > 0).map(s => s.replace(/^[•-]\s*/, '').trim());
    };

    const Markdown = ({ content, className = "" }: { content?: string, className?: string }) => {
        if (!content) return null;
        return (
            <div
                className={`prose prose-slate max-w-none text-slate-700 leading-relaxed ${className}`}
                dangerouslySetInnerHTML={{
                    __html: typeof window !== 'undefined'
                        ? DOMPurify.sanitize(marked.parse(content) as string)
                        : ''
                }}
            />
        );
    };

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === id
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const glossarySchema = generateGlossarySchema(term, baseUrl);
    const articleSchema = generateArticleSchema(term, baseUrl);
    const faqSchema = generateFAQSchema(term);
    const breadcrumbSchema = generateBreadcrumbSchema(term, baseUrl);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 pb-20">
            {/* Schema.org JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Sticky Navigation / Back Link */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/glossary" className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-semibold text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span>Back to Healing Dictionary</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Glossary</span>
                        <ChevronRight size={12} />
                        <span className="text-indigo-600">{term.term}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Hero Header Section */}
                <div className="mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-[0.2em] border border-indigo-100/50">
                            {term.category || 'Energy Healing'}
                        </span>
                        {term.subCategory && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">
                                {term.subCategory}
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-[0.2em] border border-emerald-100/50">
                            <Info size={12} /> {term.contentLevel || 'Beginner'}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                        {term.term}
                    </h1>

                    {term.shortDefinition && (
                        <div className="max-w-3xl border-l-4 border-indigo-500 pl-8 py-2">
                            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic">
                                "{term.shortDefinition}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Tabbed Content Area */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
                    <div className="flex overflow-x-auto border-b bg-slate-50/50 scrollbar-hide">
                        <TabButton id="definition" label="Definition" icon={Info} />
                        <TabButton id="application" label="Application" icon={Activity} />
                        <TabButton id="energy" label="Energy Profile" icon={Zap} />
                        <TabButton id="learning" label="Learning Lab" icon={GraduationCap} />
                    </div>

                    <div className="p-6 md:p-8 min-h-[400px]">
                        {activeTab === 'definition' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <section>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <Layers size={20} className="text-indigo-500" />
                                        Full Explanation
                                    </h3>
                                    {/* The original template split fullDefinition and detailedDefinition. 
                                        We map 'definition' which is markdown. */}
                                    <Markdown content={term.definition} />

                                    {term.expandedExplanation && (
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 mt-6">
                                            <Markdown content={term.expandedExplanation} className="text-slate-600 italic" />
                                        </div>
                                    )}
                                </section>

                                {(term.origin || term.traditionalMeaning) && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {term.origin && (
                                            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                                                <h4 className="font-bold text-amber-900 mb-2 uppercase text-xs tracking-widest">Origin & Etymology</h4>
                                                <p className="text-amber-800">{term.origin}</p>
                                            </div>
                                        )}
                                        {term.traditionalMeaning && (
                                            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                                <h4 className="font-bold text-indigo-900 mb-2 uppercase text-xs tracking-widest">Traditional Meaning</h4>
                                                <p className="text-indigo-800">{term.traditionalMeaning}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'application' && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                                <section>
                                    <h3 className="text-lg font-bold mb-4">How It Works (Mechanism)</h3>
                                    <Markdown content={term.howItWorks} className="mb-6" />
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="border rounded-2xl p-5">
                                            <h4 className="font-bold mb-3 text-indigo-600">Key Benefits</h4>
                                            <ul className="space-y-2">
                                                {(toList(term.benefits).length > 0 ? toList(term.benefits) : [term.benefits]).filter(Boolean).map((b, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-slate-600">
                                                        <ChevronRight size={14} className="text-indigo-400 mt-1 shrink-0" />
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="border rounded-2xl p-5">
                                            <h4 className="font-bold mb-3 text-indigo-600">Common Practices</h4>
                                            <ul className="space-y-2">
                                                {(toList(term.commonPractices).length > 0 ? toList(term.commonPractices) : [term.commonPractices]).filter(Boolean).map((p, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-slate-600">
                                                        <ChevronRight size={14} className="text-indigo-400 mt-1 shrink-0" />
                                                        <span>{p}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                                {term.useCases && (
                                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700">
                                        <h4 className="font-bold mb-3 text-white">Real-world Use Case</h4>
                                        <p className="text-slate-100 text-sm leading-relaxed">{term.useCases}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'energy' && (
                            <div className="grid sm:grid-cols-2 gap-6 animate-in zoom-in-95 duration-500">
                                {term.energyType && (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Energy Type</span>
                                        <span className="font-semibold text-slate-800 text-right">{term.energyType}</span>
                                    </div>
                                )}
                                {term.consciousnessLevel && (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Consciousness</span>
                                        <span className="font-semibold text-slate-800 text-right">{term.consciousnessLevel}</span>
                                    </div>
                                )}
                                {term.chakraAssociation && (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Chakra</span>
                                        <span className="font-semibold text-slate-800 text-right">{term.chakraAssociation}</span>
                                    </div>
                                )}
                                {term.elementalAssociation && (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Element</span>
                                        <span className="font-semibold text-slate-800 text-right">{term.elementalAssociation}</span>
                                    </div>
                                )}

                                {term.frequencyLevel && (
                                    <div className="sm:col-span-2 mt-4 p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white flex items-center justify-between">
                                        <div>
                                            <h4 className="text-2xl font-bold mb-1">Frequency Signature</h4>
                                            <p className="opacity-80">This term vibrates at a {term.frequencyLevel} level.</p>
                                        </div>
                                        <Sparkles size={48} className="opacity-40" />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'learning' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {term.beginnerExplanation && (
                                    <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                                        <h3 className="text-sky-900 font-bold mb-2">Beginner's Intro</h3>
                                        <Markdown content={term.beginnerExplanation} className="text-sky-800 italic" />
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8">
                                    {term.guidedPractice && (
                                        <section>
                                            <h4 className="font-bold flex items-center gap-2 mb-4">
                                                <Volume2 size={18} className="text-indigo-500" />
                                                Guided Practice Script
                                            </h4>
                                            <div className="bg-slate-50 p-4 rounded-xl border">
                                                <Markdown content={term.guidedPractice} className="text-sm text-slate-600" />
                                            </div>
                                        </section>
                                    )}
                                    {term.affirmations && (
                                        <section>
                                            <h4 className="font-bold mb-4">Daily Affirmations</h4>
                                            <div className="space-y-2">
                                                {toList(term.affirmations).map((a, i) => (
                                                    <div key={i} className="p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 font-medium">
                                                        {a}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {term.warningsOrNotes && (
                                        <section className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                            <h4 className="text-red-900 font-bold flex items-center gap-2 mb-2">
                                                <ShieldAlert size={18} />
                                                Warnings & Notes
                                            </h4>
                                            <p className="text-red-800 text-sm">{term.warningsOrNotes}</p>
                                        </section>
                                    )}
                                    {term.misconceptions && (
                                        <section className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                            <h4 className="text-amber-900 font-bold mb-2">Common Misconceptions</h4>
                                            <p className="text-amber-800 text-sm">{term.misconceptions}</p>
                                        </section>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Tools Section */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Sparkles size={24} className="text-indigo-600" />
                            Recommended Tools for {term.term}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {relatedProducts.map((product) => (
                                <Link
                                    key={product.id || product._id}
                                    href={`/offers/${product.slug}`}
                                    className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:shadow-indigo-50 transition-all flex items-center gap-6"
                                >
                                    <div className="w-20 h-20 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                                        {/* Ideally product.image here, mapped similarly to homepage */}
                                        <Sparkles className="text-indigo-600" size={32} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{product.type || 'Tool'}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.title || product.name}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.description}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <ChevronRight size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Concepts Section */}
                {relatedTerms && relatedTerms.length > 0 && (
                    <div className="mb-12">
                        <RelatedConcepts
                            relatedTerms={relatedTerms}
                            currentTermName={term.term}
                        />
                    </div>
                )}

                {/* Footer / Meta Data */}
                <footer className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
                    <div className="col-span-2">
                        <h5 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Sources & Lineage</h5>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            {term.lineageOrTradition && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-white border rounded-lg">
                                    <span className="font-bold text-slate-900">Lineage:</span> {term.lineageOrTradition}
                                </div>
                            )}
                            {/* Sources might be a newline separated string */}
                            {term.sources && (
                                <div className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                    <ExternalLink size={14} /> {term.sources}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h5 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Metadata Info</h5>
                        <p className="text-xs text-slate-500 mb-2"><strong>Meta Title:</strong> {term.metaTitle || term.term}</p>
                        <p className="text-xs text-slate-500"><strong>Keywords:</strong> {term.keywords?.join(', ')}</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};
