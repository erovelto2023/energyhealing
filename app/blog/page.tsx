import Link from 'next/link'
import dbConnect from '@/lib/mongodb'
import { BlogPost } from '@/lib/models'
import HeroSlideshow, { HeroContent } from '@/components/features/HeroSlideshow'
import path from 'path'
import fs from 'fs'

const BLOG_HERO_CONTENT: HeroContent[] = [
    // 🔥 High-Impact Healing Blog Headlines
    { title: "Why Your Body Holds Pain Long After the Stress Is Gone", category: "High-Impact Healing" },
    { title: "The Hidden Link Between Emotional Stress and Chronic Pain", category: "High-Impact Healing" },
    { title: "When Rest Isn’t Enough: Understanding Nervous System Burnout", category: "High-Impact Healing" },
    { title: "How Stored Emotions Manifest as Physical Pain", category: "High-Impact Healing" },
    { title: "Healing Begins When You Stop Forcing Your Body to Cope", category: "High-Impact Healing" },

    // 🌿 Awareness & Root-Cause Healing
    { title: "You’re Not Broken—Your Body Is Protecting You", category: "Awareness & Root-Cause Healing" },
    { title: "The Real Reason Pain Keeps Returning (And What Actually Helps)", category: "Awareness & Root-Cause Healing" },
    { title: "What Your Chronic Pain Is Trying to Communicate", category: "Awareness & Root-Cause Healing" },
    { title: "Why Treating Symptoms Alone Rarely Leads to Lasting Relief", category: "Awareness & Root-Cause Healing" },
    { title: "How Awareness Changes the Way Your Body Experiences Pain", category: "Awareness & Root-Cause Healing" },

    // 🧠 Nervous System & Stress Healing
    { title: "The Nervous System’s Role in Chronic Pain and Emotional Overload", category: "Nervous System & Stress Healing" },
    { title: "Why Your Body Can’t Heal While It Feels Unsafe", category: "Nervous System & Stress Healing" },
    { title: "Stress Isn’t Just Mental—It Lives in the Body", category: "Nervous System & Stress Healing" },
    { title: "How Chronic Stress Trains the Body to Stay in Pain", category: "Nervous System & Stress Healing" },
    { title: "Regulating the Nervous System: The Missing Piece in Healing", category: "Nervous System & Stress Healing" },

    // ✨ Energy, Subtle Healing & Balance
    { title: "What Energy Healing Really Is (And What It Isn’t)", category: "Energy, Subtle Healing & Balance" },
    { title: "How Energy Imbalances Contribute to Physical and Emotional Pain", category: "Energy, Subtle Healing & Balance" },
    { title: "Why Gentle Healing Often Works Better Than Force", category: "Energy, Subtle Healing & Balance" },
    { title: "Healing Doesn’t Have to Hurt to Be Effective", category: "Energy, Subtle Healing & Balance" },
    { title: "The Quiet Power of Subtle Energy in the Healing Process", category: "Energy, Subtle Healing & Balance" },

    // 🌊 Emotional Release & Trauma-Informed Healing
    { title: "Why Emotional Healing Can Feel Physical", category: "Emotional Release & Trauma-Informed Healing" },
    { title: "How the Body Releases What the Mind Can’t Process", category: "Emotional Release & Trauma-Informed Healing" },
    { title: "When the Past Lives in the Nervous System", category: "Emotional Release & Trauma-Informed Healing" },
    { title: "You Don’t Need to Relive Trauma to Heal It", category: "Emotional Release & Trauma-Informed Healing" },
    { title: "Why Safety, Not Effort, Is the Key to Healing", category: "Emotional Release & Trauma-Informed Healing" },

    // 🌟 Empowerment & Transformation
    { title: "Your Body Is Always Working Toward Healing—even in Pain", category: "Empowerment & Transformation" },
    { title: "Healing Isn’t Linear—and That’s Why It Works", category: "Empowerment & Transformation" },
    { title: "What True Balance Feels Like in the Body", category: "Empowerment & Transformation" },
    { title: "From Survival Mode to Self-Regulation", category: "Empowerment & Transformation" },
    { title: "What Changes When the Body Finally Feels Heard", category: "Empowerment & Transformation" },
];

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

    const heroImagesDir = path.join(process.cwd(), 'public/images/hero-slideshow');
    let heroImages: string[] = [];
    try {
        const files = fs.readdirSync(heroImagesDir);
        heroImages = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
            .map(file => `/images/hero-slideshow/${file}`);
    } catch (error) {
        console.error("Error reading hero images:", error);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <HeroSlideshow images={heroImages} content={BLOG_HERO_CONTENT} />
            <div className="container-custom py-16">


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
