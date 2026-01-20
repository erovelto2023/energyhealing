
"use client";

import { useState } from "react";
import { createHerb, updateHerb } from "@/lib/actions";
import { IHerb } from "@/lib/models/Herb";
import { Save, Loader2, X } from "lucide-react";

import { IProduct } from "@/lib/models/Product";
import { Link as LinkIcon } from "lucide-react";

interface HerbFormProps {
    initialData?: IHerb;
    products?: IProduct[];
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function HerbForm({ initialData, products = [], onSuccess, onCancel }: HerbFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        category: initialData?.category || 'Spices',
        healing: initialData?.healing?.join(', ') || '',
        description: initialData?.description || '',
        physical: initialData?.physical || '',
        emotional: initialData?.emotional || '',
        benefits: initialData?.benefits || '',
        usage: initialData?.usage || '',
        image: initialData?.image || '',
        recommendedProducts: initialData?.recommendedProducts || []
    });

    const categories = ["Spices", "Herbs", "Mushrooms", "Chiles", "Superfood", "Blend", "Extracts", "Tea", "Other"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductToggle = (productId: string, checked: boolean) => {
        setFormData(prev => {
            const current = prev.recommendedProducts || [];
            if (checked) {
                return { ...prev, recommendedProducts: [...current, { productId, note: "Recommended Pairing" }] };
            } else {
                return { ...prev, recommendedProducts: current.filter(p => p.productId !== productId) };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const healingArray = formData.healing.split(',').map(s => s.trim()).filter(Boolean);

            const submitData = {
                ...formData,
                healing: healingArray,
            };

            let result;
            if (initialData) {
                result = await updateHerb(submitData);
            } else {
                result = await createHerb(submitData);
            }

            if (result.success) {
                alert(initialData ? 'Herb updated!' : 'Herb created!');
                if (onSuccess) onSuccess();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save herb.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800">
                    {initialData ? 'Edit Herb' : 'Add New Herb'}
                </h3>
                <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT COLUMN: Basic Info */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Healing Properties (comma separated)</label>
                            <input
                                type="text"
                                name="healing"
                                value={formData.healing}
                                onChange={handleChange}
                                placeholder="Digestive Aid, Anxiety Relief..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Slug (Optional)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="Leave empty to auto-generate"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-slate-500 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Brief Description (The Remedy)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Product Linking Section */}
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 space-y-4">
                        <h4 className="font-bold text-indigo-900 border-b border-indigo-200 pb-2 flex items-center gap-2">
                            <LinkIcon size={16} /> Linked Products
                        </h4>
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
                            {products.length > 0 ? products.map(product => {
                                const productIdStr = product.id.toString();
                                const isSelected = formData.recommendedProducts.some(p => p.productId === productIdStr);
                                return (
                                    <label key={product.id} className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${isSelected ? 'bg-white border-indigo-300 shadow-sm' : 'hover:bg-indigo-100/50 border-transparent'}`}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => handleProductToggle(productIdStr, e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <span className="font-bold text-slate-800 block text-sm">{product.name}</span>
                                            <span className="text-[10px] text-slate-500 block uppercase tracking-wide">{product.category}</span>
                                        </div>
                                    </label>
                                );
                            }) : (
                                <p className="text-sm text-slate-500 italic">No products available to link.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Detailed Info */}
                <div className="space-y-4">
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 space-y-4">
                        <h4 className="font-bold text-orange-900 mb-2">Detailed Properties</h4>

                        <div>
                            <label className="block text-xs font-bold text-orange-800 uppercase mb-1">Benefits (Scientific/Health)</label>
                            <textarea
                                name="benefits"
                                value={formData.benefits}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-orange-800 uppercase mb-1">Physical Restoration</label>
                            <textarea
                                name="physical"
                                value={formData.physical}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-orange-800 uppercase mb-1">Emotional & Energetic</label>
                            <textarea
                                name="emotional"
                                value={formData.emotional}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-orange-800 uppercase mb-1">Usage / Ritual</label>
                            <textarea
                                name="usage"
                                value={formData.usage}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-200"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {initialData ? 'Update Details' : 'Save to Pantry'}
                </button>
            </div>
        </form>
    );
}
