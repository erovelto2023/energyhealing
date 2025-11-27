import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { CardPull, EnergyLog, Streak } from '@/lib/models'
import { getRandomCard, getCardById } from '@/lib/cardData'

// GET - Check if user can pull a card today and get last pull
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0]

        // Check if user already pulled a card today
        const todayLog = await EnergyLog.findOne({ userId, date: today })

        if (todayLog) {
            // User already pulled today, return the card
            const cardPull = await CardPull.findById(todayLog.cardPullId)
            const card = getCardById(cardPull.cardId)

            return NextResponse.json({
                canPull: false,
                lastPull: {
                    card,
                    pulledAt: cardPull.pulledAt,
                    mood: cardPull.mood,
                    notes: cardPull.notes
                }
            })
        }

        // User can pull a new card
        return NextResponse.json({ canPull: true })

    } catch (error) {
        console.error('Error checking card pull status:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Pull a new card
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const today = new Date().toISOString().split('T')[0]

        // Check if user already pulled today
        const existingLog = await EnergyLog.findOne({ userId, date: today })

        if (existingLog) {
            return NextResponse.json({ error: 'Already pulled a card today' }, { status: 400 })
        }

        // Get random card
        const card = getRandomCard()

        // Create card pull record
        const cardPull = await CardPull.create({
            userId,
            cardId: card.id,
            pulledAt: new Date()
        })

        // Create energy log entry
        await EnergyLog.create({
            userId,
            date: today,
            cardPullId: cardPull._id
        })

        // Update streak
        let streak = await Streak.findOne({ userId })

        if (!streak) {
            // First time user
            streak = await Streak.create({
                userId,
                currentStreak: 1,
                longestStreak: 1,
                lastPullDate: today
            })
        } else {
            // Check if streak continues
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split('T')[0]

            if (streak.lastPullDate === yesterdayStr) {
                // Streak continues
                streak.currentStreak += 1
                if (streak.currentStreak > streak.longestStreak) {
                    streak.longestStreak = streak.currentStreak
                }
            } else if (streak.lastPullDate !== today) {
                // Streak broken
                streak.currentStreak = 1
            }

            streak.lastPullDate = today

            // Check for achievements
            const milestones = [3, 7, 14, 30, 60, 90, 365]
            for (const milestone of milestones) {
                if (streak.currentStreak === milestone) {
                    const achievementType = `streak_${milestone}` as any
                    const hasAchievement = streak.achievements.some((a: any) => a.type === achievementType)
                    if (!hasAchievement) {
                        streak.achievements.push({ type: achievementType, unlockedAt: new Date() })
                    }
                }
            }

            await streak.save()
        }

        return NextResponse.json({
            card,
            streak: {
                current: streak.currentStreak,
                longest: streak.longestStreak,
                newAchievements: streak.achievements.filter((a: any) => {
                    const achievementDate = new Date(a.unlockedAt).toISOString().split('T')[0]
                    return achievementDate === today
                })
            }
        })

    } catch (error) {
        console.error('Error pulling card:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH - Update card pull with mood/notes
export async function PATCH(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { mood, notes } = await request.json()

        await dbConnect()

        const today = new Date().toISOString().split('T')[0]
        const todayLog = await EnergyLog.findOne({ userId, date: today })

        if (!todayLog) {
            return NextResponse.json({ error: 'No card pull found for today' }, { status: 404 })
        }

        // Update card pull
        await CardPull.findByIdAndUpdate(todayLog.cardPullId, {
            mood,
            notes
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error updating card pull:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
