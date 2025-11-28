'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BlogEditor from '../editor'

export default function EditBlogPost({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPost()
    }, [])

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setPost(data.post)
            } else {
                router.push('/admin/blog')
            }
        } catch (error) {
            console.error('Error fetching post:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
    }

    if (!post) return null

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/blog" className="text-gray-400 hover:text-white">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Post</h1>
                </div>

                <BlogEditor initialData={post} postId={params.id} />
            </div>
        </div>
    )
}
