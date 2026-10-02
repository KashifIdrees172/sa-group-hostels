import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Reveal from '../components/common/Reveal.jsx'
import StatsSection from '../components/common/StatsSection.jsx'
import BranchCard from '../components/branch/BranchCard.jsx'
import BedPricingTable from '../components/branch/BedPricingTable.jsx'
import AmenitiesList from '../components/branch/AmenitiesList.jsx'
import ReviewsSlider from '../components/reviews/ReviewsSlider.jsx'
import ContactForm from '../components/common/ContactForm.jsx'
import SocialLinks from '../components/common/SocialLinks.jsx'
import SEO from '../components/common/SEO.jsx'
import defaultBranches from '../data/branches.js'
import { getBranches } from '../services/branchService.js'
import { generalAmenities, studentPerks } from '../data/amenities.js'
import reviews from '../data/reviews.js'
import { hero1, hero2, hero3, hero4, about1, contactOffice, securityIcon, studyIcon, headOfficeCover } from '../assets/images/index.js'
import { hotelOneCover } from '../assets/images/hotels/index.js'

const SectionHeading = ({ eyebrow, title, text }) => (
  <Reveal>
    <div className="section-eyebrow-wrap">
      <p className="section-eyebrow">{eyebrow}</p>
    </div>
    <h2 className="section-title">{title}</h2>
    <div className="section-line" />
    {text && <p className="section-copy">{text}</p>}
  </Reveal>
)

