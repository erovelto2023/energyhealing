'use client'

import { motion } from 'framer-motion'

interface AIInsightPanelProps {
    insights: {
        emotionalSummary: string
        energyInterpretation: string
        patterns: string[]
        affirmations: string[]
        recommendations: string[]
        microAction: string
    }
    loading?: boolean
}

export default function AIInsightPanel({ insights, loading = false }: AIInsightPanelProps) {
    if (loading) {
        return (
            <div className="p-6 rounded-xl glass-card animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
            </div>
        )
    }

    if (!insights) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-6"
        >
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-bold text-gradient">Healing Insights</h3>
            </div>

            {/* Emotional Summary */}
            <div className="p-4 rounded-lg bg-primary-purple bg-opacity-10 border border-primary-purple border-opacity-20">
                <h4 className="text-sm font-semibold text-primary-purple-light mb-2 uppercase tracking-wider">Emotional Summary</h4>
                <p className="text-secondary leading-relaxed">{insights.emotionalSummary}</p>
            </div>

            {/* Energy Interpretation */}
            <div>
                <h4 className="text-sm font-semibold text-secondary-teal mb-2 uppercase tracking-wider">Energy Reading</h4>
                <p className="text-secondary">{insights.energyInterpretation}</p>
            </div>

            {/* Patterns */}
            {insights.patterns.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">Noticed Patterns</h4>
                    <ul className="space-y-2">
                        {insights.patterns.map((pattern, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                                <span className="text-blue-400 mt-1">•</span>
                                {pattern}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Affirmations */}
            {insights.affirmations.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2 uppercase tracking-wider">Suggested Affirmations</h4>
                    <div className="space-y-2">
                        {insights.affirmations.map((affirmation, i) => (
                            <div key={i} className="p-3 rounded-lg bg-purple-900 bg-opacity-20 border border-purple-800 text-purple-200 italic text-sm">
                                &quot;{affirmation}&quot;
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {insights.recommendations.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2 uppercase tracking-wider">Gentle Recommendations</h4>
                    <ul className="space-y-2">
                        {insights.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                                <span className="text-green-400">🌿</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Micro Action */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-700">
                <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                    <span>⚡</span> Micro-Action for Today
                </h4>
                <p className="text-indigo-100 font-medium">{insights.microAction}</p>
            </div>
        </motion.div>
    )
}
