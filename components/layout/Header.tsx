import Link from 'next/link';
import { Leaf, Youtube, Facebook } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50">
            {/* Disclaimer Banner */}
            <div className="bg-slate-900 text-slate-300 py-2.5 px-4 text-center text-[10px] md:text-xs leading-relaxed border-b border-slate-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-x-8 gap-y-0.5">
                    <p>⚠️ Information is for educational purposes and complements, but does not replace, medical treatment.</p>
                    <p className="hidden md:block">🛍️ Products may be affiliate links or custom tools built by Kathleen Heals.</p>
                </div>
            </div>

            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Leaf size={20} />
                        </div>
                        <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900">Kathleen<span className="text-emerald-600">Heals</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
                        <Link href="/glossary" className="hover:text-emerald-600 transition-colors">Glossary</Link>
                        <Link href="/marketplace" className="hover:text-emerald-600 transition-colors">Resources</Link>

                        {/* Submission Links */}
                        <Link href="/submit-testimonial" className="hover:text-emerald-600 transition-colors font-semibold">Testimonial ⭐</Link>
                        <Link href="/share-story" className="hover:text-indigo-600 transition-colors font-semibold">Your Story 💜</Link>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-6 ml-2">
                            <a href="https://www.youtube.com/@KathleenEnergyHealing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                                <Youtube size={18} />
                            </a>
                            <a href="https://www.facebook.com/groups/908078861130495" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <Facebook size={18} />
                            </a>
                        </div>

                        <Link href="/book-session" className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-emerald-700 transition-all ml-4 text-xs md:text-sm">
                            Book a Session
                        </Link>
                    </div>

                    {/* Mobile Menu Icon Placeholder */}
                    <div className="md:hidden text-slate-400">
                        <Leaf size={24} />
                    </div>
                </div>
            </nav>
        </header>
    );
}
