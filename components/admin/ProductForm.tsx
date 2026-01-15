"use client";

import { useState, useTransition } from "react";
import { createProduct, updateProduct } from "@/lib/actions";
import { IProduct } from "@/lib/models/Product";

export default function ProductForm({ initialData }: { initialData?: IProduct }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setMessage("");

        // Helper to split comma-separated strings
        const split = (key: string) => (formData.get(key) as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [];

        const data: any = {
            // Core Info
            name: formData.get("name"),
            slug: formData.get("slug") || undefined,
            logoUrl: formData.get("logoUrl"),
            niche: formData.get("niche"),
            category: formData.get("category"),

            // Directory Type
            type: formData.get("type"),
            resourceType: formData.get("resourceType"),
            author: formData.get("author"),

            shortDescription: formData.get("shortDescription"),
            description: formData.get("description"),

            // Affiliate & Revenue
            affiliateLink: formData.get("affiliateLink"),
            ctaButtonText: formData.get("ctaButtonText"),
            commissionRate: formData.get("commissionRate"),
            affiliateNetwork: formData.get("affiliateNetwork"),

            // Classification & Pricing
            priceModel: formData.get("priceModel"),
            startingPrice: Number(formData.get("startingPrice")) || undefined,
            freeTrialDuration: formData.get("freeTrialDuration"),
            deal: formData.get("deal"),
            skillLevel: formData.get("skillLevel"),

            // Details
            tags: split("tags"),
            featured: formData.get("featured") === "on",
            pros: split("pros"),
            cons: split("cons"),
            features: split("features"),
            supportedPlatforms: split("supportedPlatforms"),
            alternativeTo: formData.get("alternativeTo"),

            // Trust & Media
            videoUrl: formData.get("videoUrl"),
            refundPolicy: formData.get("refundPolicy"),
            supportOptions: split("supportOptions"),

            // SEO
            metaTitle: formData.get("metaTitle"),
            metaDescription: formData.get("metaDescription"),
        };

        if (initialData) {
            data.id = initialData.id;
        }

        startTransition(async () => {
            const result = initialData ? await updateProduct(data) : await createProduct(data);
            if (result.error) {
                setMessage("Error: " + result.error);
            } else {
                setMessage(initialData ? "Product updated!" : "Product created successfully!");
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-4 mb-6">
                {initialData ? `Edit Tool: ${initialData.name}` : "Add New Tool"}
            </h2>

            {/* Core Info */}
            <section className="mb-8">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">Core Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tool Name *</label>
                        <input name="name" defaultValue={initialData?.name} required className="input-field" placeholder="e.g. SEMrush" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Slug (URL) *</label>
                        <input name="slug" defaultValue={initialData?.slug} className="input-field" placeholder="e.g. semrush-review" />
                        <p className="text-xs text-slate-500 mt-1">Leave blank to auto-generate from name.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Logo URL</label>
                        <input name="logoUrl" defaultValue={initialData?.logoUrl} className="input-field" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Niche *</label>
                        <input name="niche" defaultValue={initialData?.niche} required className="input-field" placeholder="e.g. SEO" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Category *</label>
                        <input name="category" defaultValue={initialData?.category} required className="input-field" placeholder="e.g. All-in-One" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Directory Type *</label>
                        <select name="type" defaultValue={initialData?.type || 'tool'} className="input-field">
                            <option value="tool">Tool / Software</option>
                            <option value="resource">Resource / Template</option>
                            <option value="course">Course / Education</option>
                            <option value="service">Service / Agency</option>
                            <option value="platform">Platform / Network</option>
                            <option value="community">Community</option>
                            <option value="deal">Deal / Offer</option>
                            <option value="program">Affiliate Program</option>
                            <option value="media">Media / Content (Blog, Podcast)</option>
                            <option value="event">Event / Conference</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Resource Type (Optional)</label>
                        <input name="resourceType" defaultValue={initialData?.resourceType} className="input-field" placeholder="e.g. eBook, Template, Spreadsheet" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Author / Creator (Optional)</label>
                        <input name="author" defaultValue={initialData?.author} className="input-field" placeholder="e.g. Name or Company" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Short Description</label>
                        <input name="shortDescription" defaultValue={initialData?.shortDescription} className="input-field" placeholder="One-line summary" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Full Description *</label>
                        <textarea name="description" defaultValue={initialData?.description} required rows={4} className="input-field" placeholder="Detailed review/description (Markdown supported)" />
                    </div>
                </div>
            </section>

            {/* Affiliate & Revenue */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs text-green-700">Revenue & Affiliate (Critical)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Affiliate Link *</label>
                        <input name="affiliateLink" defaultValue={initialData?.affiliateLink} className="input-field border-green-200 focus:border-green-500 focus:ring-green-500" placeholder="https://partner.xyz/..." />
                        <p className="text-xs text-slate-500 mt-1">Most important field for revenue.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Button Text</label>
                        <input name="ctaButtonText" defaultValue={initialData?.ctaButtonText || "Visit Website"} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Deal / Special Offer</label>
                        <input name="deal" defaultValue={initialData?.deal} className="input-field" placeholder="e.g. 50% off first month" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Commission Rate (Internal)</label>
                        <input name="commissionRate" defaultValue={initialData?.commissionRate} className="input-field bg-slate-50" placeholder="e.g. 30% recurring" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Affiliate Network (Internal)</label>
                        <input name="affiliateNetwork" defaultValue={initialData?.affiliateNetwork} className="input-field bg-slate-50" placeholder="e.g. Impact, ShareASale" />
                    </div>
                </div>
            </section>

            {/* Classification */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">Classification & Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Price Model *</label>
                        <select name="priceModel" defaultValue={initialData?.priceModel} className="input-field">
                            <option value="Paid">Paid</option>
                            <option value="Freemium">Freemium</option>
                            <option value="Free">Free</option>
                            <option value="One-time">One-time</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Starting Price ($)</label>
                        <input type="number" step="0.01" name="startingPrice" defaultValue={initialData?.startingPrice} className="input-field" placeholder="29.00" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Free Trial Duration</label>
                        <input name="freeTrialDuration" defaultValue={initialData?.freeTrialDuration} className="input-field" placeholder="e.g. 14 Days" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Skill Level</label>
                        <select name="skillLevel" defaultValue={initialData?.skillLevel} className="input-field">
                            <option value="Beginner Friendly">Beginner Friendly</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Technical/Developer">Technical/Developer</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Details & Features */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">The Details</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Tags (comma separated)</label>
                            <input name="tags" defaultValue={initialData?.tags?.join(", ")} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Alternative To (SEO)</label>
                            <input name="alternativeTo" defaultValue={initialData?.alternativeTo} className="input-field" placeholder="e.g. Salesforce" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Pros (comma separated)</label>
                            <textarea name="pros" defaultValue={initialData?.pros?.join(", ")} rows={3} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Cons (comma separated)</label>
                            <textarea name="cons" defaultValue={initialData?.cons?.join(", ")} rows={3} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Key Features (comma separated)</label>
                            <textarea name="features" defaultValue={initialData?.features?.join(", ")} rows={3} className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Supported Platforms (comma separated)</label>
                        <input name="supportedPlatforms" defaultValue={initialData?.supportedPlatforms?.join(", ")} className="input-field" placeholder="Web, iOS, Android, WordPress" />
                    </div>
                </div>
            </section>

            {/* Trust and Media */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">Trust & Conversion</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Video Walkthrough URL</label>
                        <input name="videoUrl" defaultValue={initialData?.videoUrl} className="input-field" placeholder="YouTube URL" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Refund Policy</label>
                        <input name="refundPolicy" defaultValue={initialData?.refundPolicy} className="input-field" placeholder="e.g. 30-Day Money Back" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Support Options (comma separated)</label>
                        <input name="supportOptions" defaultValue={initialData?.supportOptions?.join(", ")} className="input-field" placeholder="24/7 Chat, Email, Phone" />
                    </div>
                    <div className="flex items-center mt-6">
                        <input type="checkbox" name="featured" defaultChecked={initialData?.featured} id="featured" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                        <label htmlFor="featured" className="ml-2 block text-sm text-slate-900">Featured Tool (Show on homepage)</label>
                    </div>
                </div>
            </section>

            {/* SEO Overrides */}
            <section className="mb-8 border-t pt-6 border-slate-100">
                <h3 className="text-md font-semibold text-slate-900 mb-4 uppercase tracking-wide text-xs">SEO Overrides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Meta Title</label>
                        <input name="metaTitle" defaultValue={initialData?.metaTitle} className="input-field" placeholder="Custom page title..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Meta Description</label>
                        <textarea name="metaDescription" defaultValue={initialData?.metaDescription} rows={2} className="input-field" placeholder="Custom meta description..." />
                    </div>
                </div>
            </section>

            <div className="pt-6 border-t border-slate-200">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                >
                    {isPending ? (initialData ? 'Updating...' : 'Saving Tool...') : (initialData ? 'Update Tool' : 'Save New Tool')}
                </button>
            </div>

            {/* Quick styles local to this component for now, or assume utilities exist */}
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
