import { getProduct } from '@/lib/initialData';
import ReviewForm from '@/components/features/ReviewForm';
import { RatingStars } from '@/components/ui/RatingStars';
import { CheckCircle, XCircle, Tag, ExternalLink, ArrowRight, Check, Minus } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import OutboundLink from '@/components/ui/OutboundLink';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    // id parameter now accepts slug for SEO-friendly URLs
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Tool Not Found - Digital Marketing Newbie',
            description: 'The requested tool could not be found in our directory.'
        };
    }

    return {
        title: `${product.name} Review, Pricing & Alternatives | DMN`,
        description: product.metaDescription || product.shortDescription || `Read our in-depth review of ${product.name}. Find features, pricing, pros, cons, and user ratings.`,
        openGraph: {
            title: `${product.name} - Best Digital Marketing Tools`,
            description: product.shortDescription,
            images: product.logoUrl ? [product.logoUrl] : []
        }
    };
}

export default async function ToolDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Configure marked
    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    const rawDescription = (product.description || "")
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&lt;br\s*\/?&gt;/gi, '\n')
        .replace(/\\n/g, '\n');

    const htmlContent = await marked.parse(rawDescription);
    const window = new JSDOM('').window;
    const purify = DOMPurify(window as any);
    const sanitizedHtml = purify.sanitize(htmlContent);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* Hero Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg ${product.logoColor}`}>
                                {product.name.substring(0, 2)}
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{product.name}</h1>
                                <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">{product.category}</span>
                                    <span className="flex items-center gap-1">• <RatingStars rating={product.rating} /></span>
                                    <span>• {product.reviewsCount} Reviews</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <OutboundLink
                                href={product.affiliateLink || "#"}
                                productId={product.id}
                                className="flex-1 md:flex-none py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center text-sm"
                            >
                                Visit Website <ExternalLink size={16} className="ml-2" />
                            </OutboundLink>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Description & Deal */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-[0.1em] text-sm text-blue-600 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-blue-600"></span>
                            Overview
                        </h2>
                        <div
                            className="markdown-content text-slate-700 leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                        />



                        {product.deal && (
                            <div className="bg-green-50 border border-green-200 p-5 rounded-xl flex items-start sm:items-center gap-4">
                                <div className="bg-green-100 p-2 rounded-full text-green-600"><Tag size={20} /></div>
                                <div>
                                    <span className="block text-green-800 font-bold uppercase tracking-wider text-xs mb-1">Exclusive Deal</span>
                                    <span className="text-green-900 font-medium text-lg">{product.deal}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag: string) => (
                                    <Link key={tag} href={`/?q=${tag}`} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition-colors">
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pros & Cons */}
                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center text-green-700">
                                <CheckCircle size={20} className="mr-2" /> Pros
                            </h3>
                            <ul className="space-y-3">
                                {product.pros.map((pro: string, i: number) => (
                                    <li key={i} className="flex items-start text-slate-700">
                                        <Check size={16} className="mt-1 mr-3 text-green-500 flex-shrink-0" />
                                        <span className="text-sm">{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center text-red-700">
                                <XCircle size={20} className="mr-2" /> Cons
                            </h3>
                            <ul className="space-y-3">
                                {product.cons.map((con: string, i: number) => (
                                    <li key={i} className="flex items-start text-slate-700">
                                        <Minus size={16} className="mt-1 mr-3 text-red-500 flex-shrink-0" />
                                        <span className="text-sm">{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Reviews */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">User Reviews</h2>
                            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-medium">{product.userReviews.length}</span>
                        </div>

                        <div className="space-y-6 mb-10">
                            {product.userReviews.length > 0 ? (
                                product.userReviews.map((review: any, idx: number) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{review.user}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{review.date}</span>
                                        </div>
                                        <div className="mb-3"><RatingStars rating={review.rating} /></div>
                                        <p className="text-slate-600 text-sm leading-relaxed">"{review.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">No reviews yet. Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>

                        <ReviewForm productId={product.id} productName={product.name} />
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-slate-900 mb-4">Pricing Model</h3>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-600">Type</span>
                            <span className="font-medium px-3 py-1 bg-slate-100 rounded text-slate-800 text-sm">{product.priceModel}</span>
                        </div>
                        <hr className="border-slate-100 my-4" />
                        <h3 className="font-bold text-slate-900 mb-3">Key Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.features.map((feat: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-md text-xs font-medium border border-slate-100">
                                    {feat}
                                </span>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
