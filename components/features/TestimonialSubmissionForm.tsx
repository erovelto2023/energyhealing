'use client';

import React, { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestimonialSubmissionForm() {
    const [formData, setFormData] = useState({
        clientName: '',
        email: '',
        rating: 5,
        testimonialText: '',
        issue: '',
        outcome: '',
        sessionType: '',
        location: '',
        allowPublicName: false,
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/testimonials/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Thank you! Your testimonial has been submitted and will be reviewed shortly.');
                // Reset form
                setFormData({
                    clientName: '',
                    email: '',
                    rating: 5,
                    testimonialText: '',
                    issue: '',
                    outcome: '',
                    sessionType: '',
                    location: '',
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

    const renderStars = () => {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-110"
                    >
                        <Star
                            size={32}
                            className={star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (status === 'success') {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-emerald-100">
                <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Thank You!</h3>
                    <p className="text-slate-600 mb-6">{message}</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                        Submit Another Testimonial
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Share Your Experience</h2>
                <p className="text-slate-600">
                    Your story can inspire others on their healing journey. All testimonials are reviewed before publishing.
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
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Sarah Martinez"
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
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="sarah@example.com"
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
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="allowPublicName" className="text-sm text-slate-700">
                        <span className="font-bold">Display my full name publicly</span>
                        <br />
                        <span className="text-slate-500">
                            If unchecked, we'll use your initials (e.g., "S.M.") for privacy
                        </span>
                    </label>
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                        Your Rating *
                    </label>
                    {renderStars()}
                </div>

                {/* Testimonial Text */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Your Testimonial *
                    </label>
                    <textarea
                        required
                        value={formData.testimonialText}
                        onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        placeholder="Share your experience with Kathleen's healing work..."
                        maxLength={500}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        {formData.testimonialText.length}/500 characters
                    </p>
                </div>

                {/* Issue & Outcome */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            What brought you to Kathleen?
                        </label>
                        <input
                            type="text"
                            value={formData.issue}
                            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g., Chronic back pain"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            What was the outcome?
                        </label>
                        <input
                            type="text"
                            value={formData.outcome}
                            onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g., 70% pain reduction"
                        />
                    </div>
                </div>

                {/* Session Type & Location */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Session Type
                        </label>
                        <select
                            value={formData.sessionType}
                            onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="">Select type...</option>
                            <option value="Energy Healing">Energy Healing</option>
                            <option value="Reiki">Reiki</option>
                            <option value="Chakra Balancing">Chakra Balancing</option>
                            <option value="Meridian Therapy">Meridian Therapy</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Your Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="City, State"
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
                    className="w-full bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                    {status === 'submitting' ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Submit Testimonial
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-slate-500">
                    By submitting, you agree to allow Kathleen Heals to publish your testimonial on this website and marketing materials.
                </p>
            </form>
        </div>
    );
}
