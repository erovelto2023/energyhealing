'use client'

import { useState, useEffect } from 'react'

interface EntryEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export default function EntryEditor({ content, onChange, placeholder = 'Start writing...' }: EntryEditorProps) {
    return (
        <div className="w-full h-full min-h-[300px] relative">
            <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-full min-h-[300px] p-6 rounded-xl bg-gray-800 bg-opacity-30 border border-gray-700 focus:border-primary-purple focus:outline-none resize-none text-lg leading-relaxed transition-all"
                style={{
                    background: 'rgba(30, 30, 40, 0.5)',
                    backdropFilter: 'blur(10px)'
                }}
            />
            <div className="absolute bottom-4 right-4 text-xs text-muted">
                {content.length} characters
            </div>
        </div>
    )
}
