'use client';

import React, { useState } from 'react';
import { BookHeart, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserStorySubmissionForm() {
    const [formData, setFormData] = useState({
        authorName: '',
        email: '',
        title: '',
        story: '',
        painType: '',
        duration: '',
        whatHelped: '',
        whatDidntHelp: '',
        currentStatus: '',
        category: '',
        location: '',
        age: '',
        allowPublicName: false,
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/user-stories/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Thank you for sharing your story! It will be reviewed and published soon.');
                // Reset form
                setFormData({
                    authorName: '',
                    email: '',
                    title: '',
                    story: '',
                    painType: '',
                    duration: '',
                    whatHelped: '',
                    whatDidntHelp: '',
                    currentStatus: '',
                    category: '',
                    location: '',
                    age: '',
                    allowPublicName: false,
                });
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
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-indigo-100">
                <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Story Submitted!</h3>
                    <p className="text-slate-600 mb-6">{message}</p>
                    <p className="text-sm text-slate-500 mb-6">
                        Your story will inspire others who are on similar healing journeys.
                        We'll review it and publish it to our community stories page soon.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                    >
                        Share Another Story
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <BookHeart size={24} className="text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Share Your Story</h2>
                        <p className="text-sm text-slate-500">Your journey can inspire and connect with others</p>
                    </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                    This is a space to share your personal healing journey - your struggles, what you've tried,
                    and where you are now. Your story isn't about reviewing services, but about connecting with
                    others who understand what you're going through.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
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
                            Email Address *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="your@email.com"
                        />
                        <p className="text-xs text-slate-500 mt-1">For verification only, not published</p>
                    </div>
                </div>

                {/* Privacy Option */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <input
                        type="checkbox"
                        id="allowPublicName"
                        checked={formData.allowPublicName}
                        onChange={(e) => setFormData({ ...formData, allowPublicName: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="allowPublicName" className="text-sm text-slate-700">
                        <span className="font-bold">Display my full name publicly</span>
                        <br />
                        <span className="text-slate-500">
                            If unchecked, we'll use your initials for privacy
                        </span>
                    </label>
                </div>

                {/* Story Title */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Story Title *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g., My Journey with Chronic Pain"
                        maxLength={100}
                    />
                    <p className="text-xs text-slate-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                {/* Your Story */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Your Story *
                    </label>
                    <textarea
                        required
                        value={formData.story}
                        onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                        rows={10}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        placeholder="Share your journey... What challenges have you faced? What have you learned? Where are you now?"
                        maxLength={3000}
                    />
                    <p className="text-xs text-slate-500 mt-1">{formData.story.length}/3000 characters</p>
                </div>

                {/* Pain Type & Duration */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            What are you dealing with?
                        </label>
                        <input
                            type="text"
                            value={formData.painType}
                            onChange={(e) => setFormData({ ...formData, painType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g., Chronic migraines, anxiety"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            How long?
                        </label>
                        <input
                            type="text"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g., 5 years, since childhood"
                        />
                    </div>
                </div>

                {/* What Helped / Didn't Help */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            What has helped?
                        </label>
                        <textarea
                            value={formData.whatHelped}
                            onChange={(e) => setFormData({ ...formData, whatHelped: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="Treatments, practices, or approaches that have helped..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            What hasn't worked?
                        </label>
                        <textarea
                            value={formData.whatDidntHelp}
                            onChange={(e) => setFormData({ ...formData, whatDidntHelp: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="Things you've tried that didn't help..."
                        />
                    </div>
                </div>

                {/* Current Status & Category */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Where are you now?
                        </label>
                        <select
                            value={formData.currentStatus}
                            onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">Select status...</option>
                            <option value="Still searching for relief">Still searching for relief</option>
                            <option value="Managing symptoms">Managing symptoms</option>
                            <option value="Seeing improvement">Seeing improvement</option>
                            <option value="Mostly healed">Mostly healed</option>
                            <option value="Fully recovered">Fully recovered</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Story Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">Select category...</option>
                            <option value="Physical Pain">Physical Pain</option>
                            <option value="Emotional Healing">Emotional Healing</option>
                            <option value="Spiritual Journey">Spiritual Journey</option>
                            <option value="Mental Health">Mental Health</option>
                            <option value="Chronic Illness">Chronic Illness</option>
                            <option value="Recovery">Recovery</option>
                        </select>
                    </div>
                </div>

                {/* Optional: Location & Age */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Location (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="City, State"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Age (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g., 35 or 30-40"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle size={20} className="text-red-600 mt-0.5" />
                        <p className="text-sm text-red-700">{message}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                    {status === 'submitting' ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Share My Story
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-slate-500">
                    By submitting, you agree to allow your story to be published on this website to inspire and connect with others in the healing community.
                </p>
            </form>
        </div>
    );
}
