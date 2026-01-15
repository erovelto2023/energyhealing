import Link from 'next/link';
import { Leaf, Youtube, Facebook, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                                <Leaf size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Kathleen<span className="text-emerald-500">Heals</span></span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
                            Empowering individuals to take control of their health through energetic awareness and evidence-based healing practices. Natural relief through energy and intentionality.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.youtube.com/@KathleenEnergyHealing" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors cursor-pointer text-slate-400 hover:text-white group">
                                <Youtube size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.facebook.com/groups/908078861130495" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-colors cursor-pointer text-slate-400 hover:text-white group">
                                <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 transition-colors cursor-pointer text-slate-400 hover:text-white group">
                                <Heart size={18} className="group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-emerald-500">Learn</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><Link href="/marketplace" className="hover:text-white transition-colors">Resource Library</Link></li>
                            <li><Link href="/glossary" className="hover:text-white transition-colors">Healing Glossary</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Wellness Blog</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Kathleen</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-emerald-500">Support</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                            <li><Link href="/book-session" className="hover:text-white transition-colors">Book a Session</Link></li>
                            <li><Link href="/submit-testimonial" className="hover:text-emerald-400 transition-colors font-bold">Testimonial About Kathleen ⭐</Link></li>
                            <li><Link href="/share-story" className="hover:text-indigo-400 transition-colors font-bold">Tell Your Healing Story 💜</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-10 text-center text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-bold">
                    <p>&copy; {new Date().getFullYear()} Kathleen Heals. Information on this site is for educational purposes only.</p>
                </div>
            </div>
        </footer>
    );
}
