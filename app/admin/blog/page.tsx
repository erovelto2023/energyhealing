'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BlogPost {
    _id: string
    title: string
    slug: string
    isPublished: boolean
    createdAt: string
    views?: number
}

export default function AdminBlogDashboard() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/')
        } else if (user) {
            fetchPosts()
        }
    }, [user, isLoaded])

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog?all=true')
            if (res.ok) {
                const data = await res.json()
                setPosts(data.posts)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const deletePost = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return

        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setPosts(posts.filter(p => p._id !== id))
            }
        } catch (error) {
            console.error('Error deleting post:', error)
        }
    }

    const togglePublish = async (post: BlogPost) => {
        try {
            const res = await fetch(`/api/blog/${post._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !post.isPublished })
            })

            if (res.ok) {
                setPosts(posts.map(p =>
                    p._id === post._id ? { ...p, isPublished: !p.isPublished } : p
                ))
            }
        } catch (error) {
            console.error('Error updating post:', error)
        }
    }

    if (!isLoaded || loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Blog Management</h1>
                    <Link href="/admin/blog/new" className="btn-primary px-6 py-2 rounded-full text-sm">
                        + Create New Post
                    </Link>
                </div>

                <div className="glass-card p-6 mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="p-4 font-medium">
                                            {post.title}
                                            <div className="text-xs text-gray-500 mt-1">/{post.slug}</div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => togglePublish(post)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${post.isPublished
                                                        ? 'bg-green-900 text-green-200 hover:bg-green-800'
                                                        : 'bg-yellow-900 text-yellow-200 hover:bg-yellow-800'
                                                    }`}
                                            >
                                                {post.isPublished ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/admin/blog/${post._id}`}
                                                    className="text-purple-400 hover:text-purple-300 text-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deletePost(post._id)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Delete
                                                </button>
                                                {post.isPublished && (
                                                    <a
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                                    >
                                                        View
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">No blog posts yet.</p>
                            <Link href="/admin/blog/new" className="text-purple-400 hover:text-purple-300">
                                Create your first post →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
