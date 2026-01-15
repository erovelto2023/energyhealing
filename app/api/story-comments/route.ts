import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import StoryComment from '@/lib/models/StoryComment';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const data = await request.json();

        if (!data.storyId || !data.authorName || !data.commentText) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const timestamp = Date.now();
        const id = `comment-${timestamp}`;

        const comment = await StoryComment.create({
            id,
            storyId: data.storyId,
            authorName: data.authorName,
            email: data.email,
            commentText: data.commentText,
            approved: false, // Requires admin approval
        });

        return NextResponse.json({
            success: true,
            message: 'Comment submitted for review',
            id: comment.id
        });
    } catch (error: any) {
        console.error('Comment submission error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// GET approved comments for a story
export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const storyId = searchParams.get('storyId');

        if (!storyId) {
            return NextResponse.json({ error: 'Story ID required' }, { status: 400 });
        }

        const comments = await StoryComment.find({
            storyId,
            approved: true
        })
            .sort({ createdAt: -1 })
            .select('-email') // Don't expose emails publicly
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
