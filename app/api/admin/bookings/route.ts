import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { BookingRequest } from '@/lib/models'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const bookings = await BookingRequest.find({})
            .sort({ createdAt: -1 })
            .limit(100)

        // Debug: get keys of the first booking
        const debugKeys = bookings.length > 0 ? Object.keys(bookings[0].toObject()) : [];
        console.log('Available Booking Keys:', debugKeys);

        return NextResponse.json({ bookings, debugKeys });
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const body = await req.json()
        const { id, status, notes } = body

        if (!id) {
            return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
        }

        const updateData: any = {}
        if (status) updateData.status = status
        if (notes !== undefined) updateData.notes = notes

        const booking = await BookingRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        return NextResponse.json({ booking })
    } catch (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
export async function DELETE(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
        }

        await BookingRequest.findByIdAndDelete(id)

        return NextResponse.json({ message: 'Booking deleted successfully' })
    } catch (error) {
        console.error('Error deleting booking:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
