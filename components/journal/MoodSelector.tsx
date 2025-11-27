'use client'

import { motion } from 'framer-motion'

interface MoodSelectorProps {
    selectedMood: string
    onSelect: (mood: string) => void
    label?: string
}

const moods = [
    { id: 'joyful', emoji: '😊', label: 'Joyful', color: '#FCD34D' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: '#6EE7B7' },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#FCA5A5' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#93C5FD' },
    { id: 'angry', emoji: '😠', label: 'Angry', color: '#F87171' },
    { id: 'peaceful', emoji: '🕊️', label: 'Peaceful', color: '#A7F3D0' },
    { id: 'energized', emoji: '⚡', label: 'Energized', color: '#FDBA74' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: '#C4B5FD' },
    { id: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed', color: '#FDA4AF' },
    { id: 'hopeful', emoji: '🌱', label: 'Hopeful', color: '#86EFAC' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful', color: '#FDE047' },
    { id: 'uncertain', emoji: '🤔', label: 'Uncertain', color: '#E5E7EB' }
]

export default function MoodSelector({ selectedMood, onSelect, label = 'How are you feeling?' }: MoodSelectorProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-3 opacity-70">{label}</label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {moods.map((mood) => (
                    <motion.button
                        key={mood.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(mood.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${selectedMood === mood.id
                                ? 'bg-opacity-20 border-2 shadow-glow'
                                : 'bg-gray-800 bg-opacity-30 border border-transparent hover:bg-opacity-50'
                            }`}
                        style={{
                            borderColor: selectedMood === mood.id ? mood.color : 'transparent',
                            backgroundColor: selectedMood === mood.id ? mood.color + '33' : undefined
                        }}
                    >
                        <span className="text-2xl mb-1">{mood.emoji}</span>
                        <span className="text-xs font-medium text-center">{mood.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
