import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { AIInteraction, CardPull, EnergyLog, JournalEntry, MoodLog } from '@/lib/models'

// GET - Fetch user's complete activity history
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const type = searchParams.get('type') // 'affirmation', 'chakra', 'card', 'all'

        await dbConnect()

        // Build date filter
        const dateFilter: any = {}
        if (startDate) {
            dateFilter.$gte = new Date(startDate)
        }
        if (endDate) {
            dateFilter.$lte = new Date(endDate)
        }

        const activities: any[] = []

        // Fetch AI interactions (affirmations, chakra analysis)
        if (!type || type === 'all' || type === 'affirmation' || type === 'chakra') {
            const aiFilter: any = { userId }
            if (Object.keys(dateFilter).length > 0) {
                aiFilter.createdAt = dateFilter
            }
            if (type && type !== 'all') {
                aiFilter.type = type
            }

            const aiInteractions = await AIInteraction.find(aiFilter)
                .sort({ createdAt: -1 })
                .limit(100)
                .lean()

            activities.push(...aiInteractions.map(item => ({
                id: item._id.toString(),
                type: item.type,
                date: item.createdAt,
                data: {
                    prompt: item.prompt,
                    response: item.response,
                    model: item.model,
                    metadata: item.metadata
                }
            })))
        }

        // Fetch card pulls
        if (!type || type === 'all' || type === 'card') {
            const cardFilter: any = { userId }
            if (Object.keys(dateFilter).length > 0) {
                cardFilter.pulledAt = dateFilter
            }

            const cardPulls = await CardPull.find(cardFilter)
                .sort({ pulledAt: -1 })
                .limit(100)
                .lean()

            activities.push(...cardPulls.map(item => ({
                id: item._id.toString(),
                type: 'card',
                date: item.pulledAt,
                data: {
                    cardId: item.cardId,
                    mood: item.mood,
                    notes: item.notes
                }
            })))
        }

        // Fetch journal entries
        if (!type || type === 'all' || type === 'journal') {
            const journalFilter: any = { userId }
            if (Object.keys(dateFilter).length > 0) {
                journalFilter.createdAt = dateFilter
            }

            const journalEntries = await JournalEntry.find(journalFilter)
                .sort({ createdAt: -1 })
                .limit(100)
                .lean()

            activities.push(...journalEntries.map(item => ({
                id: item._id.toString(),
                type: 'journal',
                date: item.createdAt,
                data: {
                    title: item.title,
                    content: item.content,
                    mood: item.mood,
                    tags: item.tags,
                    aiInsights: item.aiInsights,
                    isPrivate: item.isPrivate
                }
            })))
        }

        // Fetch mood logs
        if (!type || type === 'all' || type === 'mood') {
            const moodFilter: any = { userId }
            if (Object.keys(dateFilter).length > 0) {
                moodFilter.date = dateFilter
            }

            const moodLogs = await MoodLog.find(moodFilter)
                .sort({ date: -1 })
                .limit(100)
                .lean()

            activities.push(...moodLogs.map(item => ({
                id: item._id.toString(),
                type: 'mood',
                date: item.date,
                data: {
                    mood: item.mood,
                    energyLevel: item.energyLevel,
                    notes: item.notes,
                    emotions: item.emotions
                }
            })))
        }

        // Sort all activities by date
        activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        // Group by date for calendar view
        const groupedByDate: Record<string, any[]> = {}
        activities.forEach(activity => {
            const dateKey = new Date(activity.date).toISOString().split('T')[0]
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = []
            }
            groupedByDate[dateKey].push(activity)
        })

        return NextResponse.json({
            activities,
            groupedByDate,
            count: activities.length
        })

    } catch (error) {
        console.error('Error fetching activity history:', error)
        return NextResponse.json(
            { error: 'Failed to fetch history', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
