import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import UserStory from '@/lib/models/UserStory';
import StoryComment from '@/lib/models/StoryComment';
import { ArrowLeft, BookHeart, Calendar, MapPin, User, MessageCircle } from 'lucide-react';
import StoryCommentForm from '@/components/features/StoryCommentForm';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    await connectToDatabase();
    const story = await UserStory.findOne({ id: resolvedParams.id, approved: true }).lean();

    if (!story) {
        return { title: 'Story Not Found' };
    }

    return {
        title: `${story.title} | Healing Stories`,
        description: story.story.substring(0, 160),
    };
}

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    await connectToDatabase();

    const [story, comments] = await Promise.all([
        UserStory.findOne({ id: resolvedParams.id, approved: true }).lean(),
        StoryComment.find({ storyId: resolvedParams.id, approved: true })
            .sort({ createdAt: -1 })
            .select('-email')
            .lean()
    ]);

    if (!story) {
        notFound();
    }

    const serializedStory = JSON.parse(JSON.stringify(story));
    const serializedComments = JSON.parse(JSON.stringify(comments));

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Back Button */}
                <Link
                    href="/stories"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to All Stories
                </Link>

                {/* Story Card */}
                <article className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden mb-12">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 md:p-12 text-white">
                        {serializedStory.category && (
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                                {serializedStory.category}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">
                            {serializedStory.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                {serializedStory.authorInitials || serializedStory.authorName}
                            </div>
                            {serializedStory.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    {serializedStory.location}
                                </div>
                            )}
                            {serializedStory.createdAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(serializedStory.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="p-8 md:p-12">
                        {/* Metadata Tags */}
                        {(serializedStory.painType || serializedStory.duration || serializedStory.currentStatus || serializedStory.age) && (
                            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-slate-100">
                                {serializedStory.painType && (
                                    <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-100">
                                        {serializedStory.painType}
                                    </span>
                                )}
                                {serializedStory.duration && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                                        Duration: {serializedStory.duration}
                                    </span>
                                )}
                                {serializedStory.currentStatus && (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                                        {serializedStory.currentStatus}
                                    </span>
                                )}
                                {serializedStory.age && (
                                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-sm font-medium rounded-full border border-slate-100">
                                        Age: {serializedStory.age}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Main Story */}
                        <div className="prose prose-lg max-w-none mb-8">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {serializedStory.story}
                            </p>
                        </div>

                        {/* What Helped / Didn't Help */}
                        {(serializedStory.whatHelped || serializedStory.whatDidntHelp) && (
                            <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
                                {serializedStory.whatHelped && (
                                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-widest mb-3">
                                            What Helped
                                        </h3>
                                        <p className="text-emerald-800 leading-relaxed">
                                            {serializedStory.whatHelped}
                                        </p>
                                    </div>
                                )}
                                {serializedStory.whatDidntHelp && (
                                    <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                        <h3 className="text-sm font-bold text-red-900 uppercase tracking-widest mb-3">
                                            What Didn't Help
                                        </h3>
                                        <p className="text-red-800 leading-relaxed">
                                            {serializedStory.whatDidntHelp}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </article>

                {/* Comments Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <MessageCircle size={24} className="text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-900">
                            Comments ({serializedComments.length})
                        </h2>
                    </div>

                    {/* Comment Form */}
                    <div className="mb-12 p-6 bg-slate-50 rounded-2xl">
                        <h3 className="font-bold text-slate-900 mb-4">Leave a Comment</h3>
                        <StoryCommentForm storyId={serializedStory.id} />
                    </div>

                    {/* Comments List */}
                    {serializedComments.length > 0 ? (
                        <div className="space-y-6">
                            {serializedComments.map((comment: any) => (
                                <div key={comment.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                {comment.authorName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{comment.authorName}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">
                                        {comment.commentText}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <MessageCircle size={48} className="mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-semibold mb-2">No comments yet</p>
                            <p className="text-sm">Be the first to share your thoughts or encouragement!</p>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-indigo-100">
                    <BookHeart size={40} className="mx-auto text-indigo-600 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Have Your Own Story?</h3>
                    <p className="text-slate-600 mb-6">Your journey can inspire and connect with others.</p>
                    <Link href="/share-story" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        Share Your Healing Story
                    </Link>
                </div>
            </div>
        </div>
    );
}
