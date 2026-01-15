// import { getSalesPages } from '@/lib/actions'; // Removed - feature not used
import { getProducts } from '@/lib/initialData';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Star, CheckCircle2, Compass, Leaf, Sparkles, Heart, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

function getProductTag(product: any) {
    if (product.affiliateLink) return "Affiliate";
    if (product.type === 'course' || product.type === 'digital') return "Kathleen Heals";
    if (product.type === 'tool') return "Wellness Tool";
    return "Kathleen Heals";
}

function ShieldCheckIcon({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

export default async function MarketplacePage() {
    const [{ products: randomProducts }, pages] = await Promise.all([
        getProducts({ random: true, limit: 12 }),
        Promise.resolve([]) // getSalesPages() - feature removed
    ]);

    const allMarketplacePages = pages.filter((p: any) => p.isPublished && p.showInMarketplace);

    return (
        <div className="min-h-screen bg-[#FDFCFB] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                        <Leaf size={16} /> Curated Healing Marketplace
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                        Wellness <span className="text-emerald-600 italic">Marketplace</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                        Discover tools and resources carefully selected to support your energetic wellbeing. From physical healing aids to digital guided practices.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/marketplace/explore"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-[2rem] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-200 group"
                        >
                            <Compass className="group-hover:rotate-90 transition-transform duration-500" /> Resource Library
                        </Link>
                        <Link
                            href="/glossary"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-[2rem] font-bold uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-700 transition-all"
                        >
                            Healing Glossary
                        </Link>
                    </div>
                </div>

                {/* Grid - Showing Random Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {randomProducts && randomProducts.length > 0 ? (
                        randomProducts.map((product: any) => (
                            <div key={product.id || product._id.toString()} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-2 flex flex-col group">
                                <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-emerald-200 transition-colors duration-500">
                                            <div className="p-6 bg-emerald-50 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                                                <ShoppingBag size={64} strokeWidth={1} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-emerald-700 px-3 py-1.5 rounded-full shadow-sm">
                                        {getProductTag(product)}
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex-grow">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                            {product.type || "Healing Tool"}
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors tracking-tight leading-tight">
                                            {product.name}
                                        </h2>
                                        <p className="text-slate-500 line-clamp-3 mb-6 text-sm leading-relaxed font-light">
                                            {product.description || "A specialized resource designed to enhance your energetic well-being and personal growth."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <span className="text-2xl font-bold text-emerald-600">
                                            {product.price ? (typeof product.price === 'number' ? `$${product.price}` : product.price) : "Free"}
                                        </span>
                                        <Link
                                            href={product.affiliateLink || product.link || `/tools/${product.slug}`}
                                            target={product.affiliateLink ? "_blank" : undefined}
                                            className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-slate-200"
                                        >
                                            <ExternalLink size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Leaf className="text-emerald-300" size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Resources Coming Soon</h2>
                            <p className="text-slate-500 font-light">We are curating high-vibrational tools for you. Stay tuned!</p>
                        </div>
                    )}
                </div>

                {allMarketplacePages.length > 0 && (
                    <div className="mt-24 text-center">
                        <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest font-bold">Looking for something more specific?</p>
                        <Link
                            href="/marketplace/explore"
                            className="bg-white border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-[2rem] font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-50 flex inline-flex items-center gap-3 mx-auto"
                        >
                            Browse All {allMarketplacePages.length} Resources <ArrowRight size={20} className="inline-block ml-2" />
                        </Link>
                    </div>
                )}

                {/* Trust Section */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-20">
                    <div className="space-y-4">
                        <div className="flex justify-center text-emerald-400">
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} />
                            <Star fill="currentColor" size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-tight">Curated with Care</h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">Every tool is vetted for alignment with authentic healing principles.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Heart size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-tight">Community Trusted</h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">Join thousands of others on a path of self-discovery and recovery.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                            <ShieldCheckIcon size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-tight">Satisfaction Guaranteed</h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">We stand by the quality of our educational content and tools.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
