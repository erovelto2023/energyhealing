import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import UserStory from '@/lib/models/UserStory';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const data = await request.json();

        // Validate required fields
        if (!data.authorName || !data.email || !data.title || !data.story) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate unique ID
        const timestamp = Date.now();
        const id = `story-${timestamp}`;

        // Generate initials if not allowing public name
        const authorInitials = data.allowPublicName
            ? undefined
            : data.authorName.split(' ').map((n: string) => n[0]).join('.') + '.';

        // Create user story (unapproved by default)
        const userStory = await UserStory.create({
            id,
            authorName: data.authorName,
            authorInitials,
            email: data.email,
            title: data.title,
            story: data.story,
            painType: data.painType || undefined,
            duration: data.duration || undefined,
            whatHelped: data.whatHelped || undefined,
            whatDidntHelp: data.whatDidntHelp || undefined,
            currentStatus: data.currentStatus || undefined,
            category: data.category || undefined,
            location: data.location || undefined,
            age: data.age || undefined,
            featured: false,
            approved: false,
        });

        // TODO: Send email notification to admin about new story

        return NextResponse.json({
            success: true,
            message: 'Story submitted successfully',
            id: userStory.id
        });
    } catch (error: any) {
        console.error('User story submission error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
