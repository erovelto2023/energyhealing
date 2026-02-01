import { searchFAQs } from "@/lib/actions";
import Link from "next/link";
import { ArrowRight, BookOpen, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import FAQSearchBar from "@/components/features/FAQSearchBar";
import HeroSlideshow, { HeroContent } from "@/components/features/HeroSlideshow";
import path from "path";
import fs from "fs";

const QUESTIONS_HERO_CONTENT: HeroContent[] = [
    { title: "Answers for Your Healing Journey", subtitle: "Find clarity on energy healing, pain relief, and holistic wellness.", category: "Knowledge Base" },
    { title: "Healing Begins with Understanding", subtitle: "Curated answers to support your journey to recovery.", category: "Education" },
    { title: "Deepen Your Knowledge", subtitle: "Explore the science and spirit behind energy medicine.", category: "Insight" },
    { title: "Navigating Your Wellness Path", subtitle: "Common questions about what to expect during your sessions.", category: "Guidance" },
    { title: "Empower Yourself with Answers", subtitle: "Knowledge is the first step toward lasting relief.", category: "Empowerment" }
];

interface KnowledgeBasePageProps {
    searchParams: {
        q?: string;
        page?: string;
    };
}

export default async function KnowledgeBasePage({ searchParams }: KnowledgeBasePageProps) {
    const query = searchParams.q || '';
    const page = parseInt(searchParams.page || '1');
    const limit = 20;

    const { faqs, totalPages, totalCount } = await searchFAQs(query, page, limit);

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
        <div className="min-h-screen bg-slate-50">
            <HeroSlideshow images={heroImages} content={QUESTIONS_HERO_CONTENT} />

            <main className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">


                        {/* SEARCH COMPONENT */}
                        <FAQSearchBar />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            {query ? `Search Results for "${query}"` : 'Explore Questions'}
                        </h2>
                        <span className="text-sm text-slate-500">
                            Showing {faqs.length} of {totalCount} results
                        </span>
                    </div>

                    {/* RESULTS GRID */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {faqs.map((faq: any) => (
                            <Link
                                key={faq._id}
                                href={`/questions/${faq.slug}`}
                                className="group block p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-600 uppercase tracking-widest">
                                    <BookOpen size={14} />
                                    {faq.parentQuestion || "General"}
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                                    {faq.question}
                                </h3>
                                <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                                    {faq.answerSnippet}
                                </p>
                                <div className="flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    Read Full Answer <ArrowRight size={16} className="ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {faqs.length === 0 && (
                        <div className="text-center py-24 text-slate-400 bg-white rounded-3xl border border-slate-100">
                            <HelpCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No questions found matching "{query}".</p>
                            <p className="text-sm mt-2">Try searching for "yoga", "pain", or "meditation".</p>
                        </div>
                    )}

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4">
                            <Link
                                href={`/questions?q=${query}&page=${Math.max(1, page - 1)}`}
                                className={`p-3 rounded-full border ${page <= 1 ? 'pointer-events-none opacity-50 bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
                            >
                                <ChevronLeft size={20} />
                            </Link>

                            <span className="text-sm font-medium text-slate-600">
                                Page {page} of {totalPages}
                            </span>

                            <Link
                                href={`/questions?q=${query}&page=${Math.min(totalPages, page + 1)}`}
                                className={`p-3 rounded-full border ${page >= totalPages ? 'pointer-events-none opacity-50 bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
                            >
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
