import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { EnergyLog, CardPull } from '@/lib/models'
import { getCardById } from '@/lib/cardData'

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        // Get all energy logs for user, sorted by date descending
        const logs = await EnergyLog.find({ userId })
            .sort({ date: -1 })
            .limit(90) // Last 90 days
            .populate('cardPullId')

        const energyHistory = await Promise.all(
            logs.map(async (log) => {
                const cardPull = await CardPull.findById(log.cardPullId)
                const card = getCardById(cardPull.cardId)

                return {
                    date: log.date,
                    card,
                    mood: cardPull.mood,
                    notes: cardPull.notes,
                    reflection: log.reflection
                }
            })
        )

        return NextResponse.json({ history: energyHistory })

    } catch (error) {
        console.error('Error fetching energy log:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH - Add reflection to a specific day
export async function PATCH(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { date, reflection } = await request.json()

        await dbConnect()

        const log = await EnergyLog.findOne({ userId, date })

        if (!log) {
            return NextResponse.json({ error: 'No log found for this date' }, { status: 404 })
        }

        log.reflection = reflection
        await log.save()

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error updating energy log:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
