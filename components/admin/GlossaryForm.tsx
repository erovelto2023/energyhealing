"use client";

import { useState, useTransition } from "react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions";
import { IGlossaryTerm } from "@/lib/models/GlossaryTerm";

export default function GlossaryForm({ initialData }: { initialData?: IGlossaryTerm }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setMessage("");

        const split = (key: string) => (formData.get(key) as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [];

        const recommendedToolIds = split("recommendedToolIds").map(id => Number(id)).filter(n => !isNaN(n));
        const recommendedTools = recommendedToolIds.map(id => ({ productId: id, context: "Recommended for this term" }));

        const data: any = {
            // Core
            term: formData.get("term"),
            slug: formData.get("slug") || undefined,
            shortDefinition: formData.get("shortDefinition"),
            definition: formData.get("definition"), // Full Explanation
            niche: formData.get("niche"),

            // Bridge
            recommendedTools: recommendedTools,

            // SEO
            synonyms: split("synonyms"),
            antonyms: split("antonyms"),
            relatedTermIds: split("relatedTermIds"),

            // Visuals
            imageUrl: formData.get("imageUrl"),
            sponsoredBy: formData.get("sponsoredBy"),
        };

        if (initialData) {
            data.id = initialData.id;
        }

        startTransition(async () => {
            const result = initialData ? await updateGlossaryTerm(data) : await createGlossaryTerm(data);
            if (result.error) {
                setMessage("Error: " + result.error);
            } else {
                setMessage(initialData ? "Term updated successfully!" : "Term created successfully!");
            }
        });
    }

    // Helper to join recommended tool IDs
    const defaultRecommendedTools = initialData?.recommendedTools?.map(t => t.productId).join(", ");

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-4 mb-6">
                {initialData ? `Edit Term: ${initialData.term}` : "Add Glossary Item"}
            </h2>

            {/* Core Definition */}
            <section className="mb-8">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">The Core Definition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Term Name *</label>
                        <input name="term" defaultValue={initialData?.term} required className="input-field" placeholder="e.g. Autoresponder" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Slug (URL)</label>
                        <input name="slug" defaultValue={initialData?.slug} className="input-field" placeholder="e.g. /glossary/autoresponder" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Primary Niche *</label>
                        <input name="niche" defaultValue={initialData?.niche} required className="input-field" placeholder="e.g. Email Marketing" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Short Definition (Card View) *</label>
                        <input name="shortDefinition" defaultValue={initialData?.shortDefinition} required className="input-field" placeholder="1-2 sentence summary..." />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Detailed Explanation (Content) *</label>
                        <textarea name="definition" defaultValue={initialData?.definition} required rows={6} className="input-field" placeholder="Full explanation (300+ words recommended). Markdown supported." />
                    </div>
                </div>
            </section>

            {/* The Bridge */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs text-blue-700">The Bridge (Conversion)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Recommended Tool IDs (comma separated)</label>
                        <input name="recommendedToolIds" defaultValue={defaultRecommendedTools} className="input-field" placeholder="e.g. 101, 102" />
                        <p className="text-xs text-slate-500 mt-1">IDs of tools from the directory to recommend.</p>
                    </div>
                </div>
            </section>

            {/* SEO & Class */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">SEO & Navigation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Synonyms / AKA (comma separated)</label>
                        <input name="synonyms" defaultValue={initialData?.synonyms?.join(", ")} className="input-field" placeholder="e.g. Automated Email, Drip Campaign" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Antonyms (comma separated)</label>
                        <input name="antonyms" defaultValue={initialData?.antonyms?.join(", ")} className="input-field" placeholder="e.g. Broadcast Email" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Related Term IDs (comma separated)</label>
                        <input name="relatedTermIds" defaultValue={initialData?.relatedTermIds?.join(", ")} className="input-field" placeholder="e.g. g1, g5" />
                    </div>
                </div>
            </section>

            {/* Visuals */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">Visuals & Monetization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Diagram / Image URL</label>
                        <input name="imageUrl" defaultValue={initialData?.imageUrl} className="input-field" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Sponsored By (Optional)</label>
                        <input name="sponsoredBy" defaultValue={initialData?.sponsoredBy} className="input-field" placeholder="Vendor Name" />
                    </div>
                </div>
            </section>

            <div className="pt-6 border-t border-slate-200">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isPending ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update Term' : 'Save Glossary Term')}
                </button>
            </div>

            <style jsx>{`
                .input-field {
                    margin-top: 0.25rem;
                    display: block;
                    width: 100%;
                    border-radius: 0.375rem;
                    border: 1px solid #cbd5e1;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    padding: 0.5rem;
                }
                .input-field:focus {
                    border-color: #3b82f6;
                    outline: none;
                    ring: 2px;
                    ring-color: #3b82f6;
                }
            `}</style>

            {message && <p className={`text-sm mt-4 p-3 rounded ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</p>}
        </form>
    );
}
