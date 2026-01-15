'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BookingFormProps {
    initialService?: string;
    selectedDate?: Date;
    selectedTime?: string;
    onSuccess?: () => void;
}

export default function BookingForm({
    initialService = 'Remote Healing',
    selectedDate,
    selectedTime,
    onSuccess
}: BookingFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: initialService,
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate || !selectedTime) {
            alert('Please select a date and time on the calendar first.');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    bookingDate: format(selectedDate, 'yyyy-MM-dd'),
                    bookingTime: selectedTime
                })
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', service: initialService, message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        const resetAll = () => {
            if (onSuccess) onSuccess();
            setStatus('idle');
        };

        return (
            <div className="bg-white rounded-[2.5rem] border border-emerald-100 p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Request Received!</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-light leading-relaxed">
                    Thank you for reaching out. We've received your booking request for <br />
                    <span className="font-bold text-emerald-600">
                        {selectedDate ? format(selectedDate, 'MMMM do, yyyy') : 'Recently Selected Date'} at {selectedTime} PST
                    </span>. <br />
                    We'll confirm via email shortly.
                </p>
                <button
                    onClick={resetAll}
                    className="text-emerald-600 font-bold hover:underline bg-emerald-50 px-6 py-3 rounded-full transition-all hover:bg-emerald-100"
                >
                    Book another session
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-200/50">
            {/* Summary of Selection */}
            <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-slate-50">
                <div className="bg-emerald-50 px-6 py-3 rounded-2xl flex items-center gap-3 text-emerald-700">
                    <CalendarIcon size={18} />
                    <span className="font-bold text-sm">
                        {selectedDate ? format(selectedDate, 'MMM do, yyyy') : 'No date selected'}
                    </span>
                </div>
                <div className="bg-indigo-50 px-6 py-3 rounded-2xl flex items-center gap-3 text-indigo-700">
                    <Clock size={18} />
                    <span className="font-bold text-sm">
                        {selectedTime ? `${selectedTime} PST` : 'No time selected'}
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                        placeholder="john@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number (Optional)</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Session Type</label>
                    <select
                        required
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all appearance-none font-medium"
                    >
                        <option value="Remote Healing">Remote Healing (60 min)</option>
                        <option value="Deep Breakthrough">Deep Breakthrough (90 min)</option>
                        <option value="Discovery Call">Discovery Call (Free)</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2 mb-8">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">What would you like to focus on?</label>
                <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all resize-none font-medium"
                    placeholder="Briefly describe what you're hoping to achieve..."
                />
            </div>

            {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-sm mb-6 bg-red-50 p-4 rounded-xl">
                    <AlertCircle size={18} />
                    Something went wrong. Please try again or contact support.
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'loading' || !selectedDate || !selectedTime}
                className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-200 disabled:opacity-50 disabled:bg-slate-300"
            >
                {status === 'loading' ? 'Processing...' : (
                    <>
                        Confirm {selectedTime ? `Session at ${selectedTime}` : 'Selection'} <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>

            {!selectedDate && (
                <p className="text-center text-xs text-slate-400 mt-4 italic font-medium">Please select a date and time on the calendar above to enable booking.</p>
            )}
        </form>
    );
}
