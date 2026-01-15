"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NICHES, PRICE_MODELS } from '@/lib/constants';

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedNiche = searchParams.get('niche') || 'all';
    const selectedPriceModel = searchParams.get('priceModel') || 'all';

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'all') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        // Perform search
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="bg-white shadow-sm border-b border-slate-100 sticky top-16 z-40 backdrop-blur-sm bg-white/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 overflow-x-auto no-scrollbar">

                {/* Niche Filter */}
                <div className="flex space-x-2 items-center flex-shrink-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Niche:</span>
                    {NICHES.map(niche => (
                        <button
                            key={niche.id}
                            onClick={() => updateFilter('niche', niche.id)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 mobile-tap-highlight ${selectedNiche === niche.id
                                    ? 'bg-slate-800 text-white shadow-md transform scale-105'
                                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                        >
                            {niche.label}
                        </button>
                    ))}
                </div>

                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

                {/* Price Filter */}
                <div className="flex space-x-2 items-center flex-shrink-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Price:</span>
                    <div className="flex space-x-2">
                        {PRICE_MODELS.map(model => (
                            <button
                                key={model.id}
                                onClick={() => updateFilter('priceModel', model.id)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selectedPriceModel === model.id
                                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-blue-200'
                                    }`}
                            >
                                {model.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
