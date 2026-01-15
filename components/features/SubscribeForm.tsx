"use client";

import { useState } from 'react';
import { subscribeUser } from '@/lib/actions';

export default function SubscribeForm() {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(formData: FormData) {
        setStatus('loading');
        const result = await subscribeUser(formData);

        if (result.success) {
            setStatus('success');
            setMessage(result.message || 'Subscribed!');
        } else if (result.error) {
            setStatus('error');
            setMessage(result.error as string);
        } else if (result.message) {
            // Already subscribed case
            setStatus('success');
            setMessage(result.message as string);
        }
    }

    return (
        <div className="relative z-10 max-w-md mx-auto">
            {status === 'success' ? (
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg font-medium">
                    {message}
                </div>
            ) : (
                <form action={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 rounded-lg text-slate-900 bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-70 whitespace-nowrap"
                    >
                        {status === 'loading' ? 'Joining...' : 'Subscribe'}
                    </button>
                </form>
            )}
            {status === 'error' && (
                <p className="text-red-300 text-sm mt-2">{message}</p>
            )}
        </div>
    );
}
