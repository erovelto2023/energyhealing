'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, X, Eye, EyeOff, Mail, MapPin, Calendar, Loader2 } from 'lucide-react';

interface Testimonial {
    _id: string;
    id: string;
    clientName: string;
    clientInitials?: string;
    email?: string;
    rating: number;
    testimonialText: string;
    issue?: string;
    outcome?: string;
    sessionType?: string;
    location?: string;
    featured: boolean;
    approved: boolean;
    date?: string;
    createdAt?: string;
}

export default function TestimonialReviewDashboard() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchTestimonials();
    }, [filter]);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/testimonials?status=${filter}`);
            const data = await response.json();
            setTestimonials(data.testimonials || []);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'deny' | 'toggle-featured', featured?: boolean) => {
        setActionLoading(id);
        try {
            const response = await fetch('/api/admin/testimonials', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action, featured }),
            });

            if (response.ok) {
                await fetchTestimonials(); // Refresh list
            } else {
                alert('Action failed. Please try again.');
            }
        } catch (error) {
            console.error('Action error:', error);
            alert('Network error. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

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

    const pendingCount = testimonials.filter(t => !t.approved).length;
    const approvedCount = testimonials.filter(t => t.approved).length;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Testimonial Review</h1>
                <p className="text-slate-600">Review and approve client testimonials before they appear on the website.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-6 py-3 font-bold transition-all border-b-2 ${filter === 'pending'
                            ? 'border-amber-500 text-amber-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Pending Review
                    {pendingCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                            {pendingCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-6 py-3 font-bold transition-all border-b-2 ${filter === 'approved'
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Approved ({approvedCount})
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 font-bold transition-all border-b-2 ${filter === 'all'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    All Testimonials
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-emerald-600" />
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl">
                    <p className="text-slate-500 text-lg">No testimonials found in this category.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial._id}
                            className={`bg-white rounded-2xl border-2 p-6 transition-all ${testimonial.approved
                                    ? 'border-emerald-100 hover:border-emerald-200'
                                    : 'border-amber-100 hover:border-amber-200'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-6">
                                {/* Content */}
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {testimonial.clientName}
                                                </h3>
                                                {renderStars(testimonial.rating)}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                {testimonial.email && (
                                                    <div className="flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {testimonial.email}
                                                    </div>
                                                )}
                                                {testimonial.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        {testimonial.location}
                                                    </div>
                                                )}
                                                {testimonial.createdAt && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(testimonial.createdAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex gap-2">
                                            {testimonial.approved ? (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                    Pending
                                                </span>
                                            )}
                                            {testimonial.featured && (
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Testimonial Text */}
                                    <blockquote className="text-slate-700 leading-relaxed mb-4 italic">
                                        "{testimonial.testimonialText}"
                                    </blockquote>

                                    {/* Issue & Outcome Tags */}
                                    {(testimonial.issue || testimonial.outcome || testimonial.sessionType) && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {testimonial.issue && (
                                                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                                                    Issue: {testimonial.issue}
                                                </span>
                                            )}
                                            {testimonial.outcome && (
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                                                    Outcome: {testimonial.outcome}
                                                </span>
                                            )}
                                            {testimonial.sessionType && (
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
                                                    {testimonial.sessionType}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Display Name Preview */}
                                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                                        <strong>Will display as:</strong>{' '}
                                        {testimonial.clientInitials || testimonial.clientName}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    {!testimonial.approved ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(testimonial.id, 'approve', false)}
                                                disabled={actionLoading === testimonial.id}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:bg-slate-300 transition-colors"
                                            >
                                                {actionLoading === testimonial.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check size={16} />
                                                        Approve
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleAction(testimonial.id, 'approve', true)}
                                                disabled={actionLoading === testimonial.id}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-colors text-xs"
                                            >
                                                Approve & Feature
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to deny this testimonial? It will be permanently deleted.')) {
                                                        handleAction(testimonial.id, 'deny');
                                                    }
                                                }}
                                                disabled={actionLoading === testimonial.id}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 disabled:bg-slate-300 transition-colors"
                                            >
                                                <X size={16} />
                                                Deny
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(testimonial.id, 'toggle-featured')}
                                            disabled={actionLoading === testimonial.id}
                                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${testimonial.featured
                                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                                }`}
                                        >
                                            {actionLoading === testimonial.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : testimonial.featured ? (
                                                <>
                                                    <EyeOff size={16} />
                                                    Unfeature
                                                </>
                                            ) : (
                                                <>
                                                    <Eye size={16} />
                                                    Feature
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
