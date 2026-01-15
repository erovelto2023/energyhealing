import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const data = await request.json();

        // Validate required fields
        if (!data.clientName || !data.email || !data.testimonialText || !data.rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate unique ID
        const timestamp = Date.now();
        const id = `testimonial-${timestamp}`;

        // Generate initials if not allowing public name
        const clientInitials = data.allowPublicName
            ? undefined
            : data.clientName.split(' ').map((n: string) => n[0]).join('.') + '.';

        // Create testimonial (unapproved by default)
        const testimonial = await Testimonial.create({
            id,
            clientName: data.clientName,
            clientInitials,
            email: data.email, // Store for admin verification
            rating: data.rating,
            testimonialText: data.testimonialText,
            issue: data.issue || undefined,
            outcome: data.outcome || undefined,
            sessionType: data.sessionType || undefined,
            location: data.location || undefined,
            featured: false, // Admin will decide
            approved: false, // Requires admin approval
            date: new Date(),
        });

        // TODO: Send email notification to admin about new testimonial

        return NextResponse.json({
            success: true,
            message: 'Testimonial submitted successfully',
            id: testimonial.id
        });
    } catch (error: any) {
        console.error('Testimonial submission error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
