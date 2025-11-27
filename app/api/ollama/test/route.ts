import { NextRequest, NextResponse } from 'next/server'

// GET - Test Ollama connection
export async function GET(request: NextRequest) {
    try {
        const ollamaUrl = process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434'

        // Test connection to Ollama server
        const response = await fetch(`${ollamaUrl}/api/tags`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
            return NextResponse.json({
                status: 'error',
                message: `Ollama server returned ${response.status}: ${response.statusText}`,
                ollamaUrl
            }, { status: 500 })
        }

        const data = await response.json()

        return NextResponse.json({
            status: 'connected',
            message: 'Successfully connected to Ollama server',
            ollamaUrl,
            models: data.models || [],
            modelCount: data.models?.length || 0
        })

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            ollamaUrl: process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434',
            details: 'Cannot connect to Ollama server. Please check if the server is running and accessible.'
        }, { status: 500 })
    }
}
