import { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | Kathleen Heals',
    description: 'Learn how we protect your personal information and respect your privacy.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-slate-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-slate-200">
                        <Shield size={14} />
                        Privacy Policy
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Your Privacy Matters
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            At Kathleen Heals, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Information We Collect</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            We may collect the following types of information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                            <li><strong>Personal Information:</strong> Name, email address, phone number when you book a session or submit a form</li>
                            <li><strong>Testimonials & Stories:</strong> Content you voluntarily submit, including your experiences and feedback</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our website</li>
                            <li><strong>Cookies:</strong> Small data files stored on your device to improve your experience</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">How We Use Your Information</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            We use your information to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                            <li>Provide and improve our healing services</li>
                            <li>Communicate with you about your sessions and bookings</li>
                            <li>Respond to your inquiries and support requests</li>
                            <li>Share testimonials and stories (with your permission)</li>
                            <li>Send you updates and information about our services (with your consent)</li>
                            <li>Improve our website and user experience</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Information Sharing</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                            <li><strong>With Your Consent:</strong> When you explicitly agree to share your testimonial or story publicly</li>
                            <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our website (e.g., hosting, email services)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Your Privacy Choices</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            You have control over your information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                            <li><strong>Display Name:</strong> Choose to display your full name or initials on testimonials and stories</li>
                            <li><strong>Email Visibility:</strong> Your email is never displayed publicly and is used only for verification</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from communications at any time</li>
                            <li><strong>Data Access:</strong> Request access to or deletion of your personal information</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Data Security</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Cookies</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of the site.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Children's Privacy</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Changes to This Policy</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Contact Us</h2>
                        <p className="text-slate-700 leading-relaxed mb-6">
                            If you have any questions about this Privacy Policy or how we handle your information, please contact us at:
                        </p>
                        <p className="text-slate-700 mb-6">
                            <strong>Email:</strong> <a href="mailto:erovelto@outlook.com" className="text-emerald-600 hover:underline">erovelto@outlook.com</a>
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200">
                    <p className="text-slate-600 mb-6">
                        Have questions about our privacy practices?
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
