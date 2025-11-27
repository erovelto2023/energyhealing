import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { JournalEntry } from '@/lib/models'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const entry = await JournalEntry.findOne({
            _id: params.id,
            userId
        })

        if (!entry) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
        }

        return NextResponse.json({ entry })
    } catch (error) {
        console.error('Error fetching journal entry:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const body = await req.json()

        // Check if analysis is requested
        if (body.analyze === true) {
            try {
                const { analyzeJournalEntry } = await import('@/lib/journalAI')
                const aiInsights = await analyzeJournalEntry(
                    body.content,
                    body.mood,
                    body.emotions,
                    body.energyLevel
                )
                body.aiInsights = aiInsights
            } catch (error) {
                console.error('AI Analysis failed during update:', error)
            }
        }

        // Protect sensitive fields from direct update if needed, 
        // but generally allow updating content/metadata
        const entry = await JournalEntry.findOneAndUpdate(
            { _id: params.id, userId },
            { $set: body },
            { new: true }
        )

        if (!entry) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
        }

        return NextResponse.json({ entry })
    } catch (error) {
        console.error('Error updating journal entry:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const entry = await JournalEntry.findOneAndDelete({
            _id: params.id,
            userId
        })

        if (!entry) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Entry deleted successfully' })
    } catch (error) {
        console.error('Error deleting journal entry:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
