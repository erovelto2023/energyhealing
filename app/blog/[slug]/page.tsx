import Link from 'next/link'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import { BlogPost } from '@/lib/models'

export const revalidate = 60

async function getPost(slug: string) {
    await dbConnect()
    const post = await BlogPost.findOne({ slug, isPublished: true }).lean()

    if (!post) return null

    return {
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString()
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug)
    if (!post) return {}

    return {
        title: `${post.title} | Kathleen Heals`,
        description: post.excerpt || post.title,
    }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-gray-900 text-white pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px] w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10" />
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-6xl">✨</span>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 z-20 container-custom pb-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors"
                    >
                        ← Back to Blog
                    </Link>

                    <div className="flex gap-2 mb-4">
                        {post.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="text-sm font-medium px-3 py-1 rounded-full bg-purple-600/80 text-white backdrop-blur-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center text-gray-300 text-sm md:text-base">
                        <span>{new Date(post.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                        <span className="mx-2">•</span>
                        <span>Kathleen Heals</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container-custom max-w-4xl mt-12">
                <div
                    className="prose prose-lg prose-invert max-w-none
                        prose-headings:text-purple-100 prose-headings:font-bold
                        prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
                        prose-strong:text-white
                        prose-blockquote:border-l-purple-500 prose-blockquote:bg-gray-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                        prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </article>
    )
}
