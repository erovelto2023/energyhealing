import { getFAQBySlug, getFAQs, getOfferById, searchFAQs } from "@/lib/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, BrainCircuit, Lightbulb, Stethoscope, ArrowRight } from "lucide-react";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const faq = await getFAQBySlug(params.slug);
    if (!faq) return { title: "Question Not Found" };
    return {
        title: `${faq.h1Title || faq.question} | Kathleen Heals`,
        description: faq.answerSnippet.substring(0, 160),
    };
}

export async function generateStaticParams() {
    const faqs = await getFAQs();
    return faqs.map((faq: any) => ({
        slug: faq.slug,
    }));
}

export default async function QuestionPage({ params }: PageProps) {
    const faq = await getFAQBySlug(params.slug);

    if (!faq) {
        notFound();
    }

    // Fetch related offer if exists
    let offer = null;
    if (faq.relatedOfferId) {
        offer = await getOfferById(faq.relatedOfferId);
    }

    // Get random related questions for sidebar/bottom (using searchFAQs with random sample)
    const { faqs: randomFaqs } = await searchFAQs('', 1, 4);
    // Fetch 4 to have buffer if current faq is included
    const relatedFaqs = randomFaqs
        .filter((f: any) => f._id !== faq._id)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">

            <main className="pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">

                    {/* Breadcrumb / Back */}
                    <div className="mb-8">
                        <Link href="/questions" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Knowledge Base
                        </Link>
                    </div>

                    {/* HERO SECTION */}
                    <header className="mb-12 text-center">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            {faq.parentQuestion || "Holistic Inquiry"}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            {faq.h1Title}
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            {faq.question}
                        </p>
                    </header>

                    {/* QUICK ANSWER / FEATURED SNIPPET BOX */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-2xl p-8 mb-16 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-full shadow-sm text-blue-600 shrink-0 hidden md:block">
                                <Lightbulb size={24} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">The Quick Answer</h2>
                                <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium">
                                    {faq.answerSnippet}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* MAIN CONTENT */}
                        <div className="lg:col-span-8 space-y-16">

                            {/* DEEP DIVE: PROBLEM */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Why We Ask This</h2>
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                </div>
                                <div className="prose prose-lg prose-slate text-slate-600 leading-loose">
                                    {faq.deepDive?.problem || "Context not provided."}
                                </div>
                            </section>

                            {/* DEEP DIVE: METHODOLOGY */}
                            <section className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                                        <BrainCircuit size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">The Practical Science</h2>
                                </div>
                                <div className="prose prose-lg prose-slate text-slate-600 leading-loose">
                                    {faq.deepDive?.methodology || "Methodology not provided."}
                                </div>
                            </section>

                            {/* DEEP DIVE: APPLICATION */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                        <Stethoscope size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">In Clinical Practice</h2>
                                </div>
                                <div className="prose prose-lg prose-slate text-slate-600 leading-loose">
                                    {faq.deepDive?.application || "Application context not provided."}
                                </div>
                            </section>

                            {/* SOURCES */}
                            {(faq.linkUrl || faq.sourceText) && (
                                <section className="pt-8 border-t border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">References & Context</h3>
                                    {faq.linkUrl && (
                                        <a href={faq.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-medium mb-2">
                                            {faq.linkTitle || "Source Link"} <ExternalLinkIcon />
                                        </a>
                                    )}
                                    {faq.sourceText && (
                                        <blockquote className="text-xs text-slate-400 italic border-l-2 border-slate-200 pl-4">
                                            "{faq.sourceText}"
                                        </blockquote>
                                    )}
                                </section>
                            )}

                        </div>

                        {/* SIDEBAR */}
                        <aside className="lg:col-span-4 space-y-8">
                            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <BookOpen size={100} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 relative z-10">Explore Further</h3>
                                <ul className="space-y-4 relative z-10">
                                    {relatedFaqs.map((rf: any) => (
                                        <li key={rf._id}>
                                            <Link href={`/questions/${rf.slug}`} className="group flex flex-col">
                                                <span className="text-slate-300 text-sm group-hover:text-blue-300 transition-colors duration-200 font-medium">{rf.question}</span>
                                                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Read More</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* RELATED OFFER CTA */}
                            {offer && (
                                <div className="bg-white border-2 border-indigo-600 rounded-2xl p-1 shadow-lg transform hover:-translate-y-1 transition-transform">
                                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 text-center">
                                        <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                                            Recommended Resource
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                                            {offer.title}
                                        </h3>
                                        {offer.description && (
                                            <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                                                {offer.description}
                                            </p>
                                        )}
                                        <a
                                            href={`/offers/${offer.slug}`}
                                            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-indigo-200"
                                        >
                                            Check it out <ArrowRight size={16} className="inline ml-1" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                                <h3 className="font-bold text-amber-900 mb-2">Need Personalized Guidance?</h3>
                                <p className="text-sm text-amber-800 mb-4">
                                    Every body holds a unique story. Book a consultation to see how these practices apply to your specific journey.
                                </p>
                                <Link
                                    href="/book-session"
                                    className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm shadow-amber-200"
                                >
                                    Book a Consultation
                                </Link>
                            </div>
                        </aside>

                    </div>
                </div >
            </main >

        </div >
    );
}

function ExternalLinkIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    )
}
