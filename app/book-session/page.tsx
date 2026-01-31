import { Metadata } from 'next';
import Script from 'next/script';
import { Sparkles, CheckCircle, Heart, Shield, Clock, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Book Your Healing Session - $111 | Kathleen Heals',
    description: 'Transform your life with a personalized 60-minute energy healing session. 100% money-back guarantee. Virtual sessions over phone.',
};

export default function BookSessionPage() {
    return (
        <>
            {/* GrooveSell Tracking Pixel */}
            <img
                src="https://tracking.groovesell.com/salespage/tracking/91728"
                style={{ border: '0px', width: '0px', height: '0px' }}
                alt=""
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500 rounded-full blur-3xl opacity-10" />

                    <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
                            <Sparkles size={14} />
                            Transform Your Life Today
                        </div>

                        <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
                            Book Your Healing Session<br />with Confidence!
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                            I'm so excited to invite you on a transformative healing journey with me. My sessions are designed to help you feel lighter, more at peace, and deeply connected to your inner self.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                            <a
                                href="https://kathleenhealsession.groovesell.com/checkout/f8ac887535314baf577c8edc5feeb194"
                                className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/50 hover:scale-105 inline-flex items-center justify-center gap-3"
                            >
                                <CheckCircle size={24} />
                                Book Your Session Now - $111
                            </a>
                        </div>

                        <p className="text-yellow-300 text-sm">
                            ✓ 100% Money-Back Guarantee • ✓ Virtual Phone Session • ✓ 60 Minutes
                        </p>
                    </div>
                </section>

                {/* What's Included Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                                What's Included in Your Session
                            </h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                A comprehensive 60-minute healing experience designed just for you
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-100">
                                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Phone size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Virtual Session Over Phone</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Receive powerful energy healing from the comfort of your own home. No need to travel—healing happens wherever you are.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-100">
                                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Sparkles size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Energy Assessment</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    I'll assess your unique energy field and identify areas that need healing, balancing, and restoration.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-100">
                                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Heart size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Chakra Balancing</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Clear blockages and restore balance to your seven main chakras, promoting physical, emotional, and spiritual wellness.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-100">
                                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Sparkles size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Meridian Therapy</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Release stored pain and trauma from your energy pathways, allowing life force to flow freely through your body.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-100">
                                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Clock size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Guided Meditation & Breathwork</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Learn powerful techniques to deepen your healing and maintain balance long after our session ends.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-100">
                                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Shield size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Self-Care Techniques</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Take home practical tools and practices to continue your healing journey and maintain your energetic wellness.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Guarantee Section */}
                <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Shield size={40} className="text-white" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-yellow-300">
                            100% Money-Back Guarantee
                        </h2>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-8">
                            <p className="text-xl text-slate-200 leading-relaxed mb-6">
                                Your well-being is my highest priority.
                            </p>
                            <p className="text-lg text-slate-200 leading-relaxed mb-6">
                                To make sure you feel fully supported, I proudly offer a money-back guarantee on all healing sessions. If you don't feel better or lighter by the end of your session, simply let me know—and I'll offer you a full refund, no questions asked.
                            </p>
                            <p className="text-lg text-slate-200 leading-relaxed mb-6">
                                I truly believe in the power of healing and am deeply committed to helping you reach your wellness goals. Your journey toward self-love and healing matters, and I want you to feel confident and safe in choosing to work with me.
                            </p>
                            <p className="text-lg text-slate-200 leading-relaxed">
                                Take the first step toward your healing today. I'm here for you.
                            </p>
                        </div>

                        <p className="text-emerald-300 italic text-lg font-semibold">
                            With love and presence,<br />
                            Kathleen Heals
                        </p>
                    </div>
                </section>

                {/* Pricing & CTA Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Ready to Begin Your Healing Journey?
                        </h2>
                        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
                            Book your 60-minute energy healing session today and experience the transformative power of healing.
                        </p>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 border-4 border-emerald-200 mb-12">
                            <div className="text-7xl md:text-8xl font-bold text-emerald-600 mb-4">$111</div>
                            <p className="text-xl text-slate-700 mb-8">One-Time Investment in Your Healing</p>

                            <a
                                href="https://kathleenhealsession.groovesell.com/checkout/f8ac887535314baf577c8edc5feeb194"
                                className="inline-flex items-center gap-3 bg-emerald-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 hover:scale-105"
                            >
                                <CheckCircle size={28} />
                                Book Your Session Now
                            </a>

                            <p className="text-sm text-slate-600 mt-6">
                                After payment, you'll be directed to schedule your session time
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            <div className="flex items-start gap-3">
                                <CheckCircle size={24} className="text-emerald-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-slate-900">Instant Access</p>
                                    <p className="text-sm text-slate-600">Schedule your session immediately after payment</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle size={24} className="text-emerald-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-slate-900">Secure Payment</p>
                                    <p className="text-sm text-slate-600">Safe and encrypted checkout process</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle size={24} className="text-emerald-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-slate-900">Risk-Free</p>
                                    <p className="text-sm text-slate-600">100% money-back guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
