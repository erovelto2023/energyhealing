import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db'
import { BookingRequest } from '@/lib/models'
import { validateAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        if (!await validateAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()

        const bookings = await BookingRequest.find({})
            .sort({ createdAt: -1 })
            .limit(100)

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!await validateAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()

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
        if (!await validateAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()

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
