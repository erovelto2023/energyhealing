'use client'

import BlogEditor from '../editor'
import Link from 'next/link'

export default function NewBlogPost() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/blog" className="text-gray-400 hover:text-white">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                </div>

                <BlogEditor />
            </div>
        </div>
    )
}
