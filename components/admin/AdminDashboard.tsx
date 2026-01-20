"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, MessageSquare, BookOpen, Info,
    Compass, Edit, Trash2, Plus, ArrowLeft, Lightbulb, FileText, Copy, Check, PenTool, ShoppingBag, LayoutGrid, Eye, ArrowUpDown, Tag, Sparkles, Search, Download, AlertTriangle, Wrench, Leaf
} from 'lucide-react';
import AdminReviewList from '@/components/features/AdminReviewList';
import ProductForm from './ProductForm';
import GlossaryImporter from './GlossaryImporter';
import GlossaryForm from './GlossaryForm';
import HerbForm from './HerbForm';

import {
    createProduct, updateProduct, deleteProduct,
    createGlossaryTerm, updateGlossaryTerm, deleteGlossaryTerm, deleteGlossaryTerms,
    findDuplicateGlossaryTerms
} from "@/lib/actions";
import { deleteHerb, importHerbs, runBulkSeed, deleteHerbs, deleteAffirmation, deleteAffirmations, importAffirmations } from '@/lib/actions';
import { IProduct } from '@/lib/models/Product';
import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';
import { INiche } from '@/lib/models/Niche';
import { ISubscriber } from '@/lib/models/Subscriber';
import { IHerb } from '@/lib/models/Herb';
import { IAffirmation } from '@/lib/models/Affirmation';
import AffirmationForm from './AffirmationForm';
import AffirmationPromptBuilder from './AffirmationPromptBuilder';


interface AdminDashboardProps {
    reviews: any[];
    products: IProduct[];
    glossaryTerms: IGlossaryTerm[];
    niches?: INiche[];
    subscribers?: ISubscriber[];
    salesPages?: any[];
    herbs?: IHerb[];
    affirmations?: IAffirmation[];
}

