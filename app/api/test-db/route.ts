import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { JournalEntry } from '@/lib/models'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        console.log('Test DB: Connecting...')
        await dbConnect()
        console.log('Test DB: Connected')

        console.log('Test DB: Creating dummy entry...')
        // Create a temporary entry in memory (validate)
        const entry = new JournalEntry({
            userId: 'test-user',
            content: 'Test content',
            mood: 'calm',
            energyLevel: 5,
            isPrivate: true
        })

        console.log('Test DB: Validating entry...')
        await entry.validate()
        console.log('Test DB: Validation successful')

        return NextResponse.json({ status: 'success', message: 'DB Connection and Model Validation working' })
    } catch (error) {
        console.error('Test DB Error:', error)
        return NextResponse.json({
            status: 'error',
            message: String(error),
            // @ts-ignore
            stack: error.stack
        }, { status: 500 })
    }
}
