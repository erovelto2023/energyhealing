import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Sparkles, Award, BookHeart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Kathleen | Energy Healing Practitioner',
    description: 'Meet Kathleen, a dedicated energy healing practitioner committed to helping you find relief from chronic pain and emotional stress.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-emerald-100">
                        <Heart size={14} />
                        About Kathleen
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Meet Your Energy Healing Guide
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Dedicated to helping you find relief, restore balance, and reconnect with your inner healing power.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 md:p-12 mb-12">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Welcome, I'm Kathleen</h2>

                        <p className="text-slate-700 leading-relaxed mb-6">
                            I'm so grateful you're here. My journey into energy healing began with my own experience of chronic pain and the search for relief that truly worked. After years of trying conventional treatments with limited success, I discovered the transformative power of energy healing—and it changed everything.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-6">
                            Today, I'm passionate about sharing this gift with others who are struggling with pain, stress, and disconnection from their bodies. I believe that healing is not just possible—it's your birthright. And I'm here to support you every step of the way.
                        </p>

                        <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-12">My Approach</h3>

                        <p className="text-slate-700 leading-relaxed mb-6">
                            My work bridges ancient wisdom with modern understanding. I combine energy healing techniques with practical, grounded guidance to help you:
                        </p>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl">✓</span>
                                <span className="text-slate-700">Release stored pain and trauma from your energy field</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl">✓</span>
                                <span className="text-slate-700">Restore balance to your chakras and meridians</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl">✓</span>
                                <span className="text-slate-700">Develop self-care practices for ongoing healing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl">✓</span>
                                <span className="text-slate-700">Reconnect with your body's innate wisdom</span>
                            </li>
                        </ul>

                        <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-12">My Commitment to You</h3>

                        <p className="text-slate-700 leading-relaxed mb-6">
                            Your well-being is my highest priority. I offer a 100% money-back guarantee on all sessions because I truly believe in the power of this work. If you don't feel better or lighter by the end of your session, simply let me know—and I'll offer you a full refund, no questions asked.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-6">
                            I want you to feel confident and safe in choosing to work with me. Your journey toward self-love and healing matters, and I'm deeply honored to be part of it.
                        </p>

                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 mt-12">
                            <p className="text-slate-700 leading-relaxed mb-4 italic">
                                "Take the first step toward your healing today. I'm here for you."
                            </p>
                            <p className="text-emerald-700 font-semibold">
                                With love and presence,<br />
                                Kathleen
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles size={24} className="text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Personalized Care</h3>
                        <p className="text-sm text-slate-600">Every session is tailored to your unique needs and healing journey.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Award size={24} className="text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Money-Back Guarantee</h3>
                        <p className="text-sm text-slate-600">100% satisfaction guaranteed. Your healing is my priority.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <BookHeart size={24} className="text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Compassionate Support</h3>
                        <p className="text-sm text-slate-600">A safe, nurturing space for your healing and transformation.</p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-emerald-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Begin Your Healing Journey?</h3>
                    <p className="text-slate-600 mb-6">Book a session and experience the transformative power of energy healing.</p>
                    <Link href="/book-session" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                        Book Your Session
                    </Link>
                </div>
            </div>
        </div>
    );
}
