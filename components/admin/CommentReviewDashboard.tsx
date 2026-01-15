'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Check, X, ExternalLink, Loader2, Calendar, User, Mail } from 'lucide-react';

interface Comment {
    _id: string;
    id: string;
    storyId: string;
    authorName: string;
    email?: string;
    commentText: string;
    approved: boolean;
    createdAt?: string;
}

export default function CommentReviewDashboard() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, [filter]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/comments?status=${filter}`);
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'deny') => {
        setActionLoading(id);
        try {
            const response = await fetch('/api/admin/comments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action }),
            });

            if (response.ok) {
                await fetchComments(); // Refresh list
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

    const pendingCount = comments.filter(c => !c.approved).length;
    const approvedCount = comments.filter(c => c.approved).length;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Comment Review</h1>
                <p className="text-slate-600">Review and approve comments on healing stories before they appear publicly.</p>
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
                    All Comments
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-indigo-600" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl">
                    <p className="text-slate-500 text-lg">No comments found in this category.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className={`bg-white rounded-2xl border-2 p-6 transition-all ${comment.approved
                                    ? 'border-emerald-100 hover:border-emerald-200'
                                    : 'border-amber-100 hover:border-amber-200'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-6">
                                {/* Content */}
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <MessageCircle size={18} className="text-indigo-600" />
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    Comment on Story
                                                </h3>
                                                <Link
                                                    href={`/stories/${comment.storyId}`}
                                                    target="_blank"
                                                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                                                >
                                                    View Story <ExternalLink size={14} />
                                                </Link>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {comment.authorName}
                                                </div>
                                                {comment.email && (
                                                    <div className="flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {comment.email}
                                                    </div>
                                                )}
                                                {comment.createdAt && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div>
                                            {comment.approved ? (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Comment Text */}
                                    <div className="p-4 bg-slate-50 rounded-xl mb-4">
                                        <p className="text-slate-700 leading-relaxed">
                                            {comment.commentText}
                                        </p>
                                    </div>

                                    {/* Story ID */}
                                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                                        <strong>Story ID:</strong> {comment.storyId}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {!comment.approved && (
                                    <div className="flex flex-col gap-2 min-w-[120px]">
                                        <button
                                            onClick={() => handleAction(comment.id, 'approve')}
                                            disabled={actionLoading === comment.id}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:bg-slate-300 transition-colors"
                                        >
                                            {actionLoading === comment.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Check size={16} />
                                                    Approve
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to deny this comment? It will be permanently deleted.')) {
                                                    handleAction(comment.id, 'deny');
                                                }
                                            }}
                                            disabled={actionLoading === comment.id}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 disabled:bg-slate-300 transition-colors"
                                        >
                                            <X size={16} />
                                            Deny
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
