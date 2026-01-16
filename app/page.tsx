export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, Sparkles } from 'lucide-react';
import connectToDatabase from '@/lib/db';
import UserStory from '@/lib/models/UserStory';
import Testimonial from '@/lib/models/Testimonial';
import { getProducts, ensureDatabaseSeeded } from '@/lib/initialData';
import { getRandomGlossaryTerms } from '@/lib/actions';
import UserStoryRotator from '@/components/features/UserStoryRotator';
import TestimonialRotator from '@/components/features/TestimonialRotator';
import GlossaryRotator from '@/components/features/GlossaryRotator';

export const metadata: Metadata = {
  title: 'Kathleen Heals | Natural Pain Relief Through Energy Healing',
  description: 'Find natural relief from pain through energy healing, Reiki, and holistic wellness practices. Book your healing session today.',
};

export default async function Home() {
  await ensureDatabaseSeeded();
  await connectToDatabase();

  // Fetch featured user stories and testimonials
  const [featuredStories, featuredTestimonials, { products: randomProducts }, randomTerms] = await Promise.all([
    UserStory.find({ approved: true, featured: true }).select('id title authorName authorInitials').limit(5).lean(),
    Testimonial.find({ approved: true, featured: true }).select('id clientName clientInitials rating testimonialText').limit(5).lean(),
    getProducts({ random: true, limit: 5 }),
    getRandomGlossaryTerms(5)
  ]);

  const stories = JSON.parse(JSON.stringify(featuredStories));
  const testimonials = JSON.parse(JSON.stringify(featuredTestimonials));

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-100 rounded-full blur-3xl opacity-30" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Relief through <br />
            <span className="text-emerald-600 italic">Energy, Awareness</span> & Wellness
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            A grounded approach to healing chronic pain and emotional stress. We bridge ancient wisdom with modern understanding to help you restore balance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/book-session" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-100">
              <Calendar size={20} />
              Book a Session
            </Link>
            <Link href="/stories" className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-emerald-600 transition-all">
              Read Healing Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Experience the Power of Energy Healing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Watch Kathleen explain how energy healing can transform your life and bring relief from chronic pain.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-2">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
                src="https://www.youtube.com/embed/TQrGtOpgo0U"
                title="Kathleen Heals - Energy Healing Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Glossary Rotator */}
      <GlossaryRotator terms={randomTerms} />

      {/* User Stories Rotator */}
      <UserStoryRotator stories={stories} />

      {/* Testimonials Rotator */}
      <TestimonialRotator testimonials={testimonials} />

      {/* Book a Session CTA */}
      <section id="book-session" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500 rounded-full blur-3xl opacity-10" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            Start Your Healing Journey
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Book Your Healing Session with Confidence!
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            I'm so excited to invite you on a transformative healing journey with me. My sessions are designed to help you feel lighter, more at peace, and deeply connected to your inner self.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold mb-4 text-white">60-Minute Energy Healing Session</h3>
                <ul className="space-y-3 text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 text-lg">✓</span>
                    Virtual session over phone
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 text-lg">✓</span>
                    Personalized assessment of your energy field
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 text-lg">✓</span>
                    Chakra balancing and meridian therapy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 text-lg">✓</span>
                    Guided meditation and breathwork
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 text-lg">✓</span>
                    Self-care techniques for ongoing healing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 text-lg font-bold">✓</span>
                    <span className="font-bold text-emerald-300">100% money-back guarantee</span>
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <div className="text-6xl font-bold text-emerald-400 mb-2">$111</div>
                <p className="text-sm text-slate-300 mb-6">Per Session</p>
                <Link
                  href="/book-session"
                  className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30"
                >
                  <Calendar size={20} />
                  Schedule Now
                </Link>
              </div>
            </div>
          </div>

          {/* Kathleen's Personal Message */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6 text-left max-w-3xl mx-auto">
            <p className="text-slate-200 leading-relaxed mb-4">
              Your well-being is my highest priority.
            </p>
            <p className="text-slate-200 leading-relaxed mb-4">
              To make sure you feel fully supported, I proudly offer a money-back guarantee on all healing sessions. If you don't feel better or lighter by the end of your session, simply let me know—and I'll offer you a full refund, no questions asked.
            </p>
            <p className="text-slate-200 leading-relaxed mb-4">
              I truly believe in the power of healing and am deeply committed to helping you reach your wellness goals. Your journey toward self-love and healing matters, and I want you to feel confident and safe in choosing to work with me.
            </p>
            <p className="text-slate-200 leading-relaxed mb-4">
              Take the first step toward your healing today. I'm here for you.
            </p>
            <p className="text-emerald-300 italic font-semibold">
              With love and presence,<br />
              Kathleen Heals
            </p>
          </div>
        </div>
      </section>

      {/* Curated Tools for Recovery */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Curated Tools for Recovery</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Selected and built by Kathleen to support your daily practice at home.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {randomProducts && randomProducts.map((product: any) => (
              <div key={product.id || product._id.toString()} className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-[4/5] bg-slate-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-slate-300 text-4xl">📦</div>
                  )}
                </div>
                <div className="px-3 pb-4 text-center">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{product.type || "Tool"}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-600 font-bold min-h-[1.5rem] flex items-center">
                      {product.price ? (typeof product.price === 'number' ? `$${product.price}` : product.price) : <span className="text-slate-300 text-[10px] uppercase">View Details</span>}
                    </span>
                    <Link href={product.affiliateLink || product.link || `/tools/${product.slug}`} target={product.affiliateLink ? "_blank" : undefined} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-emerald-600 hover:text-white transition-colors">
                      →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
              View All Resources →
            </Link>
          </div>
        </div>
      </section>
    </div >
  );
}
