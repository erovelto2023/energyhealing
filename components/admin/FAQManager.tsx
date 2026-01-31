"use client";
import { useState, useTransition } from 'react';
import { IFAQ } from '@/lib/models/FAQ';
import { Plus, Edit, Trash2, Search, ArrowLeft, Download, ExternalLink, RefreshCw, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { createFAQ, updateFAQ, deleteFAQ, deleteFAQs, importFAQs, deduplicateFAQs } from '@/lib/actions';
import FAQPromptBuilder from './FAQPromptBuilder';

interface FAQManagerProps {
    faqs: IFAQ[];
    offers?: any[];
}

export default function FAQManager({ faqs = [], offers = [] }: FAQManagerProps) {
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'import' | 'prompt'>('list');
    const [editingFAQ, setEditingFAQ] = useState<IFAQ | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [importText, setImportText] = useState('');
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    // Filter FAQs
    const filteredFAQs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.parentQuestion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
    const paginatedFAQs = filteredFAQs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        startTransition(async () => {
            const res = await deleteFAQ(id);
            if (res.success) {
                alert('Deleted successfully');
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    const handleImport = async () => {
        if (!importText) return;
        startTransition(async () => {
            const res = await importFAQs(importText);
            if (res.success) {
                alert(`Imported ${res.count} FAQs`);
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    const handleDeduplicate = async () => {
        if (!confirm('This will keep the oldest version of any duplicate questions and delete the rest. Continue?')) return;
        startTransition(async () => {
            const res = await deduplicateFAQs();
            if (res.success) {
                alert(`Removed ${res.count} duplicate FAQs.`);
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Questions / FAQs</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setEditingFAQ(undefined); setView('create'); }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                            >
                                <Plus size={16} /> Add New
                            </button>
                            <button
                                onClick={handleDeduplicate}
                                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-orange-200 hover:bg-orange-50"
                                title="Remove Duplicate Questions"
                            >
                                <Trash2 size={16} /> Cleanup
                            </button>
                            <button
                                onClick={() => setView('prompt')}
                                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-purple-200 hover:bg-purple-50"
                            >
                                <Sparkles size={16} /> AI Builder
                            </button>
                            <button
                                onClick={() => setView('import')}
                                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-slate-200"
                            >
                                <Download size={16} /> Import JSON
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Question</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {paginatedFAQs.map(faq => (
                                    <tr key={faq._id as unknown as string}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{faq.question}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{faq.answerSnippet}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{faq.parentQuestion || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 text-xs font-mono bg-slate-50 p-1 rounded">/{faq.slug}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <Link
                                                href={`/questions/${faq.slug}`}
                                                target="_blank"
                                                className="text-slate-500 hover:text-slate-800 mr-4"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                onClick={() => { setEditingFAQ(faq); setView('edit'); }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq._id as unknown as string)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedFAQs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No FAQs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <FAQForm
                    initialData={editingFAQ}
                    onCancel={() => setView('list')}
                    offers={offers}
                />
            )}

            {view === 'import' && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold">Import FAQs from JSON</h2>
                    </div>
                    <div className="mb-4 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                        <p className="font-bold mb-2">Instructions:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Paste a JSON array of FAQ objects.</li>
                            <li>Required fields: <code>question</code></li>
                            <li>Recommended: <code>h1Title</code>, <code>answerSnippet</code>, <code>deepDive</code> (object with problem, methodology, application)</li>
                        </ul>
                    </div>
                    <textarea
                        className="w-full h-96 p-4 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder='[{"question": "...", "answerSnippet": "..."}]'
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleImport}
                            disabled={isPending || !importText}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPending ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                            Import FAQs
                        </button>
                    </div>
                </div>
            )}

            {view === 'prompt' && (
                <FAQPromptBuilder onBack={() => setView('list')} />
            )}
        </div>
    );
}

function FAQForm({ initialData, onCancel, offers = [] }: { initialData?: IFAQ, onCancel: () => void, offers?: any[] }) {
    const [isPending, startTransition] = useTransition();

    // Simple state management for form fields
    // In a real app, use react-hook-form

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());

        // Construct deepDive object manually since FormData flattens it
        data.deepDive = {
            problem: data['deepDive.problem'],
            methodology: data['deepDive.methodology'],
            application: data['deepDive.application']
        };

        // Cleanup flat keys
        delete data['deepDive.problem'];
        delete data['deepDive.methodology'];
        delete data['deepDive.application'];

        if (initialData) {
            data._id = initialData._id;
        }

        startTransition(async () => {
            const res = initialData ? await updateFAQ(data) : await createFAQ(data);
            if (res.success) {
                alert('Saved successfully!');
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold">{initialData ? 'Edit FAQ' : 'Create New FAQ'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                        <input name="question" defaultValue={initialData?.question} required className="w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Parent Question (Optional)</label>
                        <input name="parentQuestion" defaultValue={initialData?.parentQuestion} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Slug (Leave empty to auto-generate)</label>
                        <input name="slug" defaultValue={initialData?.slug} className="w-full p-2 border rounded-lg" placeholder="auto-generated-from-question" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">H1 Title (SEO Optimized)</label>
                        <input name="h1Title" defaultValue={initialData?.h1Title} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quick Answer Snippet (40-60 words)</label>
                        <textarea name="answerSnippet" defaultValue={initialData?.answerSnippet} rows={3} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Related Offer (Optional)</label>
                        <select name="relatedOfferId" defaultValue={initialData?.relatedOfferId || ''} className="w-full p-2 border rounded-lg bg-white">
                            <option value="">-- No Offer Linked --</option>
                            {offers.map((offer: any) => (
                                <option key={offer._id || offer.id} value={offer._id || offer.id}>
                                    {offer.title}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Select an offer to display a CTA on this Question's page.</p>
                    </div>

                    <div className="col-span-2 border-t pt-4 mt-2">
                        <h3 className="font-bold text-lg mb-4">Deep Dive Content</h3>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">The Problem (Pain Point)</label>
                        <textarea name="deepDive.problem" defaultValue={initialData?.deepDive?.problem} rows={3} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">The Science / Methodology</label>
                        <textarea name="deepDive.methodology" defaultValue={initialData?.deepDive?.methodology} rows={4} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Practical Application</label>
                        <textarea name="deepDive.application" defaultValue={initialData?.deepDive?.application} rows={4} className="w-full p-2 border rounded-lg" />
                    </div>

                    {/* Source / Reference Fields */}
                    <div className="col-span-2 border-t pt-4 mt-2">
                        <h3 className="font-bold text-lg mb-4">Reference Source</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Link Title</label>
                        <input name="linkTitle" defaultValue={initialData?.linkTitle} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Link URL</label>
                        <input name="linkUrl" defaultValue={initialData?.linkUrl} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Original Source Text</label>
                        <textarea name="sourceText" defaultValue={initialData?.sourceText} rows={2} className="w-full p-2 border rounded-lg text-slate-500 text-xs" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button type="button" onClick={onCancel} className="px-6 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={isPending} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">
                        {isPending ? 'Saving...' : 'Save FAQ'}
                    </button>
                </div>
            </form>
        </div>
    );
}
