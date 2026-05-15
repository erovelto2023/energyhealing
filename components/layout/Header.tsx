"use client";

import Link from 'next/link';
import { Leaf, YoutubeIcon as Youtube, FacebookIcon as Facebook, Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

const NAV_LINKS = [
    { name: 'Blog', href: '/blog' },
    { name: 'Glossary', href: '/glossary' },
    { name: 'Questions / FAQ', href: '/questions' },
    { name: 'Daily Affirmations', href: '/affirmations' },
    { name: 'Herbs and Plants', href: '/healing-pantry' },
    { name: 'Resources', href: '/marketplace' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Your Story', href: '/stories' },
];

export default function Header() {
    const [open, setOpen] = useState(false);

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
                <div className="w-full px-4 lg:px-12 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Leaf size={20} />
                        </div>
                        <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900">Kathleen<span className="text-emerald-600">Heals</span></span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-emerald-600 transition-colors">{link.name}</Link>
                        ))}

                        {/* Social Links */}
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                            <a href="https://www.youtube.com/@KathleenEnergyHealing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                                <Youtube size={18} />
                            </a>
                            <a href="https://www.facebook.com/groups/908078861130495" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <Facebook size={18} />
                            </a>
                        </div>

                        <Link href="/book-session" className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-emerald-700 transition-all text-xs md:text-sm whitespace-nowrap">
                            Book a Session
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button className="p-2 text-slate-600 hover:text-emerald-600 transition-colors">
                                    <Menu size={24} />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
                                <SheetHeader className="mb-8">
                                    <SheetTitle className="text-left flex items-center gap-2">
                                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                                            <Leaf size={16} />
                                        </div>
                                        <span className="text-xl font-bold tracking-tight text-slate-900">Kathleen<span className="text-emerald-600">Heals</span></span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 text-lg font-medium text-slate-600">
                                    {NAV_LINKS.map((link) => (
                                        <Link 
                                            key={link.href} 
                                            href={link.href} 
                                            className="hover:text-emerald-600 transition-colors"
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="h-px bg-slate-100 my-2" />
                                    <div className="flex items-center gap-6">
                                        <a href="https://www.youtube.com/@KathleenEnergyHealing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                                            <Youtube size={24} />
                                        </a>
                                        <a href="https://www.facebook.com/groups/908078861130495" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                                            <Facebook size={24} />
                                        </a>
                                    </div>
                                    <Link 
                                        href="/book-session" 
                                        className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-emerald-700 transition-all text-center font-bold"
                                        onClick={() => setOpen(false)}
                                    >
                                        Book a Session
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </header>
    );
}
