'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface ChakraAnalysis {
    chakra: string
    analysis: string
    recommendations: string[]
}

export default function ChakraAnalysisPage() {
    const { user, isLoaded } = useUser()
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
    const [customSymptom, setCustomSymptom] = useState('')
    const [analysis, setAnalysis] = useState<ChakraAnalysis[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const commonSymptoms = [
        // Physical
        'Fatigue', 'Headaches', 'Digestive issues', 'Muscle tension',
        'Sleep problems', 'Low energy', 'Chronic pain', 'Throat discomfort',
        // Emotional
        'Anxiety', 'Depression', 'Anger', 'Fear',
        'Sadness', 'Overwhelm', 'Confusion', 'Loneliness',
        // Mental
        'Brain fog', 'Lack of focus', 'Indecision', 'Negative thoughts',
        'Self-doubt', 'Lack of creativity', 'Feeling stuck', 'Disconnection'
    ]

    const chakraColors: Record<string, string> = {
        'Root': '#C41E3A',
        'Sacral': '#FF6F00',
        'Solar Plexus': '#FFD700',
        'Heart': '#00A86B',
        'Throat': '#4169E1',
        'Third Eye': '#4B0082',
        'Crown': '#8B00FF'
    }

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        )
    }

    const addCustomSymptom = () => {
        if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
            setSelectedSymptoms(prev => [...prev, customSymptom.trim()])
            setCustomSymptom('')
        }
    }

    const handleAnalyze = async () => {
        if (selectedSymptoms.length === 0) {
            setError('Please select at least one symptom')
            return
        }

        setLoading(true)
        setError('')
        setAnalysis([])

        try {
            const response = await fetch('/api/ai/chakra-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: selectedSymptoms })
            })

            if (!response.ok) {
                throw new Error('Failed to analyze chakras')
            }

            const data = await response.json()
            setAnalysis(data.analysis)
        } catch (err) {
            setError('Failed to analyze chakras. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-lg text-secondary">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <div className="text-center max-w-md mx-auto p-8">
                    <h1 className="text-4xl font-bold mb-4 text-gradient">Chakra Analysis</h1>
                    <p className="text-lg text-secondary mb-8">
                        Sign in to get AI-powered chakra analysis and personalized healing recommendations.
                    </p>
                    <a href="/sign-in" className="btn-primary">
                        Sign In to Continue
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
            <div className="container-custom py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient mb-2">Chakra Analysis</h1>
                        <p className="text-secondary">AI-powered energy assessment</p>
                    </div>
                    <Link href="/activities" className="text-secondary hover:text-primary-purple transition-colors">
                        ← Back to Activities
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Symptom Selection */}
                    <div className="glass-card p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">What are you experiencing?</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 opacity-70">
                                Select symptoms you&apos;re currently experiencing
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {commonSymptoms.map((symptom) => (
                                    <button
                                        key={symptom}
                                        onClick={() => toggleSymptom(symptom)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedSymptoms.includes(symptom)
                                            ? 'bg-primary-purple text-white shadow-glow'
                                            : 'bg-gray-800 bg-opacity-50 hover:bg-opacity-70'
                                            }`}
                                    >
                                        {symptom}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Symptom */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 opacity-70">
                                Add your own symptom (optional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customSymptom}
                                    onChange={(e) => setCustomSymptom(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                                    placeholder="e.g., heart palpitations, restlessness..."
                                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 focus:border-primary-purple focus:outline-none"
                                    maxLength={50}
                                />
                                <button
                                    onClick={addCustomSymptom}
                                    className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
                                    style={{
                                        background: 'var(--gradient-accent)',
                                        color: 'white'
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Selected Symptoms */}
                        {selectedSymptoms.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 opacity-70">
                                    Selected symptoms ({selectedSymptoms.length})
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSymptoms.map((symptom) => (
                                        <span
                                            key={symptom}
                                            className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                            style={{
                                                background: 'hsla(270, 60%, 65%, 0.2)',
                                                color: 'var(--primary-purple-light)'
                                            }}
                                        >
                                            {symptom}
                                            <button
                                                onClick={() => toggleSymptom(symptom)}
                                                className="hover:text-white transition-colors"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || selectedSymptoms.length === 0}
                            className="w-full px-6 py-4 rounded-full font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: loading || selectedSymptoms.length === 0 ? 'var(--bg-dark-secondary)' : 'var(--gradient-accent)',
                                color: 'white',
                                boxShadow: loading || selectedSymptoms.length === 0 ? 'none' : 'var(--shadow-glow)'
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⚡</span>
                                    Analyzing your energy...
                                </span>
                            ) : (
                                '🔮 Analyze My Chakras'
                            )}
                        </button>

                        {error && (
                            <div className="mt-4 p-4 rounded-lg bg-red-900 bg-opacity-30 border border-red-700 text-red-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Analysis Results */}
                    <AnimatePresence>
                        {analysis.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold text-center mb-8">Your Chakra Analysis</h2>

                                {analysis.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="glass-card p-8"
                                    >
                                        {/* Chakra Header */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                                                style={{
                                                    background: `${chakraColors[item.chakra] || '#8B00FF'}33`,
                                                    border: `2px solid ${chakraColors[item.chakra] || '#8B00FF'}`
                                                }}
                                            >
                                                🌀
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold" style={{ color: chakraColors[item.chakra] || '#8B00FF' }}>
                                                    {item.chakra} Chakra
                                                </h3>
                                                <p className="text-sm text-muted">Needs attention</p>
                                            </div>
                                        </div>

                                        {/* Analysis */}
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold mb-2">Analysis</h4>
                                            <p className="text-secondary leading-relaxed">{item.analysis}</p>
                                        </div>

                                        {/* Recommendations */}
                                        <div>
                                            <h4 className="text-lg font-semibold mb-3">Healing Recommendations</h4>
                                            <div className="space-y-3">
                                                {item.recommendations.map((rec, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-3 p-4 rounded-lg"
                                                        style={{ background: 'hsla(0, 0%, 100%, 0.03)' }}
                                                    >
                                                        <span className="text-xl">✨</span>
                                                        <p className="flex-1 text-secondary">{rec}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                <div className="text-center mt-8 space-y-4">
                                    <button
                                        onClick={() => {
                                            setAnalysis([])
                                            setSelectedSymptoms([])
                                        }}
                                        className="px-6 py-3 rounded-full font-medium transition-all duration-300 mr-4"
                                        style={{
                                            background: 'hsla(180, 55%, 55%, 0.2)',
                                            border: '1px solid var(--secondary-teal)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        🔄 New Analysis
                                    </button>
                                    <Link
                                        href="/profile"
                                        className="inline-block px-6 py-3 rounded-full font-medium transition-all duration-300"
                                        style={{
                                            background: 'hsla(270, 60%, 65%, 0.2)',
                                            border: '1px solid var(--primary-purple)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        📚 View Past Analyses
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
        .btn-primary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: var(--transition-smooth);
          background: var(--gradient-accent);
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }
      `}</style>
        </div>
    )
}
