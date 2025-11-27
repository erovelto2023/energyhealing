import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzeJournalEntry } from '@/lib/journalAI'

export async function POST(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { content, mood, emotions, energyLevel } = body

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        const analysis = await analyzeJournalEntry(content, mood, emotions, energyLevel)

        return NextResponse.json({ analysis })
    } catch (error) {
        console.error('Error analyzing journal entry:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
