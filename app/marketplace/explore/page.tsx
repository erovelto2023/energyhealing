// import { getSalesPages } from '@/lib/actions'; // Removed - feature not used
import { getProducts } from '@/lib/initialData';
import MarketplaceDirectory from '@/components/marketplace/MarketplaceDirectory';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MarketplaceExplorePage() {
    const [allPages, { products }] = await Promise.all([
        Promise.resolve([]), // getSalesPages() - feature removed
        getProducts({ limit: 1000 })
    ]);

    const publishedPages = allPages.filter((p: any) => p.isPublished && p.showInMarketplace);

    // Map both to a unified resource format
    const resources = [
        ...publishedPages.map((p: any) => ({
            id: p._id.toString(),
            title: p.title || p.marketplaceTitle,
            description: p.description || p.marketplaceDescription,
            price: p.price || p.settings?.price || p.startingPrice,
            niche: p.niche || "Health & Wellness",
            slug: p.slug,
            type: "Educational Resource",
            link: `/offers/${p.slug}`,
            source: 'SalesPage'
        })),
        ...products.map((p: any) => ({
            id: p.id || p._id.toString(),
            title: p.name,
            description: p.description,
            price: p.startingPrice || p.price,
            niche: p.niche,
            slug: p.slug,
            type: p.type || "Wellness Tool",
            link: p.affiliateLink || `/tools/${p.slug}`,
            source: 'Product'
        }))
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Header */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-lg shadow-emerald-50">
                                <Leaf size={24} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Resource Library</h1>
                                <p className="text-slate-500 text-sm font-light">Explore our complete collection of healing tools and sessions.</p>
                            </div>
                        </div>

                        <Link
                            href="/marketplace"
                            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2"
                        >
                            Back to Featured
                        </Link>
                    </div>
                </div>
            </div>

            <MarketplaceDirectory resources={resources} />
        </div>
    );
}
