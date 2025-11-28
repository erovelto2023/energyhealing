import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BlogPost } from '@/lib/models'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    try {
        await dbConnect()
        const post = await BlogPost.findOne({ slug: params.slug, isPublished: true })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error fetching post by slug:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
