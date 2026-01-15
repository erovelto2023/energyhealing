"use client";

import { useState, useTransition } from "react";
import { importMarketingWords as importHypnoticWords } from "@/lib/actions";
import { Sparkles, Loader2, CheckCircle, AlertCircle, Save, Database, Upload, X } from "lucide-react";

export default function HypnoticWordsImporter() {
    const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });

    // Single Entry State (Deep Dive)
    const [formData, setFormData] = useState({
        phrase: '',
        category: '',
        why: '',
        example: ''
    });

    // Bulk State
    const [bulkText, setBulkText] = useState('');

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.phrase) return;

        setStatus({ type: 'idle' });
        startTransition(async () => {
            // Format for the server action: phrase#why#example#category
            const delimitedString = `${formData.phrase}#${formData.why}#${formData.example}#${formData.category}`;
            const result = await importHypnoticWords(delimitedString);

            if (result.success) {
                setStatus({ type: 'success', message: `Successfully added "${formData.phrase}" to the deep-dive library!` });
                setFormData({ phrase: '', category: '', why: '', example: '' });
            } else {
                setStatus({ type: 'error', message: result.error || "Failed to add word." });
            }
        });
    };

    const handleBulkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bulkText.trim()) return;

        setStatus({ type: 'idle' });
        startTransition(async () => {
            const result = await importHypnoticWords(bulkText);
            if (result.success) {
                setStatus({ type: 'success', message: `Successfully imported ${result.count} phrases into the library!` });
                setBulkText("");
            } else {
                setStatus({ type: 'error', message: result.error || "Failed to import words." });
            }
        });
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden max-w-2xl mx-auto border-t-4 border-t-indigo-600">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <Database className="text-indigo-600" size={24} />
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Admin Backend</h2>
                </div>
            </div>

            <div className="p-8">
                {/* Tabs */}
                <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-2xl shadow-inner">
                    <button
                        onClick={() => setActiveTab('single')}
                        className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'single' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Add Deep Dive (Card)
                    </button>
                    <button
                        onClick={() => setActiveTab('bulk')}
                        className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'bulk' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Bulk Import (List)
                    </button>
                </div>

                {activeTab === 'single' && (
                    <form onSubmit={handleSingleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Phrase *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., A golden opportunity"
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-lg transition-all"
                                value={formData.phrase}
                                onChange={e => setFormData({ ...formData, phrase: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Category</label>
                            <input
                                type="text"
                                placeholder="e.g., Urgency, Trust"
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold transition-all"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Why it works (Psychology)</label>
                            <textarea
                                rows={3}
                                placeholder="Explain the hypnotic effect..."
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium leading-relaxed transition-all"
                                value={formData.why}
                                onChange={e => setFormData({ ...formData, why: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Example Usage</label>
                            <textarea
                                rows={2}
                                placeholder="Show it in a sentence..."
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium italic transition-all"
                                value={formData.example}
                                onChange={e => setFormData({ ...formData, example: e.target.value })}
                            />
                        </div>

                        <button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            {isPending ? 'Saving...' : 'Save to Library'}
                        </button>
                    </form>
                )}

                {activeTab === 'bulk' && (
                    <form onSubmit={handleBulkSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Paste List (One per line)</label>
                            <div className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">These will be added to the searchable index for quick reference.</div>
                            <textarea
                                rows={12}
                                required
                                placeholder={"Line 1\nLine 2\nLine 3"}
                                className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-mono text-sm resize-none transition-all shadow-inner"
                                value={bulkText}
                                onChange={(e) => setBulkText(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                            {isPending ? 'Importing...' : 'Import List'}
                        </button>
                    </form>
                )}

                {/* Status Messages */}
                {status.type !== 'idle' && (
                    <div className={`mt-8 flex items-center gap-3 p-6 rounded-[1.5rem] animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <span className="font-bold">{status.message}</span>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 p-8 border-t border-slate-100">
                <div className="flex gap-4 items-start">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <Sparkles className="text-amber-500" size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900 mb-1 uppercase tracking-tight">Pro Tip: Strategic Seeds</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Use the Deep Dive form for your highest-converting phrases. They will be displayed as detailed cards with psychological analysis on the live site.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
