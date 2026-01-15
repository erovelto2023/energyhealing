import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/db';
import StoryComment from '@/lib/models/StoryComment';

// GET - Fetch all comments (pending and approved)
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

        const comments = await StoryComment.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ comments });
    } catch (error: any) {
        console.error('Fetch comments error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// PATCH - Approve/Deny comment
export async function PATCH(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, action } = await request.json();

        if (!id || !action) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (action === 'approve') {
            const comment = await StoryComment.findOneAndUpdate(
                { id },
                { approved: true },
                { new: true }
            );

            if (!comment) {
                return NextResponse.json(
                    { error: 'Comment not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Comment approved',
                comment
            });
        } else if (action === 'deny') {
            const result = await StoryComment.findOneAndDelete({ id });

            if (!result) {
                return NextResponse.json(
                    { error: 'Comment not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Comment denied and removed'
            });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('Update comment error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
