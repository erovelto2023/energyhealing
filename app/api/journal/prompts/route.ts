import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { JournalPrompt } from '@/lib/models'
import { suggestPrompts } from '@/lib/journalAI'

export async function GET(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const searchParams = req.nextUrl.searchParams
        const category = searchParams.get('category')
        const type = searchParams.get('type')
        const ai = searchParams.get('ai') === 'true'

        // If AI prompts requested
        if (ai) {
            const mood = searchParams.get('mood') || undefined
            const recentTopics = searchParams.get('topics')?.split(',') || undefined

            const aiPrompts = await suggestPrompts(mood, recentTopics)
            return NextResponse.json({ prompts: aiPrompts.map(p => ({ prompt: p, type: 'ai-generated' })) })
        }

        // Otherwise fetch from database
        const query: any = { isActive: true }
        if (category) query.category = category
        if (type) query.type = type

        const prompts = await JournalPrompt.find(query).limit(20)

        return NextResponse.json({ prompts })
    } catch (error) {
        console.error('Error fetching prompts:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
