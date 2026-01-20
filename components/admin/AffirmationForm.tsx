import React, { useState } from 'react';
import { IAffirmation } from '@/lib/models/Affirmation';
import { createAffirmation, updateAffirmation } from '@/lib/actions';
import { IHerb } from '@/lib/models/Herb';
import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';
import { IProduct } from '@/lib/models/Product';
import { Save, X, Plus, Trash } from 'lucide-react';

interface AffirmationFormProps {
    initialData?: IAffirmation;
    onCancel: () => void;
    onSuccess: () => void;
    herbs: IHerb[];
    products: IProduct[];
    glossaryTerms: IGlossaryTerm[];
}

export default function AffirmationForm({ initialData, onCancel, onSuccess, herbs, products, glossaryTerms }: AffirmationFormProps) {
    const [formData, setFormData] = useState<Partial<IAffirmation>>(initialData || {
        title: '',
        affirmation: '',
        intention: '',
        category: 'Nervous System Regulation', // Default
        whenToUse: [],
        whyItWorks: '',
        userPrompt: '',
        pairing: {
            herbs: [],
            rituals: [],
            breathwork: '',
            moonPhase: ''
        },
        primaryHerb: '',
        linkedGlossaryTerms: [],
        recommendedProductIds: []
    });

    const [loading, setLoading] = useState(false);

    // Helpers for comma-separated arrays
    const handleArrayChange = (field: keyof IAffirmation, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()).filter(Boolean) }));
    };

    const handlePairingArrayChange = (field: 'herbs' | 'rituals', value: string) => {
        setFormData(prev => ({
            ...prev,
            pairing: {
                ...prev.pairing!,
                [field]: value.split(',').map(s => s.trim()).filter(Boolean)
            }
        }));
    };

    const handlePairingChange = (field: 'breathwork' | 'moonPhase', value: string) => {
        setFormData(prev => ({
            ...prev,
            pairing: {
                ...prev.pairing!,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = initialData
                ? await updateAffirmation({ ...formData, id: initialData.id })
                : await createAffirmation(formData);

            if (result.success) {
                onSuccess();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {initialData ? 'Edit Affirmation' : 'New Affirmation'}
                </h3>
                <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="e.g. Rooted Calm"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">The Affirmation</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full p-4 bg-purple-50 rounded-xl font-serif text-xl text-purple-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-purple-300"
                            placeholder="I am..."
                            value={formData.affirmation}
                            onChange={e => setFormData({ ...formData, affirmation: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Intention</label>
                        <textarea
                            required
                            rows={2}
                            className="w-full p-4 bg-slate-50 rounded-xl text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="Supports nervous system..."
                            value={formData.intention}
                            onChange={e => setFormData({ ...formData, intention: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                        <select
                            className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Nervous System Regulation</option>
                            <option>Self-Worth & Belonging</option>
                            <option>Boundaries & Sovereignty</option>
                            <option>Abundance & Trust</option>
                            <option>Healing & Resilience</option>
                            <option>Creativity & Expression</option>
                            <option>Grief & Release</option>
                            <option>Purpose & Alignment</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">When To Use (Comma Separated)</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-slate-50 rounded-xl text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Morning, Anxiety, Sleep..."
                            value={formData.whenToUse?.join(', ')}
                            onChange={e => handleArrayChange('whenToUse', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Why It Works (Science/Energetics)</label>
                        <textarea
                            rows={3}
                            className="w-full p-4 bg-slate-50 rounded-xl text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Neuroplasticity..."
                            value={formData.whyItWorks}
                            onChange={e => setFormData({ ...formData, whyItWorks: e.target.value })}
                        />
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <label className="block text-xs font-black uppercase tracking-widest text-purple-600 mb-4 flex items-center gap-2">
                            Ritual Pairing
                        </label>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400">Primary Herb Link</label>
                                <select
                                    className="w-full p-3 bg-white rounded-lg border border-slate-200 mt-1"
                                    value={formData.primaryHerb}
                                    onChange={e => setFormData({ ...formData, primaryHerb: e.target.value })}
                                >
                                    <option value="">-- Select Herb --</option>
                                    {herbs.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400">Breathwork</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-white rounded-lg border border-slate-200 mt-1"
                                        placeholder="4-7-8 Breathing"
                                        value={formData.pairing?.breathwork}
                                        onChange={e => handlePairingChange('breathwork', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400">Moon Phase</label>
                                    <select
                                        className="w-full p-3 bg-white rounded-lg border border-slate-200 mt-1"
                                        value={formData.pairing?.moonPhase}
                                        onChange={e => handlePairingChange('moonPhase', e.target.value)}
                                    >
                                        <option value="">Any</option>
                                        <option value="New Moon">New Moon</option>
                                        <option value="Waxing">Waxing</option>
                                        <option value="Full Moon">Full Moon</option>
                                        <option value="Waning">Waning</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400">Ritual Actions (Comma Separated)</label>
                                <textarea
                                    className="w-full p-3 bg-white rounded-lg border border-slate-200 mt-1"
                                    placeholder="Light a candle, hold a stone..."
                                    rows={2}
                                    value={formData.pairing?.rituals?.join(', ')}
                                    onChange={e => handlePairingArrayChange('rituals', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">User Prompt Question</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-slate-50 rounded-xl text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Where do you feel this in your body?"
                            value={formData.userPrompt}
                            onChange={e => setFormData({ ...formData, userPrompt: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : <><Save size={18} /> Save Affirmation</>}
                </button>
            </div>
        </form>
    );
}
