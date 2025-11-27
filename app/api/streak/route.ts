import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Streak } from '@/lib/models'

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        let streak = await Streak.findOne({ userId })

        if (!streak) {
            // Create initial streak record
            streak = await Streak.create({
                userId,
                currentStreak: 0,
                longestStreak: 0
            })
        }

        return NextResponse.json({
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastPullDate: streak.lastPullDate,
            achievements: streak.achievements
        })

    } catch (error) {
        console.error('Error fetching streak:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
