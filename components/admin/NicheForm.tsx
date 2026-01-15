"use client";

import { useState, useTransition } from "react";
import { createNiche, updateNiche } from "@/lib/actions";
import { INiche } from "@/lib/models/Niche";

export default function NicheForm({ initialData }: { initialData?: INiche }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setMessage("");

        const split = (key: string) => (formData.get(key) as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [];
        const recommendedToolIds = split("recommendedToolIds").map(id => Number(id)).filter(n => !isNaN(n));

        const data: any = {
            name: formData.get("name"),
            slug: formData.get("slug") || undefined,
            description: formData.get("description"),
            profitability: formData.get("profitability"),
            competition: formData.get("competition"),
            potentialMonthlyRevenue: formData.get("potentialMonthlyRevenue"),

            monetizationMethods: split("monetizationMethods"),
            keywords: split("keywords"),
            recommendedToolIds: recommendedToolIds
        };

        if (initialData) {
            data.id = initialData.id;
        }

        startTransition(async () => {
            const result = initialData ? await updateNiche(data) : await createNiche(data);
            if (result.error) {
                setMessage("Error: " + result.error);
            } else {
                setMessage(initialData ? "Niche updated!" : "Niche created successfully!");
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-4 mb-6">
                {initialData ? `Edit Niche: ${initialData.name}` : "Add New Niche"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Niche Name *</label>
                    <input name="name" defaultValue={initialData?.name} required className="input-field" placeholder="e.g. Indoor Gardening" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Slug (URL)</label>
                    <input name="slug" defaultValue={initialData?.slug} className="input-field" placeholder="e.g. indoor-gardening" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Profitability</label>
                    <select name="profitability" defaultValue={initialData?.profitability} className="input-field">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Competition</label>
                    <select name="competition" defaultValue={initialData?.competition} className="input-field">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Potential Revenue (Est.)</label>
                    <input name="potentialMonthlyRevenue" defaultValue={initialData?.potentialMonthlyRevenue} className="input-field" placeholder="e.g. $1k - $5k/mo" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Description *</label>
                    <textarea name="description" defaultValue={initialData?.description} required rows={4} className="input-field" placeholder="Why is this a good niche? Stats, trends..." />
                </div>
            </div>

            <div className="border-t pt-6 border-slate-100 mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Strategy & Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Monetization Methods (comma separated)</label>
                        <input name="monetizationMethods" defaultValue={initialData?.monetizationMethods?.join(", ")} className="input-field" placeholder="Amazon Associates, Courses..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Sample Keywords (comma separated)</label>
                        <input name="keywords" defaultValue={initialData?.keywords?.join(", ")} className="input-field" placeholder="best grow lights, how to start..." />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Recommended Tool IDs (comma separated)</label>
                        <input name="recommendedToolIds" defaultValue={initialData?.recommendedToolIds?.join(", ")} className="input-field" placeholder="e.g. 101, 102" />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isPending ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update Niche' : 'Save Niche')}
            </button>

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
