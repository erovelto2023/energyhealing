import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/db';
import UserStory from '@/lib/models/UserStory';

// GET - Fetch all user stories (pending and approved)
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

        const stories = await UserStory.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ stories });
    } catch (error: any) {
        console.error('Fetch user stories error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// PATCH - Approve/Deny user story
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
            const story = await UserStory.findOneAndUpdate(
                { id },
                {
                    approved: true,
                    ...(featured !== undefined && { featured })
                },
                { new: true }
            );

            if (!story) {
                return NextResponse.json(
                    { error: 'Story not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Story approved',
                story
            });
        } else if (action === 'deny') {
            // Delete denied stories
            const result = await UserStory.findOneAndDelete({ id });

            if (!result) {
                return NextResponse.json(
                    { error: 'Story not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Story denied and removed'
            });
        } else if (action === 'toggle-featured') {
            const story = await UserStory.findOne({ id });

            if (!story) {
                return NextResponse.json(
                    { error: 'Story not found' },
                    { status: 404 }
                );
            }

            story.featured = !story.featured;
            await story.save();

            return NextResponse.json({
                success: true,
                message: `Story ${story.featured ? 'featured' : 'unfeatured'}`,
                story
            });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('Update user story error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
