"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, Plus, ExternalLink } from 'lucide-react';
import { IProduct } from '@/lib/models/Product';
import { UserButton } from '@clerk/nextjs';
import OutboundLink from '@/components/ui/OutboundLink';
/* eslint-disable @next/next/no-img-element */

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-0.5 text-yellow-400">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < Math.round(rating) ? "currentColor" : "none"}
                className={i < Math.round(rating) ? "" : "text-gray-300"}
            />
        ))}
        <span className="text-xs text-slate-500 ml-1 font-medium">{rating}</span>
    </div>
);

interface ProductCardProps {
    product: IProduct;
    onCompare?: (id: number) => void;
    isCompared?: boolean;
}

export default function ProductCard({ product, onCompare, isCompared }: ProductCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden">

            {/* Deal Banner */}
            {product.deal && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg shadow-sm z-10">
                    Deal
                </div>
            )}

            {/* Compare Checkbox */}
            {onCompare && (
                <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onCompare(product.id);
                        }}
                        className={`p-1.5 rounded-full transition-all shadow-sm ${isCompared
                            ? 'bg-blue-600 text-white scale-110'
                            : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400'
                            }`}
                        title="Add to Compare"
                    >
                        {isCompared ? <Check size={14} /> : <Plus size={14} />}
                    </button>
                </div>
            )}

            {/* Card Header */}
            <div className="p-5 flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md ${product.logoColor}`}>
                        {product.name.substring(0, 2)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">{product.category}</p>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <Link href={`/tool/${product.slug || product.id}`} className="px-5 pb-4 flex-grow block">
                <div className="mb-3">
                    <RatingStars rating={product.rating} />
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {product.shortDescription || product.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            </Link>

            {/* Card Footer */}
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl mt-auto flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">{product.priceModel}</span>
                    {product.startingPrice && <span className="text-xs text-slate-500">From ${product.startingPrice}</span>}
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/tool/${product.slug || product.id}`}
                        className="flex-1 text-center py-2 px-4 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        Details
                    </Link>
                    <OutboundLink
                        href={product.affiliateLink || "#"}
                        productId={product.id}
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-blue-200 hover:shadow-lg"
                    >
                        <span>{product.ctaButtonText || "Visit"}</span>
                        <ExternalLink size={14} />
                    </OutboundLink>
                </div>
            </div>
        </div>
    );
}