export default function AdminDashboard({ reviews = [], products = [], glossaryTerms = [], niches = [], subscribers = [], salesPages = [], herbs = [], affirmations = [] }: AdminDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'reviews' | 'tools' | 'glossary' | 'niches' | 'subscribers' | 'writing' | 'offers' | 'pantry' | 'affirmations'>('reviews');

    // Healing Pantry State
    const [pantryView, setPantryView] = useState<'list' | 'create' | 'edit' | 'import'>('list');
    const [editingHerb, setEditingHerb] = useState<IHerb | undefined>(undefined);
    const [pantrySearch, setPantrySearch] = useState('');
    const [pantryPage, setPantryPage] = useState(1);
    const pantryPerPage = 50;
    const [pantryImportText, setPantryImportText] = useState('');
    const [pantrySelected, setPantrySelected] = useState<Set<string>>(new Set());

    // Affirmations State
    const [affirmationView, setAffirmationView] = useState<'list' | 'create' | 'edit' | 'import' | 'prompt-builder'>('list');
    const [editingAffirmation, setEditingAffirmation] = useState<IAffirmation | undefined>(undefined);
    const [affirmationPage, setAffirmationPage] = useState(1);
    const [affirmationSearch, setAffirmationSearch] = useState('');
    const [affirmationAlphaFilter, setAffirmationAlphaFilter] = useState('All');
    const affirmationPerPage = 20;
    const [affirmationImportText, setAffirmationImportText] = useState('');


    // Sales Pages State
    const [salesPageView, setSalesPageView] = useState<'list' | 'create' | 'edit'>('list');
    const [editingSalesPage, setEditingSalesPage] = useState<any | undefined>(undefined);
    const [salesPagePagination, setSalesPagePagination] = useState(1);
    const [customPageSlug, setCustomPageSlug] = useState('');
    const [customPageCode, setCustomPageCode] = useState('');
    const [isGeneratingPage, setIsGeneratingPage] = useState(false);
    const [salesPageSortField, setSalesPageSortField] = useState<string>('createdAt');
    const [salesPageSortDir, setSalesPageSortDir] = useState<'asc' | 'desc'>('desc');
    const salesPagePerPage = 10;

    // Tools State
    const [toolView, setToolView] = useState<'list' | 'create' | 'edit'>('list');
    const [editingProduct, setEditingProduct] = useState<IProduct | undefined>(undefined);

    // Glossary State

    const [selectedTerms, setSelectedTerms] = useState<Set<string>>(new Set());
    const [duplicates, setDuplicates] = useState<any[]>([]);

    // Niche State
    const [nicheView, setNicheView] = useState<'list' | 'create' | 'edit'>('list');
    const [editingNiche, setEditingNiche] = useState<INiche | undefined>(undefined);
    const [nichePage, setNichePage] = useState(1);
    const nichePerPage = 15;

    // Writing State
    const [writingView, setWritingView] = useState<'list' | 'create' | 'edit' | 'import' | 'duplicates'>('list');
    const [editingWritingTerm, setEditingWritingTerm] = useState<IGlossaryTerm | undefined>(undefined);
    const [writingPage, setWritingPage] = useState(1);
    const writingPerPage = 15;
    const [writingSearch, setWritingSearch] = useState('');

    // Tools Pagination
    const [toolPage, setToolPage] = useState(1);
    const toolPerPage = 20;

    // Subscribers Pagination
    const [subscriberPage, setSubscriberPage] = useState(1);
    const subscriberPerPage = 20;

    const [isDeleting, startDeleteTransition] = useTransition();

    const handleDeleteProduct = (id: number) => {
        if (!confirm("Are you sure you want to delete this tool?")) return;
        startDeleteTransition(async () => {
            const result = await deleteProduct(id);
            if (result.success) {
                alert('✅ Tool deleted successfully!');
                window.location.reload();
            } else if (result.error) {
                alert('❌ Error: ' + result.error);
            }
        });
    };

    // const handleDeleteSalesPage = (id: string) => {
    //     if (!confirm("Are you sure you want to delete this sales page?")) return;
    //     startDeleteTransition(async () => {
    //         const result = await deleteSalesPage(id);
    //         if (result.success) {
    //             alert('✅ Sales page deleted!');
    //             window.location.reload();
    //         } else if (result.error) {
    //             alert('❌ Error: ' + result.error);
    //         }
    //     });
    // };

    const handleDeleteTerm = (id: string) => {
        if (!confirm("Are you sure you want to delete this term?")) return;
        startDeleteTransition(async () => {
            const result = await deleteGlossaryTerm(id);
            if (result.success) {
                alert('✅ Term deleted successfully!');
                window.location.reload();
            } else if (result.error) {
                alert('❌ Error: ' + result.error);
            }
        });
    };

    // const handleDeleteNiche = (id: string) => {
    //     if (!confirm("Are you sure you want to delete this niche?")) return;
    //     startDeleteTransition(async () => {
    //         const result = await deleteNiche(id);
    //         if (result.success) {
    //             alert('✅ Niche deleted successfully!');
    //             window.location.reload();
    //         } else if (result.error) {
    //             alert('❌ Error: ' + result.error);
    //         }
    //     });
    // };

    const handleBulkDeleteTerms = () => {
        if (selectedTerms.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedTerms.size} terms?`)) return;

        startDeleteTransition(async () => {
            const result = await deleteGlossaryTerms(Array.from(selectedTerms));
            if (result.success) {
                alert(`✅ ${selectedTerms.size} terms deleted successfully!`);
                setSelectedTerms(new Set());
                window.location.reload();
            } else {
                alert('❌ Error: ' + result.error);
            }
        });
    };

    const handleDeleteHerb = (id: string) => {
        if (!confirm("Are you sure you want to delete this herb?")) return;
        startDeleteTransition(async () => {
            const result = await deleteHerb(id);
            if (result.success) {
                alert('✅ Herb deleted!');
                window.location.reload();
            } else {
                alert('❌ Error: ' + result.error);
            }
        });
    };

    const handleImportHerbs = async () => {
        if (!pantryImportText) return;
        const result = await importHerbs(pantryImportText);
        if (result.success) {
            alert(`✅ Successfully imported ${result.count} herbs!`);
            setPantryImportText('');
            setPantryView('list');
            window.location.reload();
        } else {
            alert('❌ Import Failed: ' + result.error);
        }
    }

    const handleFindHerbDuplicates = () => {
        const nameMap = new Map<string, IHerb[]>();
        herbs.forEach(h => {
            const norm = h.name.toLowerCase().trim();
            if (!nameMap.has(norm)) nameMap.set(norm, []);
            nameMap.get(norm)?.push(h);
        });

        const dupes = new Set<string>();
        let count = 0;

        nameMap.forEach((group) => {
            if (group.length > 1) {
                // Keep the one with the most content (longest description)
                group.sort((a, b) => (b.description?.length || 0) - (a.description?.length || 0));

                // Mark all but the first (best) one for deletion
                for (let i = 1; i < group.length; i++) {
                    dupes.add(group[i].id);
                    count++;
                }
            }
        });

        if (count > 0) {
            setPantrySelected(dupes);
            alert(`Found ${count} duplicates! They have been selected. Review and click Delete.`);
        } else {
            alert("No duplicates found checking by name.");
        }
    };

    const handleBulkDeleteHerbs = () => {
        if (pantrySelected.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${pantrySelected.size} herbs?`)) return;

        startDeleteTransition(async () => {
            const result = await deleteHerbs(Array.from(pantrySelected));
            if (result.success) {
                alert(`✅ ${result.count || pantrySelected.size} herbs deleted successfully!`);
                setPantrySelected(new Set());
                window.location.reload();
            } else {
                alert('❌ Error: ' + result.error);
            }
        });
    };

    const handleBulkSeed = async () => {
        if (!confirm("This will add hundreds of herbs to the database. Continue?")) return;
        const result = await runBulkSeed();
        if (result.success) {
            alert(`✅ Seeded ${result.count} new herbs.`);
            window.location.reload();
        } else {
            alert('❌ Seed failed.');
        }
    }

    const handleFindDuplicates = async (niche?: string) => {
        const result = await findDuplicateGlossaryTerms(niche);
        if (Array.isArray(result)) {
            setDuplicates(result);
            setWritingView('duplicates');
        } else {
            alert('No duplicates found or error occurred.');
        }
    };

    const handleDeleteAffirmation = (id: string) => {
        if (!confirm("Are you sure you want to delete this affirmation?")) return;
        startDeleteTransition(async () => {
            const result = await deleteAffirmation(id);
            if (result.success) {
                alert('✅ Affirmation deleted!');
                window.location.reload();
            } else {
                alert('❌ Error: ' + result.error);
            }
        });
    };

    const handleImportAffirmations = async () => {
        if (!affirmationImportText) return;
        const result = await importAffirmations(affirmationImportText);
        if (result.success) {
            alert(`✅ Successfully imported ${result.count} affirmations!`);
            setAffirmationImportText('');
            setAffirmationView('list');
            window.location.reload();
        } else {
            alert('❌ Import Failed: ' + result.error);
        }
    };

    const handleExportGlossaryUrls = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Term,URL\n"
            + glossaryTerms.map(t => {
                const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.kathleenheals.com'}/glossary/${t.slug || t.id}`;
                return `"${t.term.replace(/"/g, '""')}","${url}"`;
            }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "glossary_urls.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportProductUrls = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Name,URL\n"
            + products.map(p => {
                const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.kathleenheals.com'}/tool/${p.slug || p.id}`;
                return `${p.id},"${p.name.replace(/"/g, '""')}","${url}"`;
            }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "product_urls.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportOfferUrls = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Title,URL,Status\n"
            + salesPages.map(p => {
                const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.kathleenheals.com'}/offers/${p.slug}`;
                return `"${p.title?.replace(/"/g, '""') || 'Untitled'}","${url}","${p.isPublished ? 'Published' : 'Draft'}"`;
            }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "offer_urls.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleTermSelection = (id: string) => {
        const newSelection = new Set(selectedTerms);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedTerms(newSelection);
    };

    const toggleAllOnPage = (ids: string[]) => {
        const newSelection = new Set(selectedTerms);
        const allSelected = ids.every(id => newSelection.has(id));

        if (allSelected) {
            ids.forEach(id => newSelection.delete(id));
        } else {
            ids.forEach(id => newSelection.add(id));
        }
        setSelectedTerms(newSelection);
    };

    return (
        <div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'reviews'
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                >
                    Pending Reviews
                </button>
                <button
                    onClick={() => setActiveTab('writing')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'writing'
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                >
                    <span className="flex items-center gap-2"><Sparkles size={16} className="text-amber-300" /> Glossary & Terms</span>
                </button>
                <button
                    onClick={() => setActiveTab('tools')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'tools'
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                >
                    Products / Tools
                </button>
                <button
                    onClick={() => setActiveTab('subscribers')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'subscribers'
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                >
                    Subscribers
                </button>
                <button
                    onClick={() => setActiveTab('offers')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'offers'
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                >
                    Offer Builder
                </button>
                <button
                    onClick={() => setActiveTab('pantry')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'pantry'
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                >
                    <span className="flex items-center gap-2">🌿 Healing Pantry</span>
                </button>
                <button
                    onClick={() => setActiveTab('affirmations')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'affirmations'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                >
                    <span className="flex items-center gap-2"><Sparkles size={16} /> Daily Rituals</span>
                </button>
            </div>

            <div className="animate-in fade-in duration-300">

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <div>
                        <h2 className="font-bold text-slate-800 text-lg mb-4 hidden">Pending Reviews</h2>
                        <AdminReviewList reviews={reviews} />
                    </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === 'tools' && (() => {
                    const totalTools = products.length;
                    const totalPages = Math.ceil(totalTools / toolPerPage);
                    const startIndex = (toolPage - 1) * toolPerPage;
                    const endIndex = startIndex + toolPerPage;
                    const paginatedTools = products.slice(startIndex, endIndex);

                    return (
                        <div className="max-w-5xl">
                            {toolView === 'list' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">All Tools ({totalTools})</h2>
                                        <button
                                            onClick={() => { setToolView('create'); setEditingProduct(undefined); }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add New Tool
                                        </button>
                                        <button
                                            onClick={handleExportProductUrls}
                                            className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-green-600 flex items-center gap-2 ml-2"
                                        >
                                            <FileText size={16} /> Export
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Niche</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-200">
                                                {paginatedTools.map((product) => (
                                                    <tr key={product.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{product.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100 max-w-[150px] truncate block">/tool/{product.slug || product.id}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(`${window.location.origin}/tool/${product.slug || product.id}`);
                                                                        alert('Copied!');
                                                                    }}
                                                                    className="text-slate-400 hover:text-blue-600 transition-colors"
                                                                >
                                                                    <Copy size={12} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.niche}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                            <button
                                                                onClick={() => { setEditingProduct(product); setToolView('edit'); }}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                                disabled={isDeleting}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {products.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No tools found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-slate-600">
                                                Showing {startIndex + 1} to {Math.min(endIndex, totalTools)} of {totalTools} tools
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setToolPage(p => Math.max(1, p - 1))}
                                                    disabled={toolPage === 1}
                                                    className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setToolPage(pageNum)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${toolPage === pageNum
                                                                ? 'bg-blue-600 text-white shadow-sm'
                                                                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setToolPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={toolPage === totalPages}
                                                    className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(toolView === 'create' || toolView === 'edit') && (
                                <div>
                                    <button
                                        onClick={() => setToolView('list')}
                                        className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center"
                                    >
                                        <ArrowLeft size={16} className="mr-1" /> Back to List
                                    </button>
                                    <ProductForm initialData={editingProduct} />
                                </div>
                            )}
                        </div>
                    );
                })()}



                {/* NICHE TAB */}
                {activeTab === 'niches' && (() => {
                    const totalNiches = niches.length;
                    const totalPages = Math.ceil(totalNiches / nichePerPage);
                    const startIndex = (nichePage - 1) * nichePerPage;
                    const endIndex = startIndex + nichePerPage;
                    const paginatedNiches = niches.slice(startIndex, endIndex);

                    return (
                        <div className="max-w-5xl">
                            {nicheView === 'list' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">Niche Ideas ({totalNiches})</h2>
                                        <button
                                            onClick={() => { setNicheView('create'); setEditingNiche(undefined); }}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 flex items-center"
                                        >
                                            <Plus size={16} className="mr-1" /> Add New Niche
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Profitability</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Competition</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-200">
                                                {paginatedNiches.map((niche) => (
                                                    <tr key={niche.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{niche.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${niche.profitability.includes('High') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>{niche.profitability}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${niche.competition.includes('Low') ? 'bg-green-100 text-green-800' :
                                                                niche.competition.includes('Medium') ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                                }`}>{niche.competition}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                            <button
                                                                onClick={() => { setEditingNiche(niche); setNicheView('edit'); }}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            {/* <button
                                                                onClick={() => handleDeleteNiche(niche.id)}
                                                                disabled={isDeleting}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button> */}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {niches.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No niches found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-slate-600">
                                                Showing {startIndex + 1} to {Math.min(endIndex, totalNiches)} of {totalNiches} niches
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setNichePage(p => Math.max(1, p - 1))}
                                                    disabled={nichePage === 1}
                                                    className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setNichePage(pageNum)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${nichePage === pageNum
                                                                ? 'bg-blue-600 text-white shadow-sm'
                                                                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setNichePage(p => Math.min(totalPages, p + 1))}
                                                    disabled={nichePage === totalPages}
                                                    className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(nicheView === 'create' || nicheView === 'edit') && (
                                <div>
                                    <button
                                        onClick={() => setNicheView('list')}
                                        className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center"
                                    >
                                        <ArrowLeft size={16} className="mr-1" /> Back to List
                                    </button>
                                    {/* <NicheForm initialData={editingNiche} /> */}
                                    <p className="text-slate-600">Niche management is not available in this version.</p>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* GLOSSARY & TERMS TAB (Unified) */}
                {(activeTab === 'writing' || activeTab === 'glossary') && (() => {
                    // Filter terms based on search
                    let filteredTerms = glossaryTerms;

                    if (writingSearch) {
                        const searchLower = writingSearch.toLowerCase();
                        filteredTerms = filteredTerms.filter(t =>
                            t.term.toLowerCase().includes(searchLower) ||
                            t.definition?.toLowerCase().includes(searchLower) ||
                            (t.niche && t.niche.toLowerCase().includes(searchLower)) ||
                            (t.category && t.category.toLowerCase().includes(searchLower))
                        );
                    }




                    const totalWritingTerms = filteredTerms.length;
                    const totalWritingPages = Math.ceil(totalWritingTerms / writingPerPage);

                    const startIndex = (writingPage - 1) * writingPerPage;
                    const endIndex = startIndex + writingPerPage;
                    const paginatedWritingTerms = filteredTerms.slice(startIndex, endIndex);

                    return (
                        <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {writingView === 'import' ? (
                                <div>
                                    <button
                                        onClick={() => setWritingView('list')}
                                        className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center"
                                    >
                                        <ArrowLeft size={16} className="mr-1" /> Back to List
                                    </button>
                                    <GlossaryImporter />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(writingView === 'list') && (
                                        <>
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Glossary Terms</h2>
                                                        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-xs font-bold">{totalWritingTerms} terms</span>
                                                    </div>
                                                    <p className="text-slate-500 font-medium">Manage all healing definitions, marketing terms, and concepts.</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setEditingWritingTerm(undefined); setWritingView('create'); }}
                                                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2"
                                                    >
                                                        <Plus size={18} /> New Term
                                                    </button>
                                                    <button
                                                        onClick={() => setWritingView('import')}
                                                        className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 transition-all flex items-center gap-2"
                                                    >
                                                        <Download size={18} /> JSON Import
                                                    </button>

                                                    <button
                                                        onClick={handleExportGlossaryUrls}
                                                        className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-green-600 transition-all flex items-center gap-2"
                                                    >
                                                        <FileText size={18} /> Export URLs
                                                    </button>
                                                    <button
                                                        onClick={() => handleFindDuplicates()}
                                                        className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-amber-600 transition-all flex items-center gap-2"
                                                    >
                                                        <Search size={18} /> Find Dupes
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Filters Bar */}
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center shadow-sm">
                                                <div className="relative flex-1 min-w-[200px]">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search terms..."
                                                        value={writingSearch}
                                                        onChange={(e) => setWritingSearch(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                                                    />
                                                </div>

                                                {selectedTerms.size > 0 && (
                                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedTerms.size} selected</span>
                                                        <button
                                                            onClick={handleBulkDeleteTerms}
                                                            disabled={isDeleting}
                                                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={12} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Unified Table */}
                                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                                <table className="min-w-full divide-y divide-slate-100">
                                                    <thead className="bg-slate-50/50">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left w-12">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                                                    checked={paginatedWritingTerms.length > 0 && paginatedWritingTerms.every(t => selectedTerms.has(t.id))}
                                                                    onChange={() => toggleAllOnPage(paginatedWritingTerms.map(t => t.id))}
                                                                />
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Term Name</th>
                                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Category / Niche</th>
                                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">URL</th>
                                                            <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Linked Items</th>
                                                            <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {paginatedWritingTerms.map((term) => (
                                                            <tr key={term.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedTerms.has(term.id) ? 'bg-indigo-50/30' : ''}`}>
                                                                <td className="px-6 py-4">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                                                        checked={selectedTerms.has(term.id)}
                                                                        onChange={() => toggleTermSelection(term.id)}
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-slate-800 text-sm">{term.term}</span>
                                                                        <span className="text-[10px] text-slate-400 line-clamp-1">{term.id}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold inline-block border border-slate-200">
                                                                        {term.niche || term.category || "General"}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-2 max-w-[200px]">
                                                                        <span className="text-[10px] text-slate-500 truncate select-all font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 w-32 block">
                                                                            {`.../glossary/${term.slug || term.id}`}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(`${window.location.origin}/glossary/${term.slug || term.id}`);
                                                                                alert('URL Copied!');
                                                                            }}
                                                                            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                                                                            title="Copy URL"
                                                                        >
                                                                            <Copy size={12} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <div className="flex justify-center gap-2">
                                                                        {term.recommendedTools?.length > 0 && (
                                                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                                                                                <Wrench size={12} /> {term.recommendedTools.length}
                                                                            </span>
                                                                        )}
                                                                        {term.contentLevel && (
                                                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-blue-100">
                                                                                {term.contentLevel}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <a
                                                                            href={`/glossary/${term.slug || term.id}`}
                                                                            target="_blank"
                                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                            title="View Live"
                                                                        >
                                                                            <Eye size={16} />
                                                                        </a>
                                                                        <button
                                                                            onClick={() => { setEditingWritingTerm(term); setWritingView('edit'); }}
                                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                            title="Edit Term"
                                                                        >
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteTerm(term.id)}
                                                                            disabled={isDeleting}
                                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                            title="Delete Term"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {paginatedWritingTerms.length === 0 && (
                                                            <tr>
                                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                                        <BookOpen size={48} className="mb-4 opacity-20" />
                                                                        <p className="font-medium">No terms found matching your search.</p>
                                                                        <button onClick={() => { setEditingWritingTerm(undefined); setWritingView('create'); }} className="mt-4 text-indigo-600 font-bold hover:underline">
                                                                            Create the first one
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            {totalWritingPages > 1 && (
                                                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        Page {writingPage} of {totalWritingPages}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setWritingPage(p => Math.max(1, p - 1))}
                                                            disabled={writingPage === 1}
                                                            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                                        >
                                                            Prev
                                                        </button>
                                                        <button
                                                            onClick={() => setWritingPage(p => Math.min(totalWritingPages, p + 1))}
                                                            disabled={writingPage === totalWritingPages}
                                                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {writingView === 'duplicates' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <button
                                                        onClick={() => setWritingView('list')}
                                                        className="mb-2 text-sm text-slate-500 hover:text-slate-800 flex items-center"
                                                    >
                                                        <ArrowLeft size={16} className="mr-1" /> Back to List
                                                    </button>
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Duplicate Pattern Review</h2>
                                                    <p className="text-slate-500 text-sm">Found {duplicates.length} sets of patterns with identical names.</p>
                                                </div>
                                                {selectedTerms.size > 0 && (
                                                    <button
                                                        onClick={handleBulkDeleteTerms}
                                                        disabled={isDeleting}
                                                        className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-red-700 flex items-center shadow-lg shadow-red-100 transition-all active:scale-95"
                                                    >
                                                        <Trash2 size={16} className="mr-2" /> Delete Selected ({selectedTerms.size})
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-8">
                                                {duplicates.map((group, idx) => (
                                                    <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center">
                                                            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">"{group._id}" <span className="text-slate-400 text-sm font-medium ml-2">({group.count} instances)</span></h3>
                                                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wider">Review Needed</span>
                                                        </div>
                                                        <div className="divide-y divide-slate-100">
                                                            {group.terms.map((term: any, i: number) => {
                                                                const id = term.id;
                                                                return (
                                                                    <div key={id} className="px-8 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                                                        <div className="flex items-center gap-4">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                                                                checked={selectedTerms.has(id)}
                                                                                onChange={() => toggleTermSelection(id)}
                                                                            />
                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-mono text-slate-400">{id}</span>
                                                                                    {term && <span className="font-bold text-slate-700">{term.term}</span>}
                                                                                </div>
                                                                                {term && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{term.niche} • {term.shortDefinition?.substring(0, 60)}...</p>}
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleDeleteTerm(id)}
                                                                            disabled={isDeleting}
                                                                            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-50 rounded"
                                                                            title="Delete this instance"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(writingView === 'create' || writingView === 'edit') && (
                                        <div>
                                            <button
                                                onClick={() => setWritingView('list')}
                                                className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center"
                                            >
                                                <ArrowLeft size={16} className="mr-1" /> Back to Phrases
                                            </button>
                                            <GlossaryForm
                                                initialData={editingWritingTerm}
                                                onComplete={() => { setWritingView('list'); router.refresh(); }}
                                                products={products}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* SUBSCRIBERS TAB */}
                {activeTab === 'subscribers' && (() => {
                    const totalSubscribers = subscribers?.length || 0;
                    const totalPages = Math.ceil(totalSubscribers / subscriberPerPage);
                    const startIndex = (subscriberPage - 1) * subscriberPerPage;
                    const endIndex = startIndex + subscriberPerPage;
                    const paginatedSubscribers = (subscribers || []).slice(startIndex, endIndex);

                    return (
                        <div className="max-w-5xl">
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Newsletter Subscribers ({totalSubscribers})</h3>
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50" disabled>Export CSV (Coming Soon)</button>
                                </div>
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Joined</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {paginatedSubscribers.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{sub.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {totalSubscribers === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No subscribers yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-slate-600">
                                        Showing {startIndex + 1} to {Math.min(endIndex, totalSubscribers)} of {totalSubscribers} subscribers
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSubscriberPage(p => Math.max(1, p - 1))}
                                            disabled={subscriberPage === 1}
                                            className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setSubscriberPage(pageNum)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${subscriberPage === pageNum
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setSubscriberPage(p => Math.min(totalPages, p + 1))}
                                            disabled={subscriberPage === totalPages}
                                            className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}


                {/* OFFERS TAB */}
                {activeTab === 'offers' && (() => {
                    const totalOffers = salesPages?.length || 0;

                    // Sorting Logic
                    const sortedOffers = [...(salesPages || [])].sort((a, b) => {
                        let fieldA = a[salesPageSortField] || '';
                        let fieldB = b[salesPageSortField] || '';

                        if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
                        if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();

                        if (fieldA < fieldB) return salesPageSortDir === 'asc' ? -1 : 1;
                        if (fieldA > fieldB) return salesPageSortDir === 'asc' ? 1 : -1;
                        return 0;
                    });

                    const totalPages = Math.ceil(totalOffers / salesPagePerPage);
                    const startIndex = (salesPagePagination - 1) * salesPagePerPage;
                    const endIndex = startIndex + salesPagePerPage;
                    const paginatedOffers = sortedOffers.slice(startIndex, endIndex);

                    const handleSort = (field: string) => {
                        if (salesPageSortField === field) {
                            setSalesPageSortDir(salesPageSortDir === 'asc' ? 'desc' : 'asc');
                        } else {
                            setSalesPageSortField(field);
                            setSalesPageSortDir('asc');
                        }
                    };

                    return (
                        <div className="max-w-5xl">
                            {salesPageView === 'list' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">Sales Pages ({totalOffers})</h2>
                                        <button
                                            onClick={() => {
                                                setSalesPageView('create');
                                                setEditingSalesPage(undefined);
                                                setCustomPageSlug('');
                                                setCustomPageCode('');
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Create New Page
                                        </button>
                                        <button
                                            onClick={handleExportOfferUrls}
                                            className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-green-600 flex items-center gap-2 ml-2"
                                        >
                                            <FileText size={16} /> Export
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleSort('title')}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            Title <ArrowUpDown size={12} />
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleSort('pageType')}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            Type <ArrowUpDown size={12} />
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider w-10">Link</th>
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleSort('isPublished')}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            Status <ArrowUpDown size={12} />
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Analytics</th>
                                                    <th className="px-6 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-200">
                                                {paginatedOffers.map((page: any) => (
                                                    <tr key={page._id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 whitespace-normal max-w-[240px]">
                                                            <div className="text-sm font-bold text-slate-900">{page.title}</div>
                                                            {page.price && <div className="text-[10px] text-green-600 font-black uppercase tracking-tight">${page.price}</div>}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ring-1 ring-inset ${page.pageType === 'upsell' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                                                                    page.pageType === 'downsell' ? 'bg-orange-50 text-orange-700 ring-orange-600/20' :
                                                                        page.pageType === 'thank-you' ? 'bg-teal-50 text-teal-700 ring-teal-600/20' :
                                                                            'bg-blue-50 text-blue-700 ring-blue-600/20'
                                                                    }`}>
                                                                    {page.pageType?.replace('-', ' ') || 'Sales Page'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`${window.location.origin}/offers/${page.slug}`);
                                                                    alert('Link Copied!');
                                                                }}
                                                                className="flex items-center gap-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-2 py-1 rounded transition-colors text-xs font-bold"
                                                                title="Copy URL"
                                                            >
                                                                <Copy size={12} /> Copy
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="flex flex-col gap-1">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase inline-block w-fit ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                                                                    {page.isPublished ? 'Published' : 'Draft'}
                                                                </span>
                                                                {page.showInMarketplace && (
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 inline-block w-fit">
                                                                        Marketplace
                                                                    </span>
                                                                )}
                                                                {page.abEnabled && (
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 inline-block w-fit">
                                                                        A/B Active
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-6">
                                                                <div className="text-center">
                                                                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Views</span>
                                                                    <span className="block text-xs font-bold text-slate-700">{(page.views || 0).toLocaleString()}</span>
                                                                </div>
                                                                <div className="text-center">
                                                                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Clicks</span>
                                                                    <span className="block text-xs font-bold text-green-600">{(page.clicks || 0).toLocaleString()}</span>
                                                                </div>
                                                                <div className="text-center">
                                                                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">CVR</span>
                                                                    <span className="block text-xs font-black text-blue-600">
                                                                        {page.views > 0 ? ((page.clicks / page.views) * 100).toFixed(1) : "0"}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                            <a
                                                                href={`/offers/${page.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-slate-400 hover:text-slate-600 inline-block"
                                                                title="View Live Page"
                                                            >
                                                                <Eye size={16} />
                                                            </a>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingSalesPage(page);
                                                                    setCustomPageSlug(page.slug || '');
                                                                    setCustomPageCode(page.content || '');
                                                                    setSalesPageView('edit');
                                                                }}
                                                                className="text-blue-600 hover:text-blue-900 inline-block"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm(`Delete page "${page.slug}"?`)) return;
                                                                    try {
                                                                        const res = await fetch(`/api/offers/${page._id || page.slug}`, { method: 'DELETE' });
                                                                        const data = await res.json();
                                                                        if (data.success) {
                                                                            window.location.reload();
                                                                        } else {
                                                                            alert('Error deleting page: ' + data.error);
                                                                        }
                                                                    } catch (e) {
                                                                        console.error(e);
                                                                        alert('Error deleting page');
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900 inline-block"
                                                                title="Delete Page"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {totalOffers === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No sales pages created yet.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-slate-600">
                                                Showing {startIndex + 1} to {Math.min(endIndex, totalOffers)} of {totalOffers} pages
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSalesPagePagination(p => Math.max(1, p - 1))}
                                                    disabled={salesPagePagination === 1}
                                                    className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setSalesPagePagination(pageNum)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${salesPagePagination === pageNum
                                                                ? 'bg-blue-600 text-white shadow-sm'
                                                                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setSalesPagePagination(p => Math.min(totalPages, p + 1))}
                                                    disabled={salesPagePagination === totalPages}
                                                    className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                            }

                            {(salesPageView === 'create' || salesPageView === 'edit') && (
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <button
                                            onClick={() => setSalesPageView('list')}
                                            className="text-sm text-slate-500 hover:text-slate-800 flex items-center font-bold"
                                        >
                                            <ArrowLeft size={16} className="mr-1" /> Back to List
                                        </button>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                            {salesPageView === 'create' ? 'Create New Sales Offer' : 'Edit Sales Offer'}
                                        </h2>
                                        <div className="w-24"></div> {/* Spacer */}
                                    </div>
                                    {/* <SalesPageForm
                                        initialData={editingSalesPage}
                                        onComplete={() => {
                                            setSalesPageView('list');
                                        onComplete={() => {
                                            setSalesPageView('list');
                                            window.location.reload();
                                        }}
                                    /> */}
                                    {(salesPageView === 'create' || salesPageView === 'edit') && (
                                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl mx-auto">
                                            <div className="mb-6">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                                    <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                                                        <Info size={16} /> Instant Publish Mode
                                                    </h4>
                                                    <p className="text-sm text-blue-700">
                                                        Offers are now stored in the database and published instantly. No build required.
                                                        Supports HTML content.
                                                    </p>
                                                </div>

                                                <label className="block text-sm font-bold text-slate-700 mb-2">Page Slug / URL</label>
                                                <div className="flex items-center">
                                                    <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l px-3 py-2 text-slate-500 text-sm font-mono">/offers/</span>
                                                    <input
                                                        type="text"
                                                        value={customPageSlug}
                                                        onChange={(e) => setCustomPageSlug(e.target.value)}
                                                        className="flex-1 border border-slate-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                                        placeholder="e.g. breathalyzer-dashboard (Leave empty to auto-generate from content)"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-sm font-bold text-slate-700">Content</label>
                                                    <span className="text-xs text-slate-500">Paste HTML content (React will be sanitized)</span>
                                                </div>
                                                <textarea
                                                    value={customPageCode}
                                                    onChange={(e) => setCustomPageCode(e.target.value)}
                                                    className="w-full h-[500px] font-mono text-xs bg-slate-900 text-emerald-400 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                                                    placeholder={`<h1>My Offer</h1><p>...</p>`}
                                                    spellCheck={false}
                                                />
                                            </div>

                                            <div className="flex justify-end border-t border-slate-100 pt-6">
                                                <button
                                                    onClick={async () => {
                                                        if (!customPageCode) return alert('Please provide page content.');
                                                        setIsGeneratingPage(true);
                                                        try {
                                                            const res = await fetch('/api/offers', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ slug: customPageSlug, content: customPageCode })
                                                            });
                                                            const data = await res.json();

                                                            if (data.success) {
                                                                alert(`✅ Page successfully ${data.offer ? 'saved' : 'saved'}!\nURL: ${window.location.origin}/offers/${data.offer.slug}`);
                                                                window.open(`${window.location.origin}/offers/${data.offer.slug}`, '_blank');
                                                                setCustomPageSlug('');
                                                                setCustomPageCode('');
                                                                setSalesPageView('list');
                                                                window.location.reload();
                                                            } else {
                                                                alert('❌ Error saving page: ' + data.error);
                                                            }
                                                        } catch (e) {
                                                            console.error(e);
                                                            alert('An error occurred.');
                                                        } finally {
                                                            setIsGeneratingPage(false);
                                                        }
                                                    }}
                                                    disabled={isGeneratingPage}
                                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:scale-105"
                                                >
                                                    {isGeneratingPage ? (
                                                        <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Saving...</>
                                                    ) : (
                                                        <><Plus size={18} /> Publish Page</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* HEALING PANTRY TAB */}
                {activeTab === 'pantry' && (() => {
                    let filteredHerbs = herbs || [];

                    if (pantrySearch) {
                        const searchLower = pantrySearch.toLowerCase();
                        filteredHerbs = filteredHerbs.filter(h =>
                            h.name.toLowerCase().includes(searchLower) ||
                            (h.description && h.description.toLowerCase().includes(searchLower)) ||
                            (h.category && h.category.toLowerCase().includes(searchLower))
                        );
                    }

                    const totalHerbs = filteredHerbs.length;
                    const totalPages = Math.ceil(totalHerbs / pantryPerPage);
                    const startIndex = (pantryPage - 1) * pantryPerPage;
                    const endIndex = startIndex + pantryPerPage;
                    const paginatedHerbs = filteredHerbs.slice(startIndex, endIndex);

                    return (
                        <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {pantryView === 'import' ? (
                                <div>
                                    <button
                                        onClick={() => setPantryView('list')}
                                        className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm font-medium transition-colors"
                                    >
                                        <ArrowLeft size={16} className="mr-1" /> Back to List
                                    </button>
                                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-indigo-50 rounded-xl">
                                                <Download className="text-indigo-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 mb-1">Bulk Import Herbs</h3>
                                                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                                                    Paste a simple list of terms OR a JSON array of objects.
                                                    You can also paste the full <code>SPICE_PROFILES</code> object.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
                                                placeholder={`Example JSON:\n[\n  {\n    "name": "Turmeric",\n    "category": "Spices",\n    "healing": ["Inflammation", "Joints"]\n  }\n]\n\nOR Just Names:\nTurmeric\nGinger\nGarlic`}
                                                value={pantryImportText}
                                                onChange={(e) => setPantryImportText(e.target.value)}
                                            />
                                            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                                                {pantryImportText.length} characters
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3">
                                            <button
                                                onClick={() => setPantryView('list')}
                                                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleImportHerbs}
                                                disabled={!pantryImportText}
                                                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                            >
                                                <Download size={18} /> Process Import
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(pantryView === 'list') && (
                                        <>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Leaf className="text-emerald-500" />
                                                        Healing Pantry
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold border border-slate-200">
                                                            {filteredHerbs.length} Items
                                                        </span>
                                                    </h2>
                                                    <p className="text-slate-500 text-sm mt-1">Manage herbs, spices, and healing foods.</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setEditingHerb(undefined); setPantryView('create'); }}
                                                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 hover:scale-105"
                                                    >
                                                        <Plus size={18} /> Add Item
                                                    </button>
                                                    <button
                                                        onClick={() => setPantryView('import')}
                                                        className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 transition-all flex items-center gap-2"
                                                    >
                                                        <Download size={18} /> Import
                                                    </button>
                                                    <button
                                                        onClick={handleFindHerbDuplicates}
                                                        className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-amber-600 transition-all flex items-center gap-2"
                                                    >
                                                        <Search size={18} /> Find Dupes
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Filters Bar */}
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center shadow-sm">
                                                <div className="relative flex-1 min-w-[200px]">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search pantry..."
                                                        value={pantrySearch}
                                                        onChange={(e) => setPantrySearch(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-100 outline-none"
                                                    />
                                                </div>
                                                {pantrySelected.size > 0 && (
                                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{pantrySelected.size} selected</span>
                                                        <button
                                                            onClick={handleBulkDeleteHerbs}
                                                            disabled={isDeleting}
                                                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={12} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Table */}
                                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                                <table className="min-w-full divide-y divide-slate-100">
                                                    <thead className="bg-slate-50/50">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left w-12">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                                                    checked={paginatedHerbs.length > 0 && paginatedHerbs.every(h => pantrySelected.has(h.id))}
                                                                    onChange={() => {
                                                                        const ids = paginatedHerbs.map(h => h.id);
                                                                        const allSelected = ids.every(id => pantrySelected.has(id));
                                                                        const newSelected = new Set(pantrySelected);
                                                                        if (allSelected) {
                                                                            ids.forEach(id => newSelected.delete(id));
                                                                        } else {
                                                                            ids.forEach(id => newSelected.add(id));
                                                                        }
                                                                        setPantrySelected(newSelected);
                                                                    }}
                                                                />
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Name</th>
                                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Healing Properties</th>
                                                            <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Completed</th>
                                                            <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest pr-8">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {paginatedHerbs.map((herb) => (
                                                            <tr key={herb.id} className={`hover:bg-slate-50/80 transition-colors group ${pantrySelected.has(herb.id) ? 'bg-emerald-50/30' : ''}`}>
                                                                <td className="px-6 py-4">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                                                        checked={pantrySelected.has(herb.id)}
                                                                        onChange={() => {
                                                                            const newSelected = new Set(pantrySelected);
                                                                            if (newSelected.has(herb.id)) {
                                                                                newSelected.delete(herb.id);
                                                                            } else {
                                                                                newSelected.add(herb.id);
                                                                            }
                                                                            setPantrySelected(newSelected);
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-slate-800 text-sm">{herb.name}</span>
                                                                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{herb.slug}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold shadow-sm inline-block">
                                                                        {herb.category}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {(herb.healing || []).slice(0, 3).map((h, i) => (
                                                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                                {h}
                                                                            </span>
                                                                        ))}
                                                                        {(herb.healing?.length || 0) > 3 && (
                                                                            <span className="text-[10px] text-slate-400 font-medium px-1">+{herb.healing.length - 3}</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    {herb.description && !herb.description.includes("generic entry") ? (
                                                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                                                                            <Check size={14} strokeWidth={3} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-400" title="Placeholder Description">
                                                                            <AlertTriangle size={14} />
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 text-right pr-8">
                                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <a
                                                                            href={`/healing-pantry?herb=${herb.slug}`}
                                                                            target="_blank"
                                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                            title="View Live"
                                                                        >
                                                                            <Eye size={16} />
                                                                        </a>
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingHerb(herb);
                                                                                setPantryView('edit');
                                                                            }}
                                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                            title="Edit"
                                                                        >
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteHerb(herb.id)}
                                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {totalHerbs === 0 && (
                                                            <tr>
                                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                                        <ShoppingBag size={48} className="mb-4 text-slate-200" />
                                                                        <p className="font-medium text-lg text-slate-500">No herbs found.</p>
                                                                        <p className="text-sm">Try adjusting your search or add a new item.</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination Controls */}
                                            {totalPages > 1 && (
                                                <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        Showing {startIndex + 1}-{Math.min(endIndex, totalHerbs)} of {totalHerbs}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setPantryPage(p => Math.max(1, p - 1))}
                                                            disabled={pantryPage === 1}
                                                            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                                        >
                                                            Previous
                                                        </button>
                                                        <button
                                                            onClick={() => setPantryPage(p => Math.min(totalPages, p + 1))}
                                                            disabled={pantryPage === totalPages}
                                                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg shadow-slate-200"
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {(pantryView === 'create' || pantryView === 'edit') && (
                                        <div>
                                            <button
                                                onClick={() => setPantryView('list')}
                                                className="mb-6 text-sm text-slate-500 hover:text-slate-800 flex items-center bg-white border border-slate-200 w-fit px-3 py-1.5 rounded-lg shadow-sm font-bold transition-all hover:pr-4"
                                            >
                                                <ArrowLeft size={16} className="mr-1" /> Back to Pantry
                                            </button>
                                            <HerbForm
                                                initialData={editingHerb}
                                                products={products}
                                                onSuccess={() => { setPantryView('list'); router.refresh(); }}
                                                onCancel={() => setPantryView('list')}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* AFFIRMATIONS TAB */}
                {activeTab === 'affirmations' && (() => {
                    const filteredAffirmations = (affirmations || []).filter(a => {
                        const matchesSearch = a.title.toLowerCase().includes(affirmationSearch.toLowerCase()) ||
                            a.affirmation.toLowerCase().includes(affirmationSearch.toLowerCase()) ||
                            a.category.toLowerCase().includes(affirmationSearch.toLowerCase()) ||
                            a.intention.toLowerCase().includes(affirmationSearch.toLowerCase());

                        const firstChar = a.title.trim().charAt(0).toUpperCase();
                        const matchesAlpha = affirmationAlphaFilter === 'All' || firstChar === affirmationAlphaFilter;

                        return matchesSearch && matchesAlpha;
                    }).sort((a, b) => a.title.localeCompare(b.title));

                    const totalPages = Math.ceil(filteredAffirmations.length / affirmationPerPage);
                    const paginatedItems = filteredAffirmations.slice((affirmationPage - 1) * affirmationPerPage, affirmationPage * affirmationPerPage);

                    const alphabet = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

                    return (
                        <div className="max-w-7xl mx-auto">
                            {affirmationView === 'list' && (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Daily Rituals</h2>
                                            <p className="text-slate-500">Manage affirmations and pairings.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-purple-500 outline-none"
                                                    value={affirmationSearch}
                                                    onChange={e => setAffirmationSearch(e.target.value)}
                                                />
                                            </div>
                                            <button onClick={() => setAffirmationView('prompt-builder')} className="px-4 py-2 bg-white text-slate-700 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><Sparkles size={16} /> Build AI Prompt</button>
                                            <button onClick={() => setAffirmationView('import')} className="px-4 py-2 bg-white text-slate-700 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><Download size={16} /> Import</button>
                                            <button onClick={() => { setEditingAffirmation(undefined); setAffirmationView('create'); }} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center gap-2"><Plus size={16} /> Create Ritual</button>
                                        </div>
                                    </div>

                                    {/* Alpha Filter */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {alphabet.map(letter => (
                                            <button
                                                key={letter}
                                                onClick={() => { setAffirmationAlphaFilter(letter); setAffirmationPage(1); }}
                                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${affirmationAlphaFilter === letter
                                                    ? 'bg-purple-600 text-white shadow-md'
                                                    : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                                                    }`}
                                            >
                                                {letter}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                        <table className="min-w-full divide-y divide-slate-100">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Title</th>
                                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Affirmation</th>
                                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Category</th>
                                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {paginatedItems.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-slate-900">{item.title}</div>
                                                            {item.primaryHerb && <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1"><Leaf size={10} /> {item.primaryHerb}</div>}
                                                        </td>
                                                        <td className="px-6 py-4 bg-slate-50/50">
                                                            <div className="font-serif italic text-slate-600 text-sm max-w-md line-clamp-2">"{item.affirmation}"</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                                                                {item.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium">
                                                            <div className="flex gap-2">
                                                                <a href={`/affirmations/${item.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-purple-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                                                                    <Eye size={16} />
                                                                </a>
                                                                <button onClick={() => { setEditingAffirmation(item); setAffirmationView('edit'); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button onClick={() => handleDeleteAffirmation(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {paginatedItems.length === 0 && (
                                            <div className="text-center py-12">
                                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                    <Search size={24} />
                                                </div>
                                                <h3 className="text-slate-900 font-bold">No rituals found</h3>
                                                <p className="text-slate-500 text-sm mt-1">Try adjusting your filters.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-8 gap-2">
                                            <button disabled={affirmationPage === 1} onClick={() => setAffirmationPage(p => p - 1)} className="px-4 py-2 rounded-lg border disabled:opacity-50">Prev</button>
                                            <span className="px-4 py-2 flex items-center font-bold text-sm text-slate-600">Page {affirmationPage} of {totalPages}</span>
                                            <button disabled={affirmationPage >= totalPages} onClick={() => setAffirmationPage(p => p + 1)} className="px-4 py-2 rounded-lg border disabled:opacity-50">Next</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {affirmationView === 'import' && (
                                <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">Import Rituals</h3>
                                    <p className="text-slate-500 mb-4">Paste the JSON array of affirmation objects here.</p>
                                    <textarea
                                        className="w-full h-64 p-4 bg-slate-50 rounded-xl font-mono text-xs mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                                        value={affirmationImportText}
                                        onChange={e => setAffirmationImportText(e.target.value)}
                                        placeholder='[{"title": "...", ...}]'
                                    />
                                    <div className="flex justify-end gap-4">
                                        <button onClick={() => setAffirmationView('list')} className="px-6 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                                        <button onClick={handleImportAffirmations} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Import JSON</button>
                                    </div>
                                </div>
                            )}

                            {affirmationView === 'prompt-builder' && (
                                <AffirmationPromptBuilder onBack={() => setAffirmationView('list')} />
                            )}

                            {affirmationView === 'create' && (
                                <AffirmationForm
                                    herbs={herbs || []} products={products || []} glossaryTerms={glossaryTerms || []}
                                    onCancel={() => setAffirmationView('list')}
                                    onSuccess={() => { setAffirmationView('list'); window.location.reload(); }}
                                />
                            )}

                            {affirmationView === 'edit' && editingAffirmation && (
                                <AffirmationForm
                                    initialData={editingAffirmation}
                                    herbs={herbs || []} products={products || []} glossaryTerms={glossaryTerms || []}
                                    onCancel={() => { setAffirmationView('list'); setEditingAffirmation(undefined); }}
                                    onSuccess={() => { setAffirmationView('list'); setEditingAffirmation(undefined); window.location.reload(); }}
                                />
                            )}
                        </div>
                    );
                })()}

            </div>
        </div>
    );
}
