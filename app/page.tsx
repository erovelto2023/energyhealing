'use client'

import { FormEvent, useState } from 'react'

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message')
    }

    console.log('Form submitted:', data)
    setFormSubmitted(true)
    e.currentTarget.reset()

    setTimeout(() => setFormSubmitted(false), 5000)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Animated Background Elements */}
        <div className="absolute top-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full opacity-100 animate-float"
          style={{
            background: 'radial-gradient(circle, hsla(270, 60%, 65%, 0.15) 0%, transparent 70%)'
          }}
        />
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-100 animate-float-reverse"
          style={{
            background: 'radial-gradient(circle, hsla(180, 55%, 55%, 0.15) 0%, transparent 70%)',
            animationDelay: '0s'
          }}
        />

        <div className="container-custom text-center z-10 animate-fade-in-up px-4">
          <h2 className="text-center mb-4">Healing Services</h2>
          <p className="text-center text-muted text-lg max-w-2xl mx-auto mb-16">
            Personalized healing modalities designed to address your unique needs and support your journey to wellness
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon="✨"
              title="Energy Healing"
              description="Harness the power of universal life force energy to clear blockages, restore balance, and promote deep healing on physical, emotional, and spiritual levels."
            />
            <ServiceCard
              icon="🙏"
              title="Reiki Sessions"
              description="Experience the gentle, hands-on healing technique that channels energy to reduce stress, ease pain, and accelerate your body's natural healing processes."
            />
            <ServiceCard
              icon="🌸"
              title="Chakra Balancing"
              description="Align and harmonize your seven energy centers to improve vitality, emotional well-being, and overall life force flow throughout your body."
            />
            <ServiceCard
              icon="🧘"
              title="Holistic Wellness"
              description="Comprehensive approach combining energy work, mindfulness practices, and natural healing methods tailored to your individual wellness goals."
            />
            <ServiceCard
              icon="💆"
              title="Pain Relief Therapy"
              description="Natural, non-invasive techniques to address chronic pain, tension, and discomfort without medication or invasive procedures."
            />
            <ServiceCard
              icon="🌿"
              title="Stress Release"
              description="Gentle methods to release accumulated stress and anxiety, promoting deep relaxation and restoring inner peace and calm."
            />
          </div>
        </div>
      </section>

      {/* Activities Preview Section */}
      <section className="section-padding" style={{ background: 'var(--bg-dark-secondary)' }} id="activities">
        <div className="container-custom">
          <h2 className="text-center mb-4">Interactive Healing Activities</h2>
          <p className="text-center text-muted text-lg max-w-2xl mx-auto mb-16">
            Engage with powerful tools designed to support your daily healing practice
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Daily Energy Card Pull - Featured */}
            <a href="/activities/daily-card" className="glass-card p-8 group cursor-pointer block hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl mb-4 inline-block transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                🔮
              </div>
              <h3 className="text-2xl font-bold mb-4">Daily Energy Card Pull</h3>
              <p className="text-secondary mb-4">
                Receive daily guidance through our mystical energy cards. Each card offers a mantra,
                healing message, and micro-action to support your emotional wellness journey.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(270, 60%, 65%, 0.2)', color: 'var(--primary-purple-light)' }}>
                  Daily Practice
                </span>
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(180, 55%, 55%, 0.2)', color: 'var(--secondary-teal)' }}>
                  Streak Tracking
                </span>
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'hsla(45, 85%, 65%, 0.2)', color: 'var(--accent-gold)' }}>
                  49 Unique Cards
                </span>
              </div>
              <div className="text-primary-purple-light font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Try It Now →
              </div>
            </a>

            {/* More Activities Coming Soon */}
            <div className="glass-card p-8">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4">More Activities Coming Soon</h3>
              <p className="text-secondary mb-6">
                We&apos;re developing additional interactive tools including guided meditations,
                energy journaling, chakra assessments, and healing frequencies.
              </p>
              <a href="/activities" className="text-secondary-teal font-semibold hover:translate-x-2 transition-transform inline-block">
                View All Activities →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding" id="about" style={{ background: 'var(--bg-dark-secondary)' }}>
        <div className="container-custom">
          <h2 className="text-center mb-16">About Kathleen</h2>
          <div className="glass-card max-w-3xl mx-auto p-8 md:p-12">
            <p className="text-secondary text-lg leading-relaxed mb-6">
              Welcome! I&apos;m Kathleen, a certified energy healer and Reiki practitioner dedicated to
              helping people find relief from pain through natural, holistic methods.
            </p>
            <p className="text-secondary text-lg leading-relaxed mb-6">
              For over a decade, I&apos;ve witnessed the incredible healing power that lies within each of us.
              My approach combines ancient wisdom with modern understanding to create a safe, nurturing
              space where true healing can occur.
            </p>
            <p className="text-secondary text-lg leading-relaxed mb-6">
              Whether you&apos;re dealing with chronic pain, emotional trauma, stress, or simply seeking
              greater balance and wellness in your life, I&apos;m here to support your journey with
              compassion, expertise, and genuine care.
            </p>
            <p className="text-center text-xl font-semibold mt-8" style={{ color: 'var(--primary-purple-light)' }}>
              Your healing journey begins here. 🌟
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-dark" id="benefits">
        <div className="container-custom">
          <h2 className="text-center mb-4">Benefits of Natural Healing</h2>
          <p className="text-center text-muted text-lg max-w-2xl mx-auto mb-16">
            Discover how energy healing and holistic practices can transform your health and well-being
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              title="🌟 Pain Relief"
              description="Experience significant reduction in chronic pain, headaches, and physical discomfort through gentle, non-invasive energy work."
            />
            <BenefitCard
              title="😌 Stress Reduction"
              description="Release tension and anxiety, promoting deep relaxation and a profound sense of peace and well-being."
            />
            <BenefitCard
              title="⚡ Increased Energy"
              description="Restore vitality and life force by clearing energy blockages and optimizing your body's natural energy flow."
            />
            <BenefitCard
              title="💚 Emotional Healing"
              description="Process and release emotional trauma, grief, and negative patterns that may be contributing to physical symptoms."
            />
            <BenefitCard
              title="🛡️ Immune Support"
              description="Strengthen your body's natural healing abilities and enhance overall immune system function."
            />
            <BenefitCard
              title="🧠 Mental Clarity"
              description="Improve focus, reduce brain fog, and enhance mental clarity through balanced energy and reduced stress."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding" id="testimonials" style={{ background: 'var(--bg-dark-secondary)' }}>
        <div className="container-custom">
          <h2 className="text-center mb-4">Client Experiences</h2>
          <p className="text-center text-muted text-lg max-w-2xl mx-auto mb-16">
            Real stories from people who have found relief and healing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="After years of chronic back pain, I was skeptical about energy healing. But after just three sessions with Kathleen, I experienced more relief than I had with years of conventional treatments. She has a true gift."
              name="Sarah M."
              role="Chronic Pain Client"
            />
            <TestimonialCard
              quote="Kathleen's Reiki sessions have been transformative for my anxiety and stress. I leave each session feeling lighter, more centered, and genuinely at peace. Her compassionate approach makes all the difference."
              name="Michael T."
              role="Stress Management Client"
            />
            <TestimonialCard
              quote="I came to Kathleen with migraines that had plagued me for years. Through her energy healing work, I've not only reduced the frequency of my headaches but also discovered deeper emotional healing I didn't know I needed."
              name="Jennifer L."
              role="Migraine Relief Client"
            />
          </div>
        </div>
      </section>

      {/* Contact/Booking Section */}
      <section className="section-padding bg-dark" id="contact">
        <div className="container-custom">
          <h2 className="text-center mb-4">Begin Your Healing Journey</h2>
          <p className="text-center text-muted text-lg max-w-2xl mx-auto mb-16">
            Ready to experience natural pain relief and holistic wellness? Book your session today.
          </p>

          <div className="glass-card max-w-2xl mx-auto p-8 md:p-12">
            {formSubmitted && (
              <div className="mb-6 p-4 rounded-lg text-center" style={{ background: 'hsla(180, 55%, 55%, 0.2)', border: '1px solid var(--secondary-teal)' }}>
                <p className="text-secondary-teal font-semibold">
                  Thank you for your interest! I will contact you within 24 hours to schedule your healing session.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-secondary font-medium">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-dark-secondary)',
                    borderColor: 'hsla(270, 60%, 65%, 0.3)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-secondary font-medium">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-dark-secondary)',
                    borderColor: 'hsla(270, 60%, 65%, 0.3)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="phone" className="block mb-2 text-secondary font-medium">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-dark-secondary)',
                    borderColor: 'hsla(270, 60%, 65%, 0.3)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="service" className="block mb-2 text-secondary font-medium">Service Interest</label>
                <input
                  type="text"
                  id="service"
                  name="service"
                  placeholder="e.g., Reiki, Energy Healing, Pain Relief"
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-dark-secondary)',
                    borderColor: 'hsla(270, 60%, 65%, 0.3)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-secondary font-medium">Tell me about your healing needs</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Share what brings you here and what you hope to achieve through our sessions..."
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 resize-vertical"
                  style={{
                    background: 'var(--bg-dark-secondary)',
                    borderColor: 'hsla(270, 60%, 65%, 0.3)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Request Appointment
              </button>
            </form>

            <p className="text-center mt-6 text-muted text-sm">
              I typically respond within 24 hours. All inquiries are confidential.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float 15s ease-in-out infinite reverse;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .btn-primary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: var(--transition-smooth);
          position: relative;
          overflow: hidden;
          background: var(--gradient-accent);
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }

        .btn-secondary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: 2px solid var(--primary-purple);
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: var(--transition-smooth);
          background: transparent;
          color: var(--text-primary);
        }

        .btn-secondary:hover {
          background: var(--primary-purple);
          transform: translateY(-2px);
        }

        .bg-dark {
          background: var(--bg-dark);
        }

        .text-secondary {
          color: var(--text-secondary);
        }

        .text-muted {
          color: var(--text-muted);
        }

        .text-secondary-teal {
          color: var(--secondary-teal);
        }
      `}</style>
    </>
  )
}

// Service Card Component
function ServiceCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="glass-card p-8 group">
      <div className="text-5xl mb-4 inline-block transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>
      <h3 className="mb-4">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  )
}

// Benefit Card Component
function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-card p-8">
      <h3 className="mb-4">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'var(--blur-glass)',
        border: '1px solid hsla(180, 55%, 55%, 0.2)'
      }}
    >
      <p className="italic text-lg text-secondary mb-6 leading-relaxed">
        &quot;{quote}&quot;
      </p>
      <div>
        <div className="font-semibold" style={{ color: 'var(--primary-purple-light)' }}>{name}</div>
        <div className="text-sm text-muted">{role}</div>
      </div>
    </div>
  )
}
