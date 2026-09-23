import {
  useEffect,
  useState,
} from 'react'
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
    <p className="section-eyebrow">
      {eyebrow}
    </p>

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

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-slate-800 text-white">
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-amber text-xs font-bold uppercase tracking-[0.25em]">
                SA Group Hotels
              </p>

              <h1 className="mt-4 text-4xl md:text-6xl font-display font-extrabold leading-tight">
                Comfortable hotel
                stays
                <span className="block text-amber">
                  across Lahore.
                </span>
              </h1>

              <p className="mt-6 text-white/70 text-base md:text-lg leading-8 max-w-2xl">
                Explore our hotel
                branches, check room
                availability, view
                parking availability,
                compare room types,
                and book your stay
                easily.
              </p>
            </div>
          </Reveal>
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
            <div className="rounded-[2rem] bg-navy p-6 md:p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />

              <div className="relative">
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

                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {hotels.map(
                    (hotel) => (
                      <div
                        key={hotel.id}
                        className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur"
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
