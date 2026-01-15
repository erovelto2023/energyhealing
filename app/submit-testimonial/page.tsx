import TestimonialSubmissionForm from '@/components/features/TestimonialSubmissionForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Share Your Experience | Kathleen Heals',
    description: 'Share your healing journey and inspire others. Submit your testimonial about your experience with energy healing.',
};

export default function SubmitTestimonialPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Share Your Healing Story
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Your experience can inspire and encourage others on their healing journey.
                        We'd love to hear about your transformation.
                    </p>
                </div>

                <TestimonialSubmissionForm />

                <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-emerald-100">
                    <h3 className="font-bold text-slate-900 mb-3">What happens after I submit?</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">1.</span>
                            Your testimonial will be reviewed by our team
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">2.</span>
                            We'll verify the details and may reach out via email if needed
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">3.</span>
                            Once approved, it will appear on our website (typically within 2-3 business days)
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">4.</span>
                            Your privacy is protected - we'll use your initials unless you opt to show your full name
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
