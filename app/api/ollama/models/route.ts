import { NextRequest, NextResponse } from 'next/server'
import { listOllamaModels } from '@/lib/ollama'

// GET - Fetch available Ollama models
export async function GET(request: NextRequest) {
    try {
        console.log('Fetching Ollama models from:', process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434')

        const models = await listOllamaModels()

        console.log('Found models:', models.map(m => m.name))

        return NextResponse.json({
            models,
            defaultModel: 'deepseek-r1:latest',
            count: models.length,
            ollamaUrl: process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434'
        })

    } catch (error) {
        console.error('Error fetching Ollama models:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch models',
                details: error instanceof Error ? error.message : 'Unknown error',
                ollamaUrl: process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434'
            },
            { status: 500 }
        )
    }
}
