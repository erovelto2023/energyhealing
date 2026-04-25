import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db'
import { BlogPost } from '@/lib/models'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectToDatabase()
        const { slug } = await params
        const post = await BlogPost.findOne({ slug: slug, isPublished: true })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error fetching post by slug:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
