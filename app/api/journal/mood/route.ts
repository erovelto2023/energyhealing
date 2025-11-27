import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { MoodLog } from '@/lib/models'

export async function POST(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const body = await req.json()
        const { date, mood, emotions, physicalFeelings, energyLevel, notes } = body

        // Check if log already exists for this date
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const existingLog = await MoodLog.findOne({
            userId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

        if (existingLog) {
            // Update existing log
            existingLog.mood = mood
            existingLog.emotions = emotions
            existingLog.physicalFeelings = physicalFeelings
            existingLog.energyLevel = energyLevel
            existingLog.notes = notes
            await existingLog.save()
            return NextResponse.json({ log: existingLog })
        }

        // Create new log
        const log = await MoodLog.create({
            userId,
            date: new Date(date),
            mood,
            emotions,
            physicalFeelings,
            energyLevel,
            notes
        })

        return NextResponse.json({ log }, { status: 201 })
    } catch (error) {
        console.error('Error logging mood:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
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
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        const query: any = { userId }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }

        const logs = await MoodLog.find(query).sort({ date: -1 })

        return NextResponse.json({ logs })
    } catch (error) {
        console.error('Error fetching mood logs:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
