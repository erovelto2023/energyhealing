import { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | Kathleen Heals',
    description: 'Terms and conditions for using Kathleen Heals services and website.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-slate-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-slate-200">
                        <FileText size={14} />
                        Terms of Service
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            By accessing and using the Kathleen Heals website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Services Provided</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Kathleen Heals provides:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                            <li>Energy healing sessions conducted over the phone</li>
                            <li>Educational content about healing and wellness</li>
                            <li>Resource recommendations and affiliate products</li>
                            <li>Community platform for sharing healing stories</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Important Disclaimer</h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                            <p className="text-slate-800 leading-relaxed mb-4">
                                <strong>⚠️ Medical Disclaimer:</strong> Energy healing services are complementary and educational in nature. They are NOT a substitute for professional medical advice, diagnosis, or treatment.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                <li>Always seek the advice of your physician or qualified health provider with any questions about a medical condition</li>
                                <li>Never disregard professional medical advice or delay seeking it because of information on this website</li>
                                <li>Energy healing is intended to complement, not replace, conventional medical treatment</li>
                            </ul>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Money-Back Guarantee</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            We offer a 100% money-back guarantee on all healing sessions. If you don't feel better or lighter by the end of your session, simply let us know and we'll provide a full refund, no questions asked. Refund requests must be made within 24 hours of your session.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Booking and Cancellation</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Booking:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                            <li>Sessions are 60 minutes and cost $111</li>
                            <li>All sessions are conducted virtually over the phone</li>
                            <li>Payment is required at the time of booking</li>
                        </ul>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Cancellation:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                            <li>You may cancel or reschedule your session up to 24 hours before your appointment</li>
                            <li>Cancellations made less than 24 hours before your session may not be eligible for a refund</li>
                            <li>We reserve the right to cancel sessions due to unforeseen circumstances</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">User-Generated Content</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            When you submit testimonials, stories, or comments:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                            <li>You grant us permission to display your content on our website</li>
                            <li>You can choose to display your full name or initials</li>
                            <li>All submissions are subject to admin approval before publication</li>
                            <li>We reserve the right to edit or remove content that violates our guidelines</li>
                            <li>You retain ownership of your content</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Affiliate Links</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            This website may contain affiliate links to products and services. We may receive a commission if you make a purchase through these links. This does not affect the price you pay, and we only recommend products we believe will benefit your healing journey.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Intellectual Property</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            All content on this website, including text, graphics, logos, and images, is the property of Kathleen Heals and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Limitation of Liability</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            Kathleen Heals and its practitioners shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or website. Your use of our services is at your own risk.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Privacy</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            Your privacy is important to us. Please review our <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your personal information.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Changes to Terms</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes constitutes acceptance of the new terms.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Contact Information</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            If you have questions about these Terms of Service, please contact us:
                        </p>
                        <p className="text-slate-700 mb-6">
                            <strong>Email:</strong> <a href="mailto:erovelto@outlook.com" className="text-emerald-600 hover:underline">erovelto@outlook.com</a>
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200">
                    <p className="text-slate-600 mb-6">
                        Questions about our terms?
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
