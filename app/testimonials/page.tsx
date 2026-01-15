import { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Client Testimonials | Kathleen Heals',
    description: 'Read what clients say about their healing experiences with Kathleen. Real reviews from real people.',
};

const ITEMS_PER_PAGE = 25;

export default async function TestimonialsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    await connectToDatabase();
    const resolvedParams = await searchParams;
    const currentPage = parseInt(resolvedParams.page || '1', 10);
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const [testimonials, totalCount] = await Promise.all([
        Testimonial.find({ approved: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(ITEMS_PER_PAGE)
            .lean(),
        Testimonial.countDocuments({ approved: true })
    ]);

    const serializedTestimonials = JSON.parse(JSON.stringify(testimonials));
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-emerald-100">
                        <Star size={14} className="fill-emerald-600" />
                        Client Testimonials
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        What Clients Say About Kathleen
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Real experiences from clients who have found relief through energy healing.
                    </p>
                    <div className="mt-6 text-slate-500">
                        Showing <span className="font-bold text-emerald-600">{totalCount}</span> testimonials
                    </div>
                </div>

                {/* Testimonials Grid */}
                {serializedTestimonials.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-emerald-100">
                        <Star size={48} className="mx-auto text-emerald-300 mb-4" />
                        <p className="text-slate-500 text-lg mb-6">No testimonials have been shared yet.</p>
                        <Link href="/submit-testimonial" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                            Be the First to Share
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {serializedTestimonials.map((testimonial: any) => (
                                <div
                                    key={testimonial.id}
                                    className="bg-white rounded-3xl border-2 border-emerald-100 p-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
                                >
                                    {/* Rating */}
                                    <div className="mb-4">
                                        {renderStars(testimonial.rating)}
                                    </div>

                                    {/* Testimonial Text */}
                                    <blockquote className="text-slate-700 leading-relaxed mb-4 italic">
                                        "{testimonial.testimonialText}"
                                    </blockquote>

                                    {/* Author */}
                                    <p className="font-semibold text-slate-900 mb-2">
                                        — {testimonial.clientInitials || testimonial.clientName}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                                        {testimonial.issue && (
                                            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                                                {testimonial.issue}
                                            </span>
                                        )}
                                        {testimonial.outcome && (
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                                                {testimonial.outcome}
                                            </span>
                                        )}
                                        {testimonial.sessionType && (
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
                                                {testimonial.sessionType}
                                            </span>
                                        )}
                                    </div>

                                    {/* Location */}
                                    {testimonial.location && (
                                        <p className="text-xs text-slate-500 mt-3">
                                            {testimonial.location}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {/* Previous Button */}
                                {currentPage > 1 ? (
                                    <Link
                                        href={`/testimonials?page=${currentPage - 1}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-emerald-200 text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                        Previous
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                                        <ChevronLeft size={20} />
                                        Previous
                                    </div>
                                )}

                                {/* Page Numbers */}
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={`/testimonials?page=${pageNum}`}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${pageNum === currentPage
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Next Button */}
                                {currentPage < totalPages ? (
                                    <Link
                                        href={`/testimonials?page=${currentPage + 1}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-emerald-200 text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
                                    >
                                        Next
                                        <ChevronRight size={20} />
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                                        Next
                                        <ChevronRight size={20} />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* CTA */}
                <div className="mt-16 text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-emerald-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Had a Great Experience?</h3>
                    <p className="text-slate-600 mb-6">Share your testimonial and help others discover the power of energy healing.</p>
                    <Link href="/submit-testimonial" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                        <Star size={20} className="fill-white" />
                        Submit Your Testimonial
                    </Link>
                </div>
            </div>
        </div>
    );
}
