"use client";

import React from 'react';
import { RatingStars } from '@/components/ui/RatingStars';
import { CheckCircle, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { approveReview, rejectReview } from '@/lib/actions';
import { IPendingReview } from '@/lib/models/PendingReview';

import { useRouter } from 'next/navigation';

// Augment interface to include _id which comes from Mongoose
interface PendingReviewDoc extends IPendingReview {
    _id: string;
}

export default function AdminReviewList({ reviews }: { reviews: PendingReviewDoc[] }) {
    const [optimisticReviews, setOptimisticReviews] = React.useState(reviews);
    const router = useRouter();

    React.useEffect(() => {
        setOptimisticReviews(reviews);
    }, [reviews]);

    const handleApprove = async (id: string) => {
        setOptimisticReviews(prev => prev.filter(r => r._id !== id));
        await approveReview(id); // Server action
        router.refresh();
    };

    const handleReject = async (id: string) => {
        setOptimisticReviews(prev => prev.filter(r => r._id !== id));
        await rejectReview(id); // Server action
        router.refresh();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {optimisticReviews.length > 0 ? (
                <div className="divide-y divide-slate-100">
                    {optimisticReviews.map(review => (
                        <div key={review._id} className="p-6 flex flex-col md:flex-row items-start justify-between hover:bg-slate-50 transition-colors gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-slate-900">{review.productName}</span>
                                    <span className="text-xs text-slate-400">• {review.date}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <RatingStars rating={review.rating} />
                                    <span className="text-sm font-medium text-slate-600">by {review.user}</span>
                                </div>
                                <p className="text-slate-600 italic border-l-2 border-slate-200 pl-3">"{review.comment}"</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <form action={() => handleApprove(review._id)}>
                                    <button
                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 font-medium text-sm"
                                        title="Approve"
                                    >
                                        <ThumbsUp size={16} /> Approve
                                    </button>
                                </form>
                                <form action={() => handleReject(review._id)}>
                                    <button
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 font-medium text-sm"
                                        title="Reject"
                                    >
                                        <Trash2 size={16} /> Reject
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center text-slate-500 flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
                    <p>No pending reviews to moderate.</p>
                </div>
            )}
        </div>
    );
}
