import { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import UserStory from '@/lib/models/UserStory';
import { BookHeart, Calendar, MapPin, User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Healing Stories | Kathleen Heals',
    description: 'Read real healing journeys from people living with chronic pain and finding their path to wellness.',
};

export default async function StoriesPage() {
    await connectToDatabase();

    const stories = await UserStory.find({ approved: true })
        .sort({ createdAt: -1 })
        .select('id title authorName authorInitials painType category location createdAt story')
        .lean();

    const serializedStories = JSON.parse(JSON.stringify(stories));

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-indigo-100">
                        <BookHeart size={14} />
                        Community Healing Stories
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Real Stories, Real People
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Read personal journeys from people living with chronic pain, sharing what they've learned and where they are now.
                    </p>
                </div>

                {/* Stories Grid */}
                {serializedStories.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-indigo-100">
                        <BookHeart size={48} className="mx-auto text-indigo-300 mb-4" />
                        <p className="text-slate-500 text-lg mb-6">No stories have been shared yet.</p>
                        <Link href="/share-story" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                            Be the First to Share
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {serializedStories.map((story: any) => (
                            <Link
                                key={story.id}
                                href={`/stories/${story.id}`}
                                className="group bg-white rounded-3xl border-2 border-indigo-100 p-8 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Category Badge */}
                                {story.category && (
                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-indigo-100">
                                        {story.category}
                                    </span>
                                )}

                                {/* Title */}
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {story.title}
                                </h2>

                                {/* Preview */}
                                <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
                                    {story.story}
                                </p>

                                {/* Metadata */}
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-1">
                                        <User size={12} />
                                        {story.authorInitials || story.authorName}
                                    </div>
                                    {story.painType && (
                                        <div className="flex items-center gap-1">
                                            <span>•</span>
                                            {story.painType}
                                        </div>
                                    )}
                                    {story.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {story.location}
                                        </div>
                                    )}
                                    {story.createdAt && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(story.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                {/* Read More */}
                                <div className="mt-4 text-indigo-600 font-bold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                                    Read Full Story →
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-indigo-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Have a Story to Share?</h3>
                    <p className="text-slate-600 mb-6">Your journey can inspire and connect with others facing similar challenges.</p>
                    <Link href="/share-story" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        Share Your Healing Story
                    </Link>
                </div>
            </div>
        </div>
    );
}
