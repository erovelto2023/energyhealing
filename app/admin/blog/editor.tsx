'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import 'react-quill/dist/quill.snow.css'
import AIBlogSidebar from '@/components/admin/AIBlogSidebar'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface BlogEditorProps {
    initialData?: {
        title: string
        content: string
        excerpt: string
        coverImage: string
        tags: string[]
        isPublished: boolean
    }
    postId?: string
}

export default function BlogEditor({ initialData, postId }: BlogEditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    // const [isGenerating, setIsGenerating] = useState(false) // Removed
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        coverImage: initialData?.coverImage || '',
        tags: initialData?.tags.join(', ') || '',
        isPublished: initialData?.isPublished || false
    })

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'code-block'], // Added code-block
            ['clean']
        ],
    }

    const handleAIContent = (content: string) => {
        setFormData(prev => ({
            ...prev,
            content: content // For now, replace content. In future, could append or insert.
        }))
        // setIsGenerating(false) // Removed
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = postId ? `/api/blog/${postId}` : '/api/blog'
            const method = postId ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                })
            })

            if (res.ok) {
                router.push('/admin/blog')
                router.refresh()
            } else {
                console.error('Failed to save post')
            }
        } catch (error) {
            console.error('Error saving post:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative">
            <AIBlogSidebar
                onGenerate={(content) => handleAIContent(content)}
            // isGenerating={isGenerating} // Removed
            />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pr-16"> {/* Added padding-right for sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                            <div className="bg-white rounded-lg text-gray-900 overflow-hidden flex flex-col h-[calc(100vh-300px)] min-h-[600px]">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    modules={modules}
                                    className="h-full flex flex-col"
                                />
                                {/* Custom style to make Quill editor fill height and scroll */}
                                <style jsx global>{`
                                    .ql-container {
                                        flex: 1;
                                        overflow-y: auto;
                                        font-size: 1.1rem;
                                    }
                                    .ql-editor {
                                        min-height: 100%;
                                    }
                                `}</style>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white">Publishing</h3>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                                />
                                <label htmlFor="isPublished" className="text-gray-300">Publish immediately</label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary"
                            >
                                {loading ? 'Saving...' : (postId ? 'Update Post' : 'Create Post')}
                            </button>
                        </div>

                        <div className="glass-card p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white h-32 text-sm"
                                    placeholder="Short summary for cards..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
                                <input
                                    type="text"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white text-sm"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white text-sm"
                                    placeholder="healing, reiki, wellness"
                                />
                                <p className="text-xs text-gray-500 mt-1">Comma separated</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