export default function Home() {
  const heroImages = [hero1, hero2, hero3, hero4]
  const [activeHero, setActiveHero] = useState(0)
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  // Show the default branch locations immediately; if an admin has set a
  // custom location in the dashboard, swap it in once it loads.
  const [branches, setBranches] = useState(defaultBranches)

  useEffect(() => {
    let active = true

    getBranches().then((data) => {
      if (active) setBranches(data)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SA Group of Hotels & Hostels',
    alternateName: 'SA Group',
    description:
      'Affordable hotels and student hostels in Lahore with secure accommodation, flexible room options, parking, and convenient locations.',
    telephone: '+92-319-3815068',
    email: 'info@sagrouphostels.com',
    areaServed: {
      '@type': 'City',
      name: 'Lahore',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-319-3815068',
      contactType: 'reservations',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    },
  }

  return (
    <div className="page-enter">
      <SEO
        title="Hotels & Hostels in Lahore | SA Group"
        description="SA Group offers affordable hotels and student hostels in Lahore with secure rooms, flexible stays, parking, facilities and easy booking."
        path="/"
        schema={homeSchema}
      />
      <section
        id="home"
        className="relative min-h-[calc(100vh-78px)] flex items-center overflow-hidden scroll-mt-24 hero-mesh"
      >
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10 grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <div className="chip hero-rise">
              <span className="w-2 h-2 bg-amber rounded-full pulse-dot" />
              Trusted hostel living across Lahore
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] font-extrabold text-navy tracking-tight hero-rise delay-1">
              A better place to <span className="text-gradient">live, study &amp; grow.</span>
            </h1>

            <p className="text-charcoal/65 mt-6 max-w-xl text-base md:text-lg leading-relaxed hero-rise delay-2">
              Safe, affordable hostel rooms for students and professionals—with flexible bed options,
              convenient locations, and a community that feels like home.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-9 hero-rise delay-3">
              <Button to="/#branches" variant="primary" className="!shadow-lg !shadow-navy/20">
                Explore Branches <span>→</span>
              </Button>
              <Button to="/#contact" variant="outline">Book an Inspection</Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8 hero-rise delay-4">
              {['24/7 security', 'Student-friendly', 'Flexible rooms'].map((item) => (
                <span key={item} className="flex items-center gap-2 rounded-full bg-white/70 border border-navy/10 pl-1.5 pr-3.5 py-1.5 text-xs font-semibold text-charcoal/70">
                  <span className="check-dot">✓</span>
                  {item}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-7 hero-rise delay-4">
              <div className="star-row text-sm">{'★★★★★'}</div>
              <p className="text-sm text-charcoal/60">
                <span className="font-bold text-navy">{avgRating}/5</span> from {reviews.length}+ resident reviews
              </p>
            </div>
          </div>

          <div className="relative block hero-rise delay-2 mt-10 lg:mt-0">
            <div className="relative mx-auto w-full max-w-lg aspect-[4/4.3] rounded-[2.5rem] bg-navy overflow-hidden border-8 border-white/70 hero-image-ring">
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

            <div className="float-card top-4 left-1 sm:top-10 sm:-left-8">
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

            <div className="float-card bottom-16 right-1 sm:bottom-24 sm:-right-6 animation-delay">
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

            <div className="rating-card -bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0">
              <div className="star-row">{'★★★★★'}</div>
              <div className="leading-tight">
                <b className="block text-sm text-navy font-bold">{avgRating}/5 rating</b>
                <small className="block text-[10px] text-charcoal/50">{reviews.length}+ verified reviews</small>
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

      <section id="choose" className="section-shell pb-0 scroll-mt-24">
        <SectionHeading
          eyebrow="Two ways to stay"
          title="Built for long-term living. Built for short stays too."
          text="SA Group runs two distinct services under one trusted name — pick the one that fits your stay."
        />

        <div className="grid md:grid-cols-2 gap-6 mt-14">
          <Reveal>
            <Link
              to="/#branches"
              className="group relative flex flex-col h-full rounded-[2rem] overflow-hidden border border-navy/10 bg-white shadow-sm hover:shadow-2xl hover:shadow-navy/15 hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={headOfficeCover}
                  alt="SA Group hostel branch"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                <span className="absolute top-5 left-5 bg-amber text-navy text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase">
                  Long-term living
                </span>
                <div className="absolute left-6 right-6 bottom-5 text-white">
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl">SA Group Hostels</h3>
                  <p className="text-white/70 text-sm mt-1">4 branches across Lahore</p>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <p className="text-charcoal/65 leading-7">
                  Monthly bed-based rooms for students and working professionals, with flexible
                  sharing options, security, and a resident community.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {['Single to 4-bed rooms', 'Monthly pricing', '24/7 security', 'Student-friendly'].map((point) => (
                    <div key={point} className="feature-pill !p-2.5 !text-xs">
                      <span className="!w-5 !h-5 !text-[10px]">✓</span>
                      {point}
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="font-bold text-navy">Explore Hostels</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white transition-all duration-300 group-hover:bg-amber group-hover:text-navy group-hover:rotate-[-35deg]">→</span>
                </div>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <Link
              to="/hotels"
              className="group relative flex flex-col h-full rounded-[2rem] overflow-hidden border border-navy/10 bg-white shadow-sm hover:shadow-2xl hover:shadow-navy/15 hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={hotelOneCover}
                  alt="SA Group hotel room"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                <span className="absolute top-5 left-5 bg-white text-navy text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase">
                  Short & flexible stays
                </span>
                <div className="absolute left-6 right-6 bottom-5 text-white">
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl">SA Group Hotels</h3>
                  <p className="text-white/70 text-sm mt-1">Book by the night across Lahore</p>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <p className="text-charcoal/65 leading-7">
                  Private rooms for travelers, families, and business guests, with nightly rates,
                  parking, and easy online booking.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {['Standard, Deluxe & Family', 'Nightly pricing', 'Free parking', 'Instant booking'].map((point) => (
                    <div key={point} className="feature-pill !p-2.5 !text-xs">
                      <span className="!w-5 !h-5 !text-[10px]">✓</span>
                      {point}
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="font-bold text-navy">Explore Hotels</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white transition-all duration-300 group-hover:bg-amber group-hover:text-navy group-hover:rotate-[-35deg]">→</span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
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
          <div className="mt-20 relative bg-navy rounded-[2rem] px-8 py-14 text-center overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute -top-8 -left-2 sm:left-8 text-amber/15 font-display text-[10rem] leading-none select-none" aria-hidden="true">“</div>
            <p className="relative text-cream text-xl md:text-3xl font-display font-semibold leading-relaxed max-w-3xl mx-auto">
              Every resident deserves a safe, affordable place to call home while building their future.
            </p>
            <div className="relative w-10 h-[2px] bg-amber mx-auto mt-6" />
            <p className="relative text-amber text-sm font-semibold mt-4 tracking-wide">
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
              <div className="group bg-white border border-navy/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy/10 transition-shadow duration-300">
                <div className="bg-gradient-to-r from-navy to-navy-soft px-6 py-5 flex items-center justify-between flex-wrap gap-3 relative overflow-hidden">
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
              <a className="contact-row" href="https://wa.me/923193815068">
                <span>📞</span>
                <div>
                  <small>Call or WhatsApp</small>
                  <b>0319-3815068</b>
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
