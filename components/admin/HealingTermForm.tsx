"use client";

import { useState, useTransition } from "react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions";
import { IGlossaryTerm } from "@/lib/models/GlossaryTerm";
import {
    Sparkles, Zap, Text, Activity, Globe, BookOpen, PlayCircle, Save
} from "lucide-react";

export default function HealingTermForm({ initialData, onComplete }: { initialData?: IGlossaryTerm, onComplete?: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setMessage("");

        // Helper to get string or undefined
        const getStr = (key: string) => formData.get(key) as string || undefined;
        // Helper to get array from comma list
        const getArr = (key: string) => {
            const val = formData.get(key) as string;
            return val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
        };

        const data: any = {
            // Core
            term: getStr('term'),
            category: getStr('category') || "Energy Healing",
            subCategory: getStr('subCategory'),
            shortDefinition: getStr('shortDefinition'),
            niche: "Energy Healing", // Keep synced

            // Definition
            definition: getStr('definition'), // Full markdown
            origin: getStr('origin'),
            traditionalMeaning: getStr('traditionalMeaning'),
            modernUsage: getStr('modernUsage'),
            expandedExplanation: getStr('expandedExplanation'),

            // Application
            howItWorks: getStr('howItWorks'),
            benefits: getStr('benefits'),
            commonPractices: getStr('commonPractices'),
            useCases: getStr('useCases'),
            whoUsesIt: getStr('whoUsesIt'),

            // Energy
            energyType: getStr('energyType'),
            consciousnessLevel: getStr('consciousnessLevel'),
            chakraAssociation: getStr('chakraAssociation'),
            elementalAssociation: getStr('elementalAssociation'),
            frequencyLevel: getStr('frequencyLevel'),

            // Learning & Media
            beginnerExplanation: getStr('beginnerExplanation'),
            advancedPerspective: getStr('advancedPerspective'),
            misconceptions: getStr('misconceptions'),
            warningsOrNotes: getStr('warningsOrNotes'),
            guidedPractice: getStr('guidedPractice'),
            affirmations: getStr('affirmations'),
            visualizations: getStr('visualizations'),
            audioOrVideoResources: getStr('audioOrVideoResources'),

            // SEO & Authority
            keywords: getArr('keywords'),
            synonyms: getArr('synonyms'),
            antonyms: getArr('antonyms'),
            searchIntent: getStr('searchIntent'),
            metaTitle: getStr('metaTitle'),
            metaDescription: getStr('metaDescription'),
            contentLevel: getStr('contentLevel'),
            sources: getStr('sources'),
            lineageOrTradition: getStr('lineageOrTradition'),
            scientificPerspective: getStr('scientificPerspective'),
            culturalNotes: getStr('culturalNotes'),

            // Arrays
            relatedTermIds: [],
            recommendedTools: getArr('recommendedToolIds').map(id => ({
                productId: Number(id),
                context: "Recommended for this practice"
            })).filter(t => !isNaN(t.productId)),
        };

        if (initialData) {
            data.id = initialData.id;
            data.slug = initialData.slug;
        }

        startTransition(async () => {
            const result = initialData ? await updateGlossaryTerm(data) : await createGlossaryTerm(data);
            if (result.error) {
                setMessage("Error: " + result.error);
            } else {
                setMessage(initialData ? "Term updated successfully!" : "Term added successfully!");
                if (onComplete) {
                    setTimeout(onComplete, 1500);
                }
            }
        });
    }



    return (
        <form action={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-50 rounded-t-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            {initialData ? `Edit: ${initialData.term}` : "New Healing Term"}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {message && (
                        <span className={`text-sm font-medium ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
                            {message}
                        </span>
                    )}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={18} />}
                        Save Term
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-12">
                {/* Core Info */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                        <Text className="text-indigo-500" size={20} />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">Core Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Term Name *</label>
                            <input name="term" defaultValue={initialData?.term} required className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Akashic Records" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Category (Major)</label>
                            <input name="category" defaultValue={initialData?.category || "Energy Healing"} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Chakra System" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Sub-Category</label>
                            <input name="subCategory" defaultValue={initialData?.subCategory} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Root Chakra" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Short Definition (Preview)</label>
                            <textarea name="shortDefinition" defaultValue={initialData?.shortDefinition} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="A brief, one-sentence plain language explanation." />
                        </div>
                    </div>
                </section>

                {/* Definition */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                        <BookOpen className="text-indigo-500" size={20} />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">Full Definition</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Definition (Markdown Supported)</label>
                            <textarea name="definition" defaultValue={initialData?.definition} rows={12} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Detailed explanation..." />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Origin / Etymology</label>
                                <input name="origin" defaultValue={initialData?.origin} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g. Sanskrit 'Cakra' meaning wheel" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Traditional Meaning</label>
                                <input name="traditionalMeaning" defaultValue={initialData?.traditionalMeaning} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Historical context..." />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Expanded Explanation (Metaphysical)</label>
                                <textarea name="expandedExplanation" defaultValue={initialData?.expandedExplanation} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Deeper dive into the subtle mechanics..." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                        <Zap className="text-indigo-500" size={20} />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">Application</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">How It Works (Mechanism)</label>
                            <textarea name="howItWorks" defaultValue={initialData?.howItWorks} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Energetic principles at play..." />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Key Benefits</label>
                            <textarea name="benefits" defaultValue={initialData?.benefits} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Physical, emotional, or spiritual benefits..." />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Common Practices</label>
                                <textarea name="commonPractices" defaultValue={initialData?.commonPractices} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Meditation, Yoga, Reiki..." />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Real-world Use Cases</label>
                                <textarea name="useCases" defaultValue={initialData?.useCases} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Daily life applications..." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Energy Metadata */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                        <Activity className="text-indigo-500" size={20} />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">Energy Metadata</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Energy Type</label>
                            <input name="energyType" defaultValue={initialData?.energyType} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g. Subtle, Biofield" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Consciousness Level</label>
                            <input name="consciousnessLevel" defaultValue={initialData?.consciousnessLevel} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g. Awakening, Theta State" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Chakra Association</label>
                            <input name="chakraAssociation" defaultValue={initialData?.chakraAssociation} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g. Heart Chakra" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Elemental Association</label>
                            <input name="elementalAssociation" defaultValue={initialData?.elementalAssociation} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g. Fire, Ether" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Frequency Level</label>
                            <input name="frequencyLevel" defaultValue={initialData?.frequencyLevel} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g. 528Hz, High Vibration" />
                        </div>
                    </div>
                </section>

                {/* Learning & Media */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                        <PlayCircle className="text-indigo-500" size={20} />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">Learning & Media</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Beginner Explanation</label>
                            <textarea name="beginnerExplanation" defaultValue={initialData?.beginnerExplanation} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Simple analogy for newcomers..." />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Guided Practice Script</label>
                            <textarea name="guidedPractice" defaultValue={initialData?.guidedPractice} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Close your eyes..." />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Affirmations</label>
                            <textarea name="affirmations" defaultValue={initialData?.affirmations} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="I am..." />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Visualizations</label>
                            <textarea name="visualizations" defaultValue={initialData?.visualizations} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Imagine a light..." />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Misconceptions</label>
                            <textarea name="misconceptions" defaultValue={initialData?.misconceptions} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Warnings / Notes</label>
                            <textarea name="warningsOrNotes" defaultValue={initialData?.warningsOrNotes} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                        </div>
                        <div className="col-span-2 border-t border-slate-100 pt-6 mt-2">
                            <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Sparkles size={16} /> Recommended Products / Tools (IDs)
                            </label>
                            <input
                                name="recommendedToolIds"
                                defaultValue={initialData?.recommendedTools?.map(t => t.productId).join(', ')}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. 101, 102 (Comma separated)"
                            />
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">Link products from the tools directory to this term.</p>
                        </div>
                    </div>
                </section>

                {/* SEO & Sources */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                        <Globe className="text-indigo-500" size={20} />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">SEO & Sources</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Keywords (Comma Separated)</label>
                            <input name="keywords" defaultValue={initialData?.keywords?.join(', ')} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="healing, energy, chakra..." />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Meta Title</label>
                            <input name="metaTitle" defaultValue={initialData?.metaTitle} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Meta Description</label>
                            <input name="metaDescription" defaultValue={initialData?.metaDescription} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Sources</label>
                            <textarea name="sources" defaultValue={initialData?.sources} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Lineage / Tradition</label>
                            <input name="lineageOrTradition" defaultValue={initialData?.lineageOrTradition} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
