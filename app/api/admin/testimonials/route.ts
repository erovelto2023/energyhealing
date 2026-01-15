import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

// GET - Fetch all testimonials (pending and approved)
export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // 'pending', 'approved', 'all'

        let query = {};
        if (status === 'pending') {
            query = { approved: false };
        } else if (status === 'approved') {
            query = { approved: true };
        }

        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ testimonials });
    } catch (error: any) {
        console.error('Fetch testimonials error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// PATCH - Approve/Deny testimonial
export async function PATCH(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, action, featured } = await request.json();

        if (!id || !action) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (action === 'approve') {
            const testimonial = await Testimonial.findOneAndUpdate(
                { id },
                {
                    approved: true,
                    ...(featured !== undefined && { featured })
                },
                { new: true }
            );

            if (!testimonial) {
                return NextResponse.json(
                    { error: 'Testimonial not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Testimonial approved',
                testimonial
            });
        } else if (action === 'deny') {
            // Delete denied testimonials
            const result = await Testimonial.findOneAndDelete({ id });

            if (!result) {
                return NextResponse.json(
                    { error: 'Testimonial not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Testimonial denied and removed'
            });
        } else if (action === 'toggle-featured') {
            const testimonial = await Testimonial.findOne({ id });

            if (!testimonial) {
                return NextResponse.json(
                    { error: 'Testimonial not found' },
                    { status: 404 }
                );
            }

            testimonial.featured = !testimonial.featured;
            await testimonial.save();

            return NextResponse.json({
                success: true,
                message: `Testimonial ${testimonial.featured ? 'featured' : 'unfeatured'}`,
                testimonial
            });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('Update testimonial error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
