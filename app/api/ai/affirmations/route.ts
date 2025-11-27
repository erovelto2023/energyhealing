import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateAffirmations } from '@/lib/ollama'
import dbConnect from '@/lib/mongodb'
import { AIInteraction } from '@/lib/models'

// POST - Generate personalized affirmations
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { mood, challenge, model } = await request.json()

        if (!mood) {
            return NextResponse.json({ error: 'Mood is required' }, { status: 400 })
        }

        console.log('Generating affirmations:', { mood, challenge, model: model || 'deepseek-r1:latest' })

        // Generate affirmations using Ollama
        const affirmations = await generateAffirmations(
            mood,
            challenge,
            model || 'deepseek-r1:latest'
        )

        console.log('Generated affirmations:', affirmations)

        // Save to database
        try {
            await dbConnect()
            await AIInteraction.create({
                userId,
                type: 'affirmation',
                prompt: `Mood: ${mood}${challenge ? `, Challenge: ${challenge}` : ''}`,
                response: affirmations.join('\n'),
                model: model || 'deepseek-r1:latest',
                metadata: { mood, challenge }
            })
        } catch (dbError) {
            console.error('Database error (non-fatal):', dbError)
            // Continue even if database save fails
        }

        return NextResponse.json({
            affirmations,
            mood,
            challenge,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Error generating affirmations:', error)
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            ollamaUrl: process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434'
        })

        return NextResponse.json(
            {
                error: 'Failed to generate affirmations',
                details: error instanceof Error ? error.message : 'Unknown error',
                hint: 'Check if Ollama server is running and deepseek-r1:latest model is installed'
            },
            { status: 500 }
        )
    }
}
