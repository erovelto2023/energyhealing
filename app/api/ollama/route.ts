import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateWithOllama } from '@/lib/ollama'

// POST - Generate AI response using Ollama
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { prompt, model, stream } = await request.json()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        console.log('Generating with Ollama:', { model: model || 'deepseek-r1:latest', promptLength: prompt.length })

        // Generate response from Ollama
        const response = await generateWithOllama(
            prompt,
            model || 'deepseek-r1:latest'
        )

        console.log('Ollama response received:', {
            model: response.model,
            responseLength: response.response.length,
            done: response.done
        })

        return NextResponse.json(response)

    } catch (error) {
        console.error('Error in Ollama API route:', error)
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            ollamaUrl: process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434'
        })

        return NextResponse.json(
            {
                error: 'Failed to generate AI response',
                details: error instanceof Error ? error.message : 'Unknown error',
                hint: 'Check if Ollama server is running at ' + (process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434')
            },
            { status: 500 }
        )
    }
}
