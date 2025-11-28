import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { BlogPost } from '@/lib/models'
import slugify from 'slugify'

export async function GET(req: Request) {
    try {
        await dbConnect()
        const { userId } = auth()
        const url = new URL(req.url)
        const isAdmin = userId // In a real app, check for specific admin role/ID
        const showAll = isAdmin && url.searchParams.get('all') === 'true'

        const query = showAll ? {} : { isPublished: true }
        const posts = await BlogPost.find(query).sort({ createdAt: -1 })

        return NextResponse.json({ posts })
    } catch (error) {
        console.error('Error fetching posts:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()
        const body = await req.json()

        // Generate slug from title if not provided
        let slug = body.slug
        if (!slug && body.title) {
            slug = slugify(body.title, { lower: true, strict: true })
        }

        // Ensure slug is unique
        let uniqueSlug = slug
        let counter = 1
        while (await BlogPost.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter}`
            counter++
        }

        const post = await BlogPost.create({
            ...body,
            slug: uniqueSlug
        })

        return NextResponse.json({ post }, { status: 201 })
    } catch (error) {
        console.error('Error creating post:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
