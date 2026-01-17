// @ts-nocheck
'use client';
import React from 'react';
import { Star, Award, Info, ShoppingCart, ArrowRight } from 'lucide-react';

const products = [
    {
        id: "B0F28ZTV2W",
        title: "DOREIPA Abdominal Binder for Men and Women",
        description: "Our top pick for general recovery. High elasticity and professional-grade compression make it ideal for hernia support and post-surgery stability.",
        image: "https://m.media-amazon.com/images/I/71rDOa2anGL._AC_UL320_.jpg",
        price: "$24.99",
        rating: 4.6,
        reviews: 269,
        tag: "Editor's Choice",
        category: "Post-Surgery",
        weight: "0.88 lbs",
        link: "https://www.amazon.com/dp/B0F28ZTV2W/?tag=weightlo0f57d-20"
    },
    {
        id: "B0BT98MMCQ",
        title: "Reian Abdominal Binder for Postpartum Recovery",
        description: "Specially designed for the 4th trimester. Lightweight and breathable fabric helps realign abdominal muscles while providing gentle compression for C-section scars.",
        image: "https://m.media-amazon.com/images/I/61qHePPqA7L._AC_UL320_.jpg",
        price: "$19.95",
        rating: 4.3,
        reviews: 792,
        tag: "Best for Moms",
        category: "Postpartum",
        weight: "0.53 lbs",
        link: "https://www.amazon.com/dp/B0BT98MMCQ/?tag=weightlo0f57d-20"
    },
    {
        id: "B09RG6JDCF",
        title: "BraceAbility Plus Size Abdominal Binder",
        description: "Designed specifically for bariatric support. This 12-inch wide binder offers maximum coverage and doesn't roll or bunch, providing stability for larger frames.",
        image: "https://m.media-amazon.com/images/I/71UGLVRN-wL._AC_UL320_.jpg",
        price: "$39.99",
        rating: 4.1,
        reviews: 65,
        tag: "Plus Size King",
        category: "Bariatric",
        weight: "0.48 lbs",
        link: "https://www.amazon.com/dp/B09RG6JDCF/?tag=weightlo0f57d-20"
    },
    {
        id: "B07QH7RRTG",
        title: "Everyday Medical Plus Size Umbilical Belt",
        description: "The gold standard for umbilical hernias. Features a targeted compression pad to prevent protrusion and alleviate localized navel pain.",
        image: "https://m.media-amazon.com/images/I/71w+Ie2PLBL._AC_UL320_.jpg",
        price: "$34.50",
        rating: 4.3,
        reviews: 33,
        tag: "Specialized Relief",
        category: "Hernia Specific",
        weight: "0.55 lbs",
        link: "https://www.amazon.com/dp/B07QH7RRTG/?tag=weightlo0f57d-20"
    },
    {
        id: "B00TZUJOLM",
        title: "OTC Hernia Belt - Select Series",
        description: "A medical-grade classic. Trusted by hospitals for years, this belt provides a low-profile fit that works perfectly under everyday clothing.",
        image: "https://m.media-amazon.com/images/I/71y-ywkq0+L._AC_UL320_.jpg",
        price: "$22.00",
        rating: 4.2,
        reviews: 550,
        tag: "Hospital Choice",
        category: "Medical Grade",
        weight: "0.45 lbs",
        link: "https://www.amazon.com/dp/B00TZUJOLM/?tag=weightlo0f57d-20"
    }
];

const App = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <header className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-1.5 rounded-full text-blue-100 text-sm font-semibold mb-6 border border-blue-400/30">
                        <Award className="w-4 h-4" /> 2024 Verified Physician Recommendations
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        The 5 Best Abdominal Belts for Fast Recovery
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Whether you're recovering from surgery, managing a hernia, or looking for postpartum support, we've reviewed the top medical-grade binders on the market.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#reviews" className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                            View the Rankings
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-16">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" id="reviews">
                    {products.slice(0, 3).map((product, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    {product.tag}
                                </span>
                                <span className="text-slate-400">#{idx + 1}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-700 transition-colors">{product.title}</h3>
                            <div className="flex items-center gap-1 text-amber-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                                ))}
                                <span className="text-slate-500 text-sm ml-1">({product.reviews} reviews)</span>
                            </div>
                            <a href={product.link} className="flex items-center justify-between w-full py-3 px-4 bg-slate-50 rounded-lg font-semibold text-slate-700 hover:bg-blue-600 hover:text-white transition-all">
                                Check Price <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    ))}
                </div>

                <section className="space-y-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold">Comprehensive Product Analysis</h2>
                    </div>

                    {products.map((product, idx) => (
                        <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex flex-col lg:flex-row hover:shadow-md transition-shadow">
                            <div className="lg:w-1/3 bg-slate-50 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                                <div className="relative group">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="max-h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.placeholders.dev/?width=320&height=214&text=Support+Belt&bgColor=%23f1f5f9&textColor=%2364748b';
                                        }}
                                    />
                                    <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                        {idx + 1}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-2/3 p-8 md:p-12">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 uppercase">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                        <Star className="w-4 h-4 fill-current" /> {product.rating} / 5
                                    </div>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 leading-tight">
                                    {product.title}
                                </h3>

                                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Weight</p>
                                        <p className="font-bold text-slate-700">{product.weight}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Reviews</p>
                                        <p className="font-bold text-slate-700">{product.reviews}+</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Ships From</p>
                                        <p className="font-bold text-slate-700">Amazon</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Best Use</p>
                                        <p className="font-bold text-slate-700">Support</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <a
                                        href={product.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                                    >
                                        <ShoppingCart className="w-5 h-5" /> Buy Now on Amazon
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section id="guide" className="mt-24 bg-white p-10 md:p-16 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How to Choose the Right Belt</h2>
                            <p className="text-slate-500">Not all support bands are created equal. Consider these factors before buying.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold">01</div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2">Measure for Comfort</h4>
                                    <p className="text-slate-600 leading-relaxed">Don't use your pants size. Measure around your belly button to get your true abdominal circumference. Most binders like the <b>DOREIPA</b> or <b>BraceAbility</b> have adjustable velcro, but the base size matters.</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">02</div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2">Select Your Width</h4>
                                    <p className="text-slate-600 leading-relaxed">Standard binders are 8-9 inches wide. If you have a longer torso or need bariatric support, look for 12-inch options. This prevents the belt from rolling down when you sit.</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-bold">03</div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2">Breathability is Key</h4>
                                    <p className="text-slate-600 leading-relaxed">If you plan to wear the belt for 8+ hours, ensure it's made of latex-free, moisture-wicking materials like the <b>Reian</b> binder, which is highly rated for skin sensitivity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs py-10 border-t border-slate-200">
                We may earn a small commission on purchases made through our links at no additional cost to you.
            </div>
        </div>
    );
};

export default App;
