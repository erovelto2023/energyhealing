import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { BlogPost } from '@/lib/models'

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect()
        const post = await BlogPost.findById(params.id)

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error fetching post:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()
        const body = await req.json()

        const post = await BlogPost.findByIdAndUpdate(
            params.id,
            { ...body, updatedAt: new Date() },
            { new: true }
        )

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error updating post:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()
        const post = await BlogPost.findByIdAndDelete(params.id)

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Post deleted successfully' })
    } catch (error) {
        console.error('Error deleting post:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
