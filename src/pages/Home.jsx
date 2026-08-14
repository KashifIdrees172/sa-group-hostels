import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import Reveal from '../components/common/Reveal.jsx'
import StatsSection from '../components/common/StatsSection.jsx'
import BranchCard from '../components/branch/BranchCard.jsx'
import BedPricingTable from '../components/branch/BedPricingTable.jsx'
import AmenitiesList from '../components/branch/AmenitiesList.jsx'
import ReviewsSlider from '../components/reviews/ReviewsSlider.jsx'
import ContactForm from '../components/common/ContactForm.jsx'
import SocialLinks from '../components/common/SocialLinks.jsx'
import branches from '../data/branches.js'
import { generalAmenities, studentPerks } from '../data/amenities.js'
import reviews from '../data/reviews.js'
import { hero1, hero2, hero3, hero4, about1, contactOffice, securityIcon, studyIcon } from '../assets/images/index.js'

const SectionHeading = ({ eyebrow, title, text }) => (
  <Reveal>
    <p className="section-eyebrow">{eyebrow}</p>
    <h2 className="section-title">{title}</h2>
    <div className="section-line" />
    {text && <p className="section-copy">{text}</p>}
  </Reveal>
)

export default function Home() {
  const heroImages = [hero1, hero2, hero3, hero4]
  const [activeHero, setActiveHero] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page-enter">
      <section
        id="home"
        className="relative min-h-[calc(100vh-78px)] flex items-center overflow-hidden scroll-mt-24 hero-mesh"
      >
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10 grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-white/70 backdrop-blur px-4 py-2 text-xs font-bold text-navy shadow-sm hero-rise">
              <span className="w-2 h-2 bg-amber rounded-full pulse-dot" />
              Trusted hostel living across Lahore
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl leading-[1.08] font-extrabold text-navy hero-rise delay-1">
              A better place to <span className="text-gradient">live, study &amp; grow.</span>
            </h1>

            <p className="text-charcoal/65 mt-6 max-w-xl text-base md:text-lg leading-relaxed hero-rise delay-2">
              Safe, affordable hostel rooms for students and professionals—with flexible bed options,
              convenient locations, and a community that feels like home.
            </p>

            <div className="flex flex-wrap gap-3 mt-9 hero-rise delay-3">
              <Button to="/#branches" variant="primary">
                Explore Branches <span>→</span>
              </Button>
              <Button to="/#contact" variant="outline">Book an Inspection</Button>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-3 mt-9 text-sm text-charcoal/60 hero-rise delay-4">
              {['24/7 security', 'Student-friendly', 'Flexible rooms'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="check-dot">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative block hero-rise delay-2 mt-8 lg:mt-0">
            <div className="relative mx-auto w-full max-w-lg aspect-[4/4.3] rounded-[2.5rem] bg-navy shadow-2xl shadow-navy/25 overflow-hidden border-8 border-white/70">
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`SA Group hostel showcase ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                    activeHero === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              ))}

              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy/95 to-transparent" />

              <div className="absolute left-5 right-5 sm:left-8 sm:right-8 bottom-5 sm:bottom-8 text-white">
                <p className="text-[10px] sm:text-xs uppercase tracking-[.2em] sm:tracking-[.25em] text-amber">
                  SA Group of Hostels
                </p>
                <h2 className="font-display font-bold text-xl sm:text-3xl mt-2 leading-tight">
                  Comfort that supports your ambition.
                </h2>
              </div>

              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show hero image ${index + 1}`}
                    onClick={() => setActiveHero(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeHero === index ? 'w-6 bg-amber' : 'w-2 bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="float-card top-6 left-2 sm:top-12 sm:-left-8">
              <img
                src={securityIcon}
                alt=""
                aria-hidden="true"
                className="w-8 h-8 object-contain"
              />
              <div>
                <b>Secure living</b>
                <small>Peace of mind, every day</small>
              </div>
            </div>

            <div className="float-card bottom-8 right-2 sm:bottom-14 sm:-right-5 animation-delay">
              <img
                src={studyIcon}
                alt=""
                aria-hidden="true"
                className="w-8 h-8 object-contain"
              />
              <div>
                <b>Student focused</b>
                <small>Spaces built for progress</small>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#about"
          aria-label="Scroll to about"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 text-navy/40 animate-bounce hidden sm:block"
        >
          ↓
        </a>
      </section>

      <StatsSection />

      <section id="about" className="section-shell scroll-mt-24">
        <SectionHeading eyebrow="Who we are" title="More than a room. A place to move forward." />

        <div className="grid lg:grid-cols-2 gap-14 items-center mt-14">
          <Reveal>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[2rem] bg-navy/10 overflow-hidden shadow-xl">
                <img
                  src={about1}
                  alt="SA Group hostel building and resident community"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="absolute -bottom-5 -right-3 sm:right-8 bg-white rounded-2xl px-6 py-5 shadow-xl border border-navy/10">
                <p className="font-display font-extrabold text-3xl text-navy">5+</p>
                <p className="text-xs text-charcoal/50">Years serving Lahore</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-charcoal/70 leading-8">
              SA Group of Hostels was built around a simple idea: students and young professionals
              should not have to choose between affordability, safety, and comfort. Across four
              Lahore locations, we create practical living spaces supported by security, community,
              and responsive service.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mt-7">
              {[
                '24/7 monitored branches',
                'Flexible room choices',
                'Convenient Lahore locations',
                'Supportive resident community',
              ].map((point) => (
                <div key={point} className="feature-pill">
                  <span>✓</span>
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3 flex-wrap">
              <Button to="/#branches">Explore Branches</Button>
              <Button to="/#contact" variant="outline">Talk to Our Team</Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="mt-20 relative bg-navy rounded-[2rem] px-8 py-12 text-center overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <p className="relative text-cream text-xl md:text-3xl font-display font-semibold leading-relaxed max-w-3xl mx-auto">
              “Every resident deserves a safe, affordable place to call home while building their future.”
            </p>
            <p className="relative text-amber text-sm font-semibold mt-5 tracking-wide">
              SA GROUP OF HOSTELS
            </p>
          </div>
        </Reveal>
      </section>

      <section id="branches" className="section-shell scroll-mt-24">
        <SectionHeading
          eyebrow="Where we are"
          title="Find your ideal branch"
          text="Four Lahore locations, one consistent standard of safety, comfort, and value."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {branches.map((branch, index) => (
            <Reveal key={branch.id} delay={index * 80}>
              <BranchCard branch={branch} index={index} />
            </Reveal>
          ))}
        </div>

        <div className="space-y-6 mt-20">
          {branches.map((branch, index) => (
            <Reveal key={branch.id} delay={index * 60}>
              <div className="group bg-white border border-navy/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                <div className="bg-navy px-6 py-5 flex items-center justify-between flex-wrap gap-3 relative overflow-hidden">
                  <div className="absolute inset-0 grid-pattern opacity-10" />

                  <div className="relative flex items-center gap-3">
                    {branch.isHeadOffice && (
                      <span className="bg-amber text-navy text-[10px] font-bold px-2.5 py-1 rounded-full">
                        HEAD OFFICE
                      </span>
                    )}

                    <div>
                      <h3 className="font-display font-bold text-cream text-lg">{branch.name}</h3>
                      <p className="text-cream/55 text-xs">{branch.location}</p>
                    </div>
                  </div>

                  <Button
                    to={`/branches/${branch.id}`}
                    variant="secondary"
                    className="relative !px-4 !py-2"
                  >
                    View Details →
                  </Button>
                </div>

                <div className="p-6">
                  <BedPricingTable pricing={branch.bedPricing} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="amenities" className="section-shell scroll-mt-24">
        <SectionHeading
          eyebrow="Why choose us"
          title="Everything you need to feel at home"
          text="Thoughtful facilities that make everyday living easier, safer, and more productive."
        />
        <div className="mt-14">
          <AmenitiesList general={generalAmenities} perks={studentPerks} />
        </div>
      </section>

      <section id="reviews" className="section-shell scroll-mt-24">
        <SectionHeading
          eyebrow="Resident stories"
          title="What our residents say"
          text="Feedback from students and professionals across our branches."
        />
        <div className="mt-12">
          <ReviewsSlider reviews={reviews} />
        </div>
      </section>

      <section id="contact" className="section-shell scroll-mt-24">
        <div className="rounded-[2.25rem] bg-gradient-to-br from-cream to-white border border-navy/10 p-6 md:p-10 lg:p-14 grid lg:grid-cols-[.8fr_1.2fr] gap-12 items-center shadow-xl shadow-navy/5">
          <Reveal>
            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-7 bg-navy/10">
              <img
                src={contactOffice}
                alt="SA Group of Hostels reception office"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="section-eyebrow !text-left">Let’s talk</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Ready to find your new room?
            </h2>
            <p className="text-charcoal/65 mt-5 leading-7">
              Share your preferred branch, room type, and move-in date. Our team can help arrange
              a visit and answer your questions.
            </p>

            <div className="space-y-4 mt-7 text-sm">
              <a className="contact-row" href="https://wa.me/923294234986">
                <span>📞</span>
                <div>
                  <small>Call or WhatsApp</small>
                  <b>0329-4234986</b>
                </div>
              </a>

              <a className="contact-row" href="mailto:info@sagrouphostels.com">
                <span>✉️</span>
                <div>
                  <small>Email us</small>
                  <b>info@sagrouphostels.com</b>
                </div>
              </a>
            </div>

            <div className="mt-7">
              <SocialLinks />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  )
}
