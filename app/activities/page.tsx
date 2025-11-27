import Link from 'next/link'

export default function ActivitiesPage() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
            <div className="container-custom py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gradient mb-4">Healing Activities</h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        Interactive tools and practices to support your healing journey
                    </p>
                    <Link href="/" className="inline-block mt-6 text-secondary hover:text-primary-purple transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Daily Energy Card Pull */}
                    <Link href="/activities/daily-card">
                        <div className="glass-card p-8 group cursor-pointer h-full">
                            <div className="text-6xl mb-4 inline-block transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                                🔮
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Daily Energy Card Pull</h3>
                            <p className="text-secondary mb-4">
                                Pull a daily card to receive guidance, mantras, and micro-actions for emotional wellness.
                                Track your streak and build a healing habit.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(270, 60%, 65%, 0.2)', color: 'var(--primary-purple-light)' }}>
                                    Daily Practice
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(180, 55%, 55%, 0.2)', color: 'var(--secondary-teal)' }}>
                                    Streak Tracking
                                </span>
                            </div>
                            <div className="text-primary-purple-light font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                Start Your Journey →
                            </div>
                        </div>
                    </Link>

                    {/* Healing Journal - NEW */}
                    <Link href="/activities/healing-journal">
                        <div className="glass-card p-8 group cursor-pointer h-full">
                            <div className="text-6xl mb-4 inline-block transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                                📔
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Healing Journal</h3>
                            <p className="text-secondary mb-4">
                                A safe space for reflection with AI-powered insights. Track your mood, identify patterns, and receive personalized healing guidance.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(270, 60%, 65%, 0.2)', color: 'var(--primary-purple-light)' }}>
                                    AI Insights
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(180, 55%, 55%, 0.2)', color: 'var(--secondary-teal)' }}>
                                    Mood Tracking
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(45, 85%, 65%, 0.2)', color: 'var(--accent-gold)' }}>
                                    NEW
                                </span>
                            </div>
                            <div className="text-primary-purple-light font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                Start Journaling →
                            </div>
                        </div>
                    </Link>

                    {/* AI Affirmations Generator - NEW */}
                    <Link href="/activities/ai-affirmations">
                        <div className="glass-card p-8 group cursor-pointer h-full">
                            <div className="text-6xl mb-4 inline-block transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                                💜
                            </div>
                            <h3 className="text-2xl font-bold mb-4">AI Affirmations</h3>
                            <p className="text-secondary mb-4">
                                Generate personalized affirmations powered by AI. Get custom healing messages based on your current mood and challenges.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(270, 60%, 65%, 0.2)', color: 'var(--primary-purple-light)' }}>
                                    AI-Powered
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(180, 55%, 55%, 0.2)', color: 'var(--secondary-teal)' }}>
                                    Personalized
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(45, 85%, 65%, 0.2)', color: 'var(--accent-gold)' }}>
                                    NEW
                                </span>
                            </div>
                            <div className="text-primary-purple-light font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                Try It Now →
                            </div>
                        </div>
                    </Link>

                    {/* Chakra Analysis - NEW */}
                    <Link href="/activities/chakra-analysis">
                        <div className="glass-card p-8 group cursor-pointer h-full">
                            <div className="text-6xl mb-4 inline-block transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                                🌈
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Chakra Analysis</h3>
                            <p className="text-secondary mb-4">
                                Get AI-powered analysis of your energy centers. Identify chakra imbalances and receive personalized healing recommendations.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(270, 60%, 65%, 0.2)', color: 'var(--primary-purple-light)' }}>
                                    AI-Powered
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(180, 55%, 55%, 0.2)', color: 'var(--secondary-teal)' }}>
                                    Energy Healing
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(45, 85%, 65%, 0.2)', color: 'var(--accent-gold)' }}>
                                    NEW
                                </span>
                            </div>
                            <div className="text-primary-purple-light font-semibold group-hover:translate-x-2 transition-transform inline-block">
                                Analyze Now →
                            </div>
                        </div>
                    </Link>

                    {/* Coming Soon - Meditation Timer */}
                    <div className="glass-card p-8 opacity-60">
                        <div className="text-6xl mb-4">🧘</div>
                        <h3 className="text-2xl font-bold mb-4">Guided Meditations</h3>
                        <p className="text-secondary mb-4">
                            Chakra-focused meditations and breathing exercises to deepen your practice.
                        </p>
                        <div className="px-3 py-1 rounded-full text-xs inline-block" style={{ background: 'hsla(0, 0%, 50%, 0.2)' }}>
                            Coming Soon
                        </div>
                    </div>

                    {/* Coming Soon - Energy Journal */}
                    <div className="glass-card p-8 opacity-60">
                        <div className="text-6xl mb-4">📔</div>
                        <h3 className="text-2xl font-bold mb-4">Energy Journal</h3>
                        <p className="text-secondary mb-4">
                            Track your healing journey with guided prompts and reflection exercises.
                        </p>
                        <div className="px-3 py-1 rounded-full text-xs inline-block" style={{ background: 'hsla(0, 0%, 50%, 0.2)' }}>
                            Coming Soon
                        </div>
                    </div>

                    {/* Coming Soon - Chakra Assessment */}
                    <div className="glass-card p-8 opacity-60">
                        <div className="text-6xl mb-4">🌈</div>
                        <h3 className="text-2xl font-bold mb-4">Chakra Assessment</h3>
                        <p className="text-secondary mb-4">
                            Discover which chakras need attention with our interactive assessment tool.
                        </p>
                        <div className="px-3 py-1 rounded-full text-xs inline-block" style={{ background: 'hsla(0, 0%, 50%, 0.2)' }}>
                            Coming Soon
                        </div>
                    </div>

                    {/* Coming Soon - Healing Music */}
                    <div className="glass-card p-8 opacity-60">
                        <div className="text-6xl mb-4">🎵</div>
                        <h3 className="text-2xl font-bold mb-4">Healing Frequencies</h3>
                        <p className="text-secondary mb-4">
                            Solfeggio frequencies and binaural beats for deep relaxation and healing.
                        </p>
                        <div className="px-3 py-1 rounded-full text-xs inline-block" style={{ background: 'hsla(0, 0%, 50%, 0.2)' }}>
                            Coming Soon
                        </div>
                    </div>

                    {/* Coming Soon - Community */}
                    <div className="glass-card p-8 opacity-60">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-2xl font-bold mb-4">Healing Community</h3>
                        <p className="text-secondary mb-4">
                            Connect with others on their healing journey. Share experiences and support.
                        </p>
                        <div className="px-3 py-1 rounded-full text-xs inline-block" style={{ background: 'hsla(0, 0%, 50%, 0.2)' }}>
                            Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
