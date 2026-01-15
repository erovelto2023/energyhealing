import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { BookingRequest } from '@/lib/models';
import { sendBookingNotification } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        console.log('Incoming Booking Data:', data);

        const booking = await BookingRequest.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            service: data.service,
            bookingDate: data.bookingDate,
            bookingTime: data.bookingTime,
            message: data.message,
        });

        console.log('Created Booking Object:', booking);

        // Send email notification (don't await to keep response fast)
        sendBookingNotification(data).catch(err => console.error('Email trigger failed:', err));

        return NextResponse.json({ success: true, booking });
    } catch (error: any) {
        console.error('Booking submission error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
