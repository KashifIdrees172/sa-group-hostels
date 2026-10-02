import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import HotelCard from '../components/hotel/HotelCard.jsx'
import Reveal from '../components/common/Reveal.jsx'
import localHotels from '../data/hotels.js'
import {
  getHotels,
} from '../services/hotelService.js'

const SectionHeading = ({
  eyebrow,
  title,
  text,
}) => (
  <Reveal>
    <div className="section-eyebrow-wrap">
      <p className="section-eyebrow">
        {eyebrow}
      </p>
    </div>

    <h1 className="section-title">
      {title}
    </h1>

    <div className="section-line" />

    {text && (
      <p className="section-copy">
        {text}
      </p>
    )}
  </Reveal>
)

export default function Hotels() {
  const [hotels, setHotels] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    const loadHotels = async () => {
      try {
        const data =
          await getHotels()

        if (active) {
          setHotels(data)
        }
      } catch (loadError) {
        console.error(
          'Unable to load hotels:',
          loadError,
        )

        if (active) {
          setError(
            'Live hotel data could not be loaded. Showing the saved website data temporarily.',
          )
          setHotels(localHotels)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadHotels()

    return () => {
      active = false
    }
  }, [])

  const heroStats = useMemo(() => {
    if (!hotels.length) return null

    const cheapest = Math.min(...hotels.map((hotel) => hotel.startingPrice))
    const totalRoomsAvailable = hotels.reduce((sum, hotel) => sum + (hotel.rooms?.available ?? 0), 0)
    const totalParkingAvailable = hotels.reduce((sum, hotel) => sum + (hotel.parking?.availableSlots ?? 0), 0)

    return { cheapest, totalRoomsAvailable, totalParkingAvailable }
  }, [hotels])

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden hero-mesh">
        <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-12 items-center">
            <Reveal>
              <div className="chip">
                <span className="w-2 h-2 bg-amber rounded-full pulse-dot" />
                Book by the night, no long-term commitment
              </div>

              <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.08] text-navy tracking-tight">
                Comfortable hotel
                stays <span className="text-gradient">across Lahore.</span>
              </h1>

              <p className="mt-6 text-charcoal/65 text-base md:text-lg leading-relaxed max-w-xl">
                Explore our hotel branches, check room availability, view
                parking availability, compare room types, and book your stay
                easily.
              </p>

              <div className="flex flex-wrap gap-3 mt-9">
                <a href="#hotel-list" className="rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-navy/20 hover:-translate-y-0.5 hover:bg-navy-soft transition-all">
                  View Hotel Branches <span>→</span>
                </a>
                <Link to="/#choose" className="rounded-full border-2 border-navy/15 px-6 py-3.5 text-sm font-bold text-navy hover:bg-navy hover:text-white hover:border-navy transition-all">
                  Looking for a Hostel?
                </Link>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="glass-panel rounded-[2rem] p-6 md:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-amber-dark">
                  Live snapshot
                </p>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="rounded-2xl bg-white border border-navy/10 p-4">
                    <span className="text-xl">🏨</span>
                    <p className="text-2xl font-extrabold text-navy mt-2">{hotels.length || '—'}</p>
                    <p className="text-xs text-charcoal/55 mt-0.5">Hotel branches</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-navy/10 p-4">
                    <span className="text-xl">🛏️</span>
                    <p className="text-2xl font-extrabold text-navy mt-2">{heroStats ? heroStats.totalRoomsAvailable : '—'}</p>
                    <p className="text-xs text-charcoal/55 mt-0.5">Rooms available</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-navy/10 p-4">
                    <span className="text-xl">🚗</span>
                    <p className="text-2xl font-extrabold text-navy mt-2">{heroStats ? heroStats.totalParkingAvailable : '—'}</p>
                    <p className="text-xs text-charcoal/55 mt-0.5">Parking slots free</p>
                  </div>
                  <div className="rounded-2xl bg-navy p-4 text-white">
                    <span className="text-xl">💰</span>
                    <p className="text-2xl font-extrabold text-amber mt-2">{heroStats ? `Rs.${heroStats.cheapest.toLocaleString()}` : '—'}</p>
                    <p className="text-xs text-white/60 mt-0.5">Starting per night</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="hotel-list"
        className="section-shell scroll-mt-28"
      >
        <SectionHeading
          eyebrow="Our hotels"
          title="Choose your hotel branch"
          text="Select a branch to view room types, prices, available rooms, parking availability, facilities, and booking details."
        />

        {error && (
          <div className="max-w-5xl mx-auto mt-8 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-navy">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-11 h-11 mx-auto rounded-full border-4 border-navy/15 border-t-amber animate-spin" />
            <p className="mt-4 text-sm text-charcoal/50">
              Loading live hotel
              availability...
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mt-14 max-w-5xl mx-auto">
            {hotels.map(
              (hotel, index) => (
                <Reveal
                  key={hotel.id}
                  delay={index * 100}
                >
                  <HotelCard
                    hotel={hotel}
                  />
                </Reveal>
              ),
            )}
          </div>
        )}
      </section>

      {!loading &&
        hotels.length > 0 && (
        <section className="section-shell pt-0">
          <Reveal>
            <div className="rounded-[2rem] bg-gradient-to-br from-navy to-navy-soft p-6 md:p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />

              <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-amber text-xs uppercase font-bold tracking-[0.2em]">
                      Live availability
                    </p>

                    <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold">
                      Rooms and parking
                      from the backend
                    </h2>

                    <p className="mt-3 max-w-2xl text-white/65 text-sm leading-6">
                      These figures are
                      now loaded from
                      Supabase. Exact
                      availability for a
                      stay is checked
                      again after the
                      customer selects
                      check-in and
                      check-out dates.
                    </p>
                  </div>

                  <span className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-xs font-bold">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {hotels.map(
                    (hotel) => (
                      <div
                        key={hotel.id}
                        className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur hover:bg-white/[.14] transition-colors"
                      >
                        <h3 className="font-semibold text-lg">
                          {hotel.name}
                        </h3>

                        <p className="text-white/50 text-xs mt-1">
                          {hotel.location}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-5">
                          <div className="rounded-xl bg-white/10 p-3">
                            <span className="text-xl">
                              🛏️
                            </span>

                            <p className="text-2xl font-bold mt-2">
                              {
                                hotel.rooms
                                  .available
                              }
                            </p>

                            <p className="text-white/55 text-xs">
                              Rooms available
                            </p>
                          </div>

                          <div className="rounded-xl bg-white/10 p-3">
                            <span className="text-xl">
                              🚗
                            </span>

                            <p className="text-2xl font-bold mt-2">
                              {
                                hotel.parking
                                  .availableSlots
                              }
                            </p>

                            <p className="text-white/55 text-xs">
                              Parking slots
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/hotels/${hotel.id}`}
                          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-amber px-4 py-2.5 text-sm font-bold text-navy hover:-translate-y-0.5 transition-transform"
                        >
                          View branch <span>→</span>
                        </Link>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </div>
  )
}
