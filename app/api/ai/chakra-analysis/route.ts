import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzeChakras } from '@/lib/chakraAnalysis'
import dbConnect from '@/lib/mongodb'
import { AIInteraction } from '@/lib/models'

// POST - Analyze chakra imbalances
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { symptoms, model } = await request.json()

        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return NextResponse.json({ error: 'Symptoms array is required' }, { status: 400 })
        }

        console.log('Analyzing chakras for symptoms:', symptoms)

        // Analyze chakras using Ollama
        const analysis = await analyzeChakras(symptoms, model || 'deepseek-r1:latest')

        console.log('Chakra analysis complete:', analysis.map(a => a.chakra))

        // Save to database
        try {
            await dbConnect()
            await AIInteraction.create({
                userId,
                type: 'chakra',
                prompt: `Symptoms: ${symptoms.join(', ')}`,
                response: JSON.stringify(analysis),
                model: model || 'deepseek-r1:latest',
                metadata: { symptoms, chakraCount: analysis.length }
            })
        } catch (dbError) {
            console.error('Database error (non-fatal):', dbError)
        }

        return NextResponse.json({
            analysis,
            symptomsAnalyzed: symptoms.length,
            chakrasIdentified: analysis.length,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Error analyzing chakras:', error)
        return NextResponse.json(
            {
                error: 'Failed to analyze chakras',
                details: error instanceof Error ? error.message : 'Unknown error',
                hint: 'Check if Ollama server is running and deepseek-r1:latest model is installed'
            },
            { status: 500 }
        )
    }
}
