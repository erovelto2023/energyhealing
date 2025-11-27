'use client'

import { motion } from 'framer-motion'

interface PromptCardProps {
    prompt: {
        _id?: string
        title?: string
        prompt: string
        category?: string
        type?: string
    }
    onSelect: (prompt: string) => void
}

export default function PromptCard({ prompt, onSelect }: PromptCardProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(prompt.prompt)}
            className="w-full text-left p-5 rounded-xl glass-card hover:bg-opacity-40 transition-all group relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-purple to-secondary-teal opacity-50 group-hover:opacity-100 transition-opacity"></div>

            {prompt.category && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary-teal">
                        {prompt.category}
                    </span>
                    {prompt.type === 'ai-generated' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900 bg-opacity-50 text-purple-200 border border-purple-700">
                            AI Suggested
                        </span>
                    )}
                </div>
            )}

            <p className="text-lg font-medium text-white group-hover:text-primary-purple-light transition-colors">
                {prompt.prompt}
            </p>

            <div className="mt-4 flex items-center text-sm text-muted group-hover:text-white transition-colors">
                <span>Use this prompt</span>
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
        </motion.button>
    )
}
