'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function FAQSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(() => {
            if (query) {
                router.push(`/questions?q=${encodeURIComponent(query)}&page=1`);
            } else {
                router.push('/questions');
            }
        });
    };

    return (
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-12">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`text-slate-400 group-focus-within:text-blue-500 transition-colors ${isPending ? 'animate-pulse' : ''}`} size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search knowledge base (e.g. 'yoga', 'anxiety')..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={isPending}
                >
                    {isPending ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
}
