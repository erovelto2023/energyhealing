import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { BlogPost } from '@/lib/models';
import { validateAdmin } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = parseInt(searchParams.get('skip') || '0');

        const posts = await BlogPost.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await BlogPost.countDocuments();

        return NextResponse.json({ posts, total });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!await validateAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const data = await request.json();

        // Basic validation
        if (!data.title || !data.content) {
            return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
        }

        const newPost = await BlogPost.create(data);
        return NextResponse.json(newPost);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
