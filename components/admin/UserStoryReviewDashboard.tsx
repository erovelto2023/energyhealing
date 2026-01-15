'use client';

import React, { useState, useEffect } from 'react';
import { BookHeart, Check, X, Eye, EyeOff, Mail, MapPin, Calendar, Loader2, User } from 'lucide-react';

interface UserStory {
    _id: string;
    id: string;
    authorName: string;
    authorInitials?: string;
    email?: string;
    title: string;
    story: string;
    painType?: string;
    duration?: string;
    whatHelped?: string;
    whatDidntHelp?: string;
    currentStatus?: string;
    category?: string;
    location?: string;
    age?: string;
    featured: boolean;
    approved: boolean;
    createdAt?: string;
}

export default function UserStoryReviewDashboard() {
    const [stories, setStories] = useState<UserStory[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expandedStory, setExpandedStory] = useState<string | null>(null);

    useEffect(() => {
        fetchStories();
    }, [filter]);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/user-stories?status=${filter}`);
            const data = await response.json();
            setStories(data.stories || []);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'deny' | 'toggle-featured', featured?: boolean) => {
        setActionLoading(id);
        try {
            const response = await fetch('/api/admin/user-stories', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action, featured }),
            });

            if (response.ok) {
                await fetchStories(); // Refresh list
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

    const pendingCount = stories.filter(s => !s.approved).length;
    const approvedCount = stories.filter(s => s.approved).length;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">User Stories Review</h1>
                <p className="text-slate-600">Review and approve community healing stories before they appear on the website.</p>
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
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Approved ({approvedCount})
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 font-bold transition-all border-b-2 ${filter === 'all'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    All Stories
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-indigo-600" />
                </div>
            ) : stories.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl">
                    <p className="text-slate-500 text-lg">No stories found in this category.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {stories.map((story) => (
                        <div
                            key={story._id}
                            className={`bg-white rounded-2xl border-2 p-6 transition-all ${story.approved
                                    ? 'border-indigo-100 hover:border-indigo-200'
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
                                                <BookHeart size={20} className="text-indigo-600" />
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {story.title}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {story.authorName}
                                                </div>
                                                {story.email && (
                                                    <div className="flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {story.email}
                                                    </div>
                                                )}
                                                {story.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        {story.location}
                                                    </div>
                                                )}
                                                {story.createdAt && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(story.createdAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Metadata Tags */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {story.category && (
                                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">
                                                        {story.category}
                                                    </span>
                                                )}
                                                {story.painType && (
                                                    <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                                                        {story.painType}
                                                    </span>
                                                )}
                                                {story.duration && (
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                                                        Duration: {story.duration}
                                                    </span>
                                                )}
                                                {story.currentStatus && (
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                                                        {story.currentStatus}
                                                    </span>
                                                )}
                                                {story.age && (
                                                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100">
                                                        Age: {story.age}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex gap-2">
                                            {story.approved ? (
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                    Pending
                                                </span>
                                            )}
                                            {story.featured && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Story Preview/Full */}
                                    <div className="mb-4">
                                        <div className={`text-slate-700 leading-relaxed ${expandedStory === story.id ? '' : 'line-clamp-3'}`}>
                                            {story.story}
                                        </div>
                                        {story.story.length > 200 && (
                                            <button
                                                onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                                                className="text-indigo-600 text-sm font-bold mt-2 hover:underline"
                                            >
                                                {expandedStory === story.id ? 'Show less' : 'Read full story'}
                                            </button>
                                        )}
                                    </div>

                                    {/* What Helped / Didn't Help */}
                                    {(story.whatHelped || story.whatDidntHelp) && expandedStory === story.id && (
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            {story.whatHelped && (
                                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                    <p className="text-xs font-bold text-emerald-900 mb-1">What Helped:</p>
                                                    <p className="text-sm text-emerald-700">{story.whatHelped}</p>
                                                </div>
                                            )}
                                            {story.whatDidntHelp && (
                                                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                                    <p className="text-xs font-bold text-red-900 mb-1">What Didn't Help:</p>
                                                    <p className="text-sm text-red-700">{story.whatDidntHelp}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Display Name Preview */}
                                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                                        <strong>Will display as:</strong>{' '}
                                        {story.authorInitials || story.authorName}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    {!story.approved ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(story.id, 'approve', false)}
                                                disabled={actionLoading === story.id}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
                                            >
                                                {actionLoading === story.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check size={16} />
                                                        Approve
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleAction(story.id, 'approve', true)}
                                                disabled={actionLoading === story.id}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-slate-300 transition-colors text-xs"
                                            >
                                                Approve & Feature
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to deny this story? It will be permanently deleted.')) {
                                                        handleAction(story.id, 'deny');
                                                    }
                                                }}
                                                disabled={actionLoading === story.id}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 disabled:bg-slate-300 transition-colors"
                                            >
                                                <X size={16} />
                                                Deny
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(story.id, 'toggle-featured')}
                                            disabled={actionLoading === story.id}
                                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${story.featured
                                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                }`}
                                        >
                                            {actionLoading === story.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : story.featured ? (
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
