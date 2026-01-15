"use client";

import React, { useState, Suspense } from 'react';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';
import { IProduct } from '@/lib/models/Product';
import { BarChart2, Check, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

function PaginationControls({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-12 space-x-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center px-4 font-medium text-slate-600">
                Page {currentPage} of {totalPages}
            </div>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}

export default function ProductBrowser({ products, currentPage = 1, totalPages = 1 }: { products: IProduct[], currentPage?: number, totalPages?: number }) {
    const [compareList, setCompareList] = useState<number[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const toggleCompare = (productId: number) => {
        setCompareList(prev => {
            if (prev.includes(productId)) return prev.filter(id => id !== productId);
            if (prev.length >= 3) return prev; // Limit to 3
            return [...prev, productId];
        });
    };

    const comparisonProducts = products.filter(p => compareList.includes(p.id));

    return (
        <div>
            <FilterBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onCompare={toggleCompare}
                                isCompared={compareList.includes(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-slate-100 p-6 rounded-full mb-4">
                            <Search size={48} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No tools found</h3>
                        <p className="text-slate-500 mt-2 max-w-sm">We couldn't find any tools matching your filters. Try adjusting your search criteria.</p>
                        <Link href="/" className="mt-6 text-blue-600 font-medium hover:underline">Clear all filters</Link>
                    </div>
                )}

                <Suspense fallback={null}>
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} />
                </Suspense>
            </div>

            {/* Comparison Floating Bar */}
            <AnimatePresence>
                {compareList.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40 p-4"
                    >
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-slate-900">{compareList.length} items selected</span>
                                <div className="flex -space-x-2">
                                    {comparisonProducts.map(p => (
                                        <div key={p.id} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold ${p.logoColor}`}>
                                            {p.name.substring(0, 2)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setCompareList([])}
                                    className="text-sm text-slate-500 hover:text-slate-800 font-medium px-3"
                                >
                                    Clear
                                </button>
                                <button
                                    disabled={compareList.length < 2}
                                    onClick={() => setShowCompareModal(true)}
                                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${compareList.length < 2
                                        ? 'bg-slate-300 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                                        }`}
                                >
                                    <BarChart2 size={16} />
                                    <span>Compare</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Modal */}
            {showCompareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setShowCompareModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                            <h2 className="text-xl font-bold flex items-center text-slate-800">
                                <BarChart2 className="mr-2 text-blue-600" /> Tool Comparison
                            </h2>
                            <button onClick={() => setShowCompareModal(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b-2 border-slate-100 min-w-[150px]"></th>
                                        {comparisonProducts.map(p => (
                                            <th key={p.id} className="p-4 border-b-2 border-slate-100 min-w-[200px]">
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold mb-2 ${p.logoColor}`}>
                                                        {p.name.substring(0, 2)}
                                                    </div>
                                                    <span className="font-bold text-lg text-slate-900">{p.name}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Render dynamically similar to user code */}
                                    <tr>
                                        <td className="p-4 font-bold text-slate-500">Rating</td>
                                        {comparisonProducts.map(p => (
                                            <td key={p.id} className="p-4 text-center text-slate-800">{p.rating} / 5</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-slate-500">Price Model</td>
                                        {comparisonProducts.map(p => (
                                            <td key={p.id} className="p-4 text-center"><span className="inline-block px-2 py-1 bg-slate-100 rounded text-sm font-medium">{p.priceModel}</span></td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-slate-500 align-top">Pros</td>
                                        {comparisonProducts.map(p => (
                                            <td key={p.id} className="p-4 align-top">
                                                <ul className="space-y-1">
                                                    {p.pros.slice(0, 3).map((pro, i) => (
                                                        <li key={i} className="text-xs text-green-700 flex items-start"><Check size={12} className="mr-1 mt-0.5 flex-shrink-0" /> {pro}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-4"></td>
                                        {comparisonProducts.map(p => (
                                            <td key={p.id} className="p-4 text-center">
                                                <Link href={`/tool/${p.id}`} className="block w-full bg-blue-600 text-white text-sm font-bold py-2 rounded hover:bg-blue-700 transition-colors">
                                                    View Details
                                                </Link>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
