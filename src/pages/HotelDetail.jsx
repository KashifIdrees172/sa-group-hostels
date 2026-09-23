import {
  useEffect,
  useState,
} from 'react'
import {
  Link,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import Reveal from '../components/common/Reveal.jsx'
import HotelBookingForm from '../components/hotel/HotelBookingForm.jsx'
import {
  getHotelBySlug,
  getLocalHotelFallback,
} from '../services/hotelService.js'

function AvailabilityBadge({
  available,
  total,
  label,
}) {
  const status =
    available === 0
      ? 'Full'
      : available <= 3
        ? 'Limited'
        : 'Available'

  const statusClass =
    available === 0
      ? 'text-red-600 bg-red-50'
      : available <= 3
        ? 'text-orange-600 bg-orange-50'
        : 'text-green-700 bg-green-50'

  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-charcoal/45">
            {label}
          </p>

          <p className="mt-2 text-3xl font-extrabold text-navy">
            {available}
            <span className="text-base text-charcoal/35">
              {' '}
              / {total}
            </span>
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}

export default function HotelDetail() {
  const { hotelId } = useParams()
  const [searchParams] =
    useSearchParams()

  const [hotel, setHotel] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    const loadHotel = async () => {
      setLoading(true)
      setError('')

      try {
        const data =
          await getHotelBySlug(
            hotelId,
          )

        if (active) {
          setHotel(data)
        }
      } catch (loadError) {
        console.error(
          'Unable to load hotel:',
          loadError,
        )

        const fallback =
          getLocalHotelFallback(
            hotelId,
          )

        if (active) {
          if (fallback) {
            setHotel(fallback)
            setError(
              'Live backend data could not be loaded. Showing temporary website data.',
            )
          } else {
            setHotel(null)
          }
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadHotel()

    return () => {
      active = false
    }
  }, [hotelId])

  useEffect(() => {
    if (
      hotel &&
      searchParams.get('book') ===
        'true'
    ) {
      window.setTimeout(() => {
        document
          .getElementById(
            'hotel-booking',
          )
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
      }, 180)
    }
  }, [hotel, searchParams])

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-navy/15 border-t-amber animate-spin" />
          <p className="mt-4 text-sm text-charcoal/50">
            Loading hotel...
          </p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <section className="section-shell text-center">
        <p className="section-eyebrow">
          Hotel not found
        </p>

        <h1 className="section-title">
          This hotel branch is not
          available.
        </h1>

        <div className="mt-8">
          <Link
            to="/hotels"
            className="inline-flex rounded-full bg-navy px-6 py-3 font-bold text-white hover:bg-amber hover:text-navy transition-colors"
          >
            Back to Hotels
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="page-enter">
      {error && (
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-5">
          <div className="rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-navy">
            {error}
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-slate-800 text-white">
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24 grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center">
          <Reveal>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-amber transition-colors"
            >
              ← All Hotels
            </Link>

            <p className="mt-7 text-amber text-xs font-bold uppercase tracking-[.24em]">
              SA Group Hotels
            </p>

            <h1 className="mt-3 text-4xl md:text-6xl font-display font-extrabold leading-tight">
              {hotel.name}
            </h1>

            <p className="mt-3 text-white/60">
              📍 {hotel.location}
            </p>

            <p className="mt-6 max-w-2xl text-white/70 leading-8">
              {hotel.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#hotel-booking"
                className="rounded-full bg-amber px-6 py-3 text-sm font-extrabold text-navy hover:-translate-y-0.5 transition-transform"
              >
                Book Hotel
              </a>

              <a
                href={`https://wa.me/${hotel.contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-navy transition-colors"
              >
                WhatsApp Hotel
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur p-6 md:p-8">
              <p className="text-xs uppercase tracking-[.2em] text-amber font-bold">
                Current availability
              </p>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <p className="text-4xl font-extrabold">
                    {hotel.rooms.available}
                  </p>

                  <p className="mt-1 text-xs text-white/55">
                    Rooms available
                  </p>
                </div>

                <div>
                  <p className="text-4xl font-extrabold">
                    {
                      hotel.parking
                        .availableSlots
                    }
                  </p>

                  <p className="mt-1 text-xs text-white/55">
                    Parking slots
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-white/55">
                  Starting from
                </p>

                <p className="mt-1 text-3xl font-extrabold text-amber">
                  Rs.{' '}
                  {hotel.startingPrice.toLocaleString()}
                  <span className="text-sm font-medium text-white/45">
                    {' '}
                    / night
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <Reveal>
          <p className="section-eyebrow">
            Availability
          </p>

          <h2 className="section-title">
            Rooms & parking at a
            glance
          </h2>

          <div className="section-line" />
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 mt-12 max-w-4xl mx-auto">
          <AvailabilityBadge
            available={
              hotel.rooms.available
            }
            total={hotel.rooms.total}
            label="Hotel rooms"
          />

          <AvailabilityBadge
            available={
              hotel.parking
                .availableSlots
            }
            total={
              hotel.parking.totalSlots
            }
            label="Parking slots"
          />
        </div>
      </section>

      <section className="section-shell pt-0">
        <Reveal>
          <p className="section-eyebrow">
            Room choices
          </p>

          <h2 className="section-title">
            Choose the room that
            suits your stay
          </h2>

          <div className="section-line" />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {hotel.roomTypes.map(
            (room, index) => (
              <Reveal
                key={room.id}
                delay={index * 80}
              >
                <article className="h-full rounded-3xl border border-navy/10 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber/15 text-2xl">
                      🛏️
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        room.availableRooms ===
                        0
                          ? 'bg-red-50 text-red-600'
                          : room.availableRooms <=
                              2
                            ? 'bg-orange-50 text-orange-600'
                            : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {room.availableRooms ===
                      0
                        ? 'Sold out'
                        : `${room.availableRooms} available`}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-display font-bold text-navy">
                    {room.name}
                  </h3>

                  <p className="mt-2 text-sm text-charcoal/55">
                    Up to{' '}
                    {room.maxGuests}{' '}
                    guests
                  </p>

                  <p className="mt-6 text-3xl font-extrabold text-navy">
                    Rs.{' '}
                    {room.price.toLocaleString()}
                  </p>

                  <p className="text-xs text-charcoal/45">
                    per night
                  </p>

                  <a
                    href="#hotel-booking"
                    className="mt-6 inline-flex w-full justify-center rounded-xl bg-navy px-4 py-3 text-sm font-bold text-white hover:bg-amber hover:text-navy transition-colors"
                  >
                    Book this room
                  </a>
                </article>
              </Reveal>
            ),
          )}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="h-full rounded-[2rem] bg-cream border border-navy/10 p-7 md:p-9">
              <p className="text-amber text-xs uppercase tracking-[.2em] font-extrabold">
                Hotel facilities
              </p>

              <h2 className="mt-2 text-2xl font-display font-bold text-navy">
                Everything needed
                for a comfortable
                stay
              </h2>

              <div className="grid sm:grid-cols-2 gap-3 mt-7">
                {hotel.facilities.map(
                  (facility) => (
                    <div
                      key={facility}
                      className="flex items-center gap-3 rounded-xl bg-white border border-navy/10 px-4 py-3 text-sm font-semibold text-charcoal/70"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-amber/15 text-navy">
                        ✓
                      </span>
                      {facility}
                    </div>
                  ),
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-[2rem] bg-navy p-7 md:p-9 text-white relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />

              <div className="relative">
                <p className="text-amber text-xs uppercase tracking-[.2em] font-extrabold">
                  Parking availability
                </p>

                <h2 className="mt-2 text-2xl font-display font-bold">
                  Secure parking for
                  hotel guests
                </h2>

                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-5xl font-extrabold text-amber">
                      {
                        hotel.parking
                          .availableSlots
                      }
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                      slots available
                      for the current
                      default period
                    </p>
                  </div>

                  <p className="text-sm text-white/45">
                    Total:{' '}
                    {
                      hotel.parking
                        .totalSlots
                    }
                  </p>
                </div>

                <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{
                      width:
                        hotel.parking
                          .totalSlots
                          ? `${(hotel.parking.availableSlots / hotel.parking.totalSlots) * 100}%`
                          : '0%',
                    }}
                  />
                </div>

                <p className="mt-5 text-sm leading-6 text-white/55">
                  Select your exact
                  check-in and
                  check-out dates in
                  the booking form
                  below to get
                  date-specific
                  parking
                  availability.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-0">
        <HotelBookingForm
          hotel={hotel}
        />
      </section>
    </div>
  )
}
