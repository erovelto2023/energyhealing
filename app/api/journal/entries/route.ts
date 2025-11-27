import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { JournalEntry } from '@/lib/models'
import { analyzeJournalEntry } from '@/lib/journalAI'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const body = await req.json()
        const { content, mood, emotions, energyLevel, tags, isPrivate, title } = body

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        // Perform AI analysis if requested and not private
        let aiInsights = null
        const analyze = body.analyze === true

        if (analyze) {
            try {
                aiInsights = await analyzeJournalEntry(content, mood, emotions, energyLevel)
            } catch (error) {
                console.error('AI Analysis failed:', error)
                // Continue without insights if AI fails
            }
        }

        const entryData: any = {
            userId,
            title,
            content,
            isPrivate
        }

        if (mood && mood.trim() !== '') entryData.mood = mood
        if (energyLevel) entryData.energyLevel = energyLevel
        if (Array.isArray(emotions)) entryData.emotions = emotions
        if (Array.isArray(tags)) entryData.tags = tags
        if (aiInsights) entryData.aiInsights = aiInsights

        const entry = await JournalEntry.create(entryData)

        return NextResponse.json({ entry }, { status: 201 })
    } catch (error) {
        console.error('Error creating journal entry:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const searchParams = req.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const entries = await JournalEntry.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await JournalEntry.countDocuments({ userId })

        return NextResponse.json({
            entries,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching journal entries:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
