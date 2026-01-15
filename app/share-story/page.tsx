import UserStorySubmissionForm from '@/components/features/UserStorySubmissionForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Share Your Healing Story | Kathleen Heals',
    description: 'Share your personal healing journey with our community. Your story can inspire and connect with others facing similar challenges.',
};

export default function ShareStoryPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Share Your Healing Journey
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
                        Your story matters. Whether you're still searching for relief or have found healing,
                        sharing your journey can inspire hope and connection in others.
                    </p>
                    <div className="inline-block p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-100">
                        <p className="text-sm text-slate-700">
                            <strong>This is NOT a testimonial.</strong> This is your personal story about living with pain,
                            what you've tried, and where you are now. It's about connecting with others who understand.
                        </p>
                    </div>
                </div>

                <UserStorySubmissionForm />

                <div className="mt-12 grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-100">
                        <h3 className="font-bold text-slate-900 mb-3">Why share your story?</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">💜</span>
                                Connect with others who truly understand your journey
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">🌟</span>
                                Inspire hope in someone who's struggling
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">🤝</span>
                                Build a supportive healing community
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">📖</span>
                                Help others learn from your experiences
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-100">
                        <h3 className="font-bold text-slate-900 mb-3">What happens next?</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">1.</span>
                                Your story will be reviewed by our team
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">2.</span>
                                We'll verify details and may reach out via email
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">3.</span>
                                Once approved, it will appear on our community stories page
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">4.</span>
                                Your privacy is protected - we'll use initials unless you opt otherwise
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
