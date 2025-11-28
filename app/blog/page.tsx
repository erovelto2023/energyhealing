import Link from 'next/link'
import dbConnect from '@/lib/mongodb'
import { BlogPost } from '@/lib/models'

export const revalidate = 60 // Revalidate every minute

async function getPosts() {
    await dbConnect()
    const posts = await BlogPost.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .select('title slug excerpt coverImage tags createdAt')
        .lean()

    // Serialize MongoDB objects
    return posts.map(post => ({
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString()
    }))
}

export default async function BlogIndex() {
    const posts = await getPosts()

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-32 pb-16">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Healing Wisdom
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Insights, practices, and stories to support your journey of natural healing and spiritual growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post._id}
                            className="group glass-card overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300"
                        >
                            {post.coverImage && (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex gap-2 mb-4">
                                    {post.tags.slice(0, 2).map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-medium px-2 py-1 rounded-full bg-purple-900/50 text-purple-200"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">Read More →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No posts published yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
