"use client";

import React, { useRef, useState } from 'react';
import { submitReview } from '@/lib/actions';
import { Star } from 'lucide-react';

export default function ReviewForm({ productId, productName }: { productId: number, productName: string }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [rating, setRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        formData.append('productId', String(productId));
        formData.append('productName', productName);
        formData.append('rating', String(rating));

        const res = await submitReview(formData);
        if (res?.success) {
            setSubmitted(true);
            formRef.current?.reset();
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center animate-in fade-in">
                <h3 className="text-green-800 font-bold text-lg mb-2">Review Submitted!</h3>
                <p className="text-green-700">Thanks! Your review is pending approval.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-green-800 underline">Write another</button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Write a Review</h3>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                        <input
                            name="user"
                            type="text"
                            required
                            placeholder="Recommended: First Name & Last Initial"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                        <div className="flex space-x-2 items-center py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        size={24}
                                        fill={star <= rating ? "#FACC15" : "none"}
                                        className={star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
                    <textarea
                        name="comment"
                        required
                        rows={4}
                        placeholder="What did you like or dislike about this tool?"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transform hover:-translate-y-0.5 transition-all shadow-md"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}
