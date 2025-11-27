import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { AIInteraction } from '@/lib/models'

// GET - Fetch user's affirmation history
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        // Get all affirmations for this user, sorted by newest first
        const affirmations = await AIInteraction.find({
            userId,
            type: 'affirmation'
        })
            .sort({ createdAt: -1 })
            .limit(50) // Last 50 affirmations
            .lean()

        // Parse and format the affirmations
        const formattedHistory = affirmations.map(item => ({
            id: item._id.toString(),
            affirmations: item.response.split('\n').filter((a: string) => a.trim()),
            mood: item.metadata?.mood,
            challenge: item.metadata?.challenge,
            createdAt: item.createdAt,
            model: item.model
        }))

        return NextResponse.json({
            history: formattedHistory,
            count: formattedHistory.length
        })

    } catch (error) {
        console.error('Error fetching affirmation history:', error)
        return NextResponse.json(
            { error: 'Failed to fetch history', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
