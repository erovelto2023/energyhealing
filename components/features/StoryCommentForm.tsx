'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface StoryCommentFormProps {
    storyId: string;
    onCommentSubmitted?: () => void;
}

export default function StoryCommentForm({ storyId, onCommentSubmitted }: StoryCommentFormProps) {
    const [formData, setFormData] = useState({
        authorName: '',
        email: '',
        commentText: '',
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/story-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storyId,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Thank you! Your comment has been submitted and will appear after review.');
                setFormData({ authorName: '', email: '', commentText: '' });
                if (onCommentSubmitted) onCommentSubmitted();
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please check your connection and try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <CheckCircle size={40} className="mx-auto text-emerald-600 mb-3" />
                <p className="text-emerald-800 font-semibold mb-2">Comment Submitted!</p>
                <p className="text-emerald-700 text-sm mb-4">{message}</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-emerald-600 text-sm font-bold hover:underline"
                >
                    Leave another comment
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Your Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.authorName}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Email (Optional)
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="your@email.com"
                    />
                    <p className="text-xs text-slate-500 mt-1">Not displayed publicly</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Your Comment *
                </label>
                <textarea
                    required
                    value={formData.commentText}
                    onChange={(e) => setFormData({ ...formData, commentText: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Share your thoughts, encouragement, or similar experiences..."
                    maxLength={500}
                />
                <p className="text-xs text-slate-500 mt-1">{formData.commentText.length}/500 characters</p>
            </div>

            {status === 'error' && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700">{message}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                {status === 'submitting' ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send size={18} />
                        Post Comment
                    </>
                )}
            </button>

            <p className="text-xs text-center text-slate-500">
                Your comment will be reviewed before appearing publicly.
            </p>
        </form>
    );
}
