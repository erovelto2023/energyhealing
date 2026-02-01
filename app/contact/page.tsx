import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import AnimatedHero from '@/components/AnimatedHero';

export const metadata: Metadata = {
    title: 'Contact Support | Kathleen Heals',
    description: 'Get in touch with Kathleen for questions about energy healing sessions, bookings, or general support.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <AnimatedHero
                title="Get in Touch"
                subtitle="Have questions about energy healing or need help with your booking? I'm here to support you."
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-emerald-800 text-xs font-bold uppercase tracking-widest shadow-sm border border-emerald-100/30">
                    <MessageCircle size={14} />
                    Contact Support
                </div>
            </AnimatedHero>

            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Contact Options */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white rounded-3xl border-2 border-emerald-100 p-8 hover:border-emerald-300 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                            <Mail size={24} className="text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
                        <p className="text-slate-600 mb-4">
                            Send me an email and I'll get back to you within 24-48 hours.
                        </p>
                        <a href="mailto:erovelto@outlook.com" className="text-emerald-600 font-bold hover:underline">
                            erovelto@outlook.com
                        </a>
                    </div>

                    <div className="bg-white rounded-3xl border-2 border-emerald-100 p-8 hover:border-emerald-300 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                            <Phone size={24} className="text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Phone Consultations</h3>
                        <p className="text-slate-600 mb-4">
                            All healing sessions are conducted over the phone for your convenience.
                        </p>
                        <Link href="/bookings" className="text-emerald-600 font-bold hover:underline">
                            Book a Session →
                        </Link>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">How do I book a session?</h3>
                            <p className="text-slate-600">
                                Visit our <Link href="/bookings" className="text-emerald-600 hover:underline">booking page</Link> to schedule your 60-minute energy healing session. Sessions are $111 and conducted over the phone.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">What is your refund policy?</h3>
                            <p className="text-slate-600">
                                I offer a 100% money-back guarantee. If you don't feel better or lighter by the end of your session, simply let me know and I'll offer you a full refund, no questions asked.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">How are sessions conducted?</h3>
                            <p className="text-slate-600">
                                All sessions are virtual and conducted over the phone. You can be in the comfort of your own home while receiving powerful energy healing.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">What should I expect during a session?</h3>
                            <p className="text-slate-600">
                                Each 60-minute session includes a personalized assessment of your energy field, chakra balancing, meridian therapy, guided meditation, breathwork, and self-care techniques for ongoing healing.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">How do I submit a testimonial or story?</h3>
                            <p className="text-slate-600">
                                You can <Link href="/submit-testimonial" className="text-emerald-600 hover:underline">submit a testimonial</Link> about your experience with my services, or <Link href="/share-story" className="text-emerald-600 hover:underline">share your healing story</Link> to inspire others in the community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Connect With Me</h3>
                    <p className="text-slate-600 mb-6">
                        Follow along for healing tips, energy insights, and community support.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="https://www.youtube.com/@KathleenEnergyHealing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                        >
                            YouTube
                        </a>
                        <a
                            href="https://www.facebook.com/groups/908078861130495"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                        >
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
