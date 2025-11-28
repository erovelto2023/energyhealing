'use client'

import React, { useState } from 'react'
import { Loader2, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react'

interface AIBlogSidebarProps {
    onGenerate: (content: string) => void
    // isGenerating prop removed as we'll handle it locally
}

export default function AIBlogSidebar({ onGenerate }: AIBlogSidebarProps) {
    const [isOpen, setIsOpen] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false) // Local state
    const [primaryKeyword, setPrimaryKeyword] = useState('')
    const [secondaryKeywords, setSecondaryKeywords] = useState('')
    const [tone, setTone] = useState('conversational')
    const [length, setLength] = useState('1500')
    const [additionalInstructions, setAdditionalInstructions] = useState('')

    const [abortController, setAbortController] = useState<AbortController | null>(null)

    const handleGenerate = () => {
        if (!primaryKeyword) return

        const promptData = {
            primaryKeyword,
            secondaryKeywords,
            tone,
            length,
            additionalInstructions
        }

        generateContent(promptData)
    }

    const handleStop = () => {
        if (abortController) {
            abortController.abort()
            setAbortController(null)
            setIsGenerating(false)
        }
    }

    const generateContent = async (data: any) => {
        setIsGenerating(true) // Start loading
        onGenerate('') // Clear previous content

        const controller = new AbortController()
        setAbortController(controller)

        try {
            const res = await fetch('/api/blog/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                signal: controller.signal
            })

            if (!res.ok) throw new Error('Generation failed')
            if (!res.body) throw new Error('No response body')

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let accumulatedContent = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                accumulatedContent += chunk

                // Clean up markdown code blocks if they appear in the stream
                const cleanChunk = accumulatedContent
                    .replace(/^```html\s*/, '')
                    .replace(/^```markdown\s*/, '')
                    .replace(/^```\s*/, '')
                    .replace(/```$/, '')

                onGenerate(cleanChunk)
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Generation stopped by user')
            } else {
                console.error('Error generating content:', error)
                alert('Failed to generate content. Please try again.')
            }
        } finally {
            setIsGenerating(false) // Stop loading
            setAbortController(null)
        }
    }

    return (
        <div
            className={`fixed right-0 top-0 h-full bg-gray-900 border-l border-gray-800 transition-all duration-300 z-50 flex flex-col ${isOpen ? 'w-80' : 'w-12'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-purple-600 rounded-full p-1 text-white shadow-lg hover:bg-purple-500 transition-colors"
            >
                {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {isOpen ? (
                <div className="flex flex-col h-full p-6 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-6 text-purple-400">
                        <Sparkles size={24} />
                        <h2 className="text-xl font-bold">AI Assistant</h2>
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* Primary Keyword */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Primary Keyword <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={primaryKeyword}
                                onChange={(e) => setPrimaryKeyword(e.target.value)}
                                placeholder="e.g. Benefits of Reiki"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Secondary Keywords */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Secondary Keywords
                            </label>
                            <textarea
                                value={secondaryKeywords}
                                onChange={(e) => setSecondaryKeywords(e.target.value)}
                                placeholder="Comma separated&#10;e.g. energy healing, stress relief, chakras"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                            />
                        </div>

                        {/* Tone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tone
                            </label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="conversational">Conversational</option>
                                <option value="professional">Professional</option>
                                <option value="authoritative">Authoritative</option>
                                <option value="humorous">Humorous</option>
                                <option value="inspirational">Inspirational</option>
                                <option value="educational">Educational</option>
                            </select>
                        </div>

                        {/* Length */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Approx. Word Count: {length}
                            </label>
                            <input
                                type="range"
                                min="500"
                                max="3000"
                                step="100"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>500</span>
                                <span>3000</span>
                            </div>
                        </div>

                        {/* Additional Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Extra Instructions
                            </label>
                            <textarea
                                value={additionalInstructions}
                                onChange={(e) => setAdditionalInstructions(e.target.value)}
                                placeholder="Specific requirements, formatting, or things to avoid..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
                        {isGenerating ? (
                            <button
                                onClick={handleStop}
                                className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-red-600 hover:bg-red-700 text-white shadow-lg"
                            >
                                <Loader2 className="animate-spin" size={20} />
                                Stop Generating
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                disabled={!primaryKeyword}
                                className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${!primaryKeyword
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/20'
                                    }`}
                            >
                                <Sparkles size={20} />
                                Generate Post
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center py-6 gap-4">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-purple-400 hover:text-white transition-colors"
                        title="Open AI Assistant"
                    >
                        <Sparkles size={24} />
                    </button>
                </div>
            )}
        </div>
    )
}
