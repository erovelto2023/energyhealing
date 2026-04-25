'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BlogEditor from '../editor'
import AdminGuard from '@/components/admin/AdminGuard'

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/blog/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setPost(data) // The API returns the post directly
                } else {
                    router.push('/admin/blog')
                }
            } catch (error) {
                console.error('Error fetching post:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [id, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
    }

    if (!post) return null

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin/blog" className="text-gray-400 hover:text-white">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold">Edit Post</h1>
                    </div>

                    <BlogEditor initialData={post} postId={id} />
                </div>
            </div>
        </AdminGuard>
    )
}
