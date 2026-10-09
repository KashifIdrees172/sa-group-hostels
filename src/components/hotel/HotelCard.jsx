import LineIcon from '../common/LineIcon.jsx'
import { Link } from 'react-router-dom'

function HotelImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'Hotel image',
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-navy to-slate-700 ${className}`}
      >
        <div className="text-center text-white/70">
          <div className="text-3xl"><LineIcon name="hotel" size={22} /></div>
          <p className="mt-2 text-xs font-semibold">
            {fallbackLabel}
          </p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(event) => {
        // Hide the broken browser-image icon if the actual file
        // is replaced/renamed incorrectly.
        event.currentTarget.style.display = 'none'
      }}
    />
  )
}

export default function HotelCard({ hotel }) {
  const roomAvailable =
    hotel.rooms?.available ?? 0

  const roomTotal =
    hotel.rooms?.total ?? 0

  const parkingAvailable =
    hotel.parking?.availableSlots ?? 0

  const parkingTotal =
    hotel.parking?.totalSlots ?? 0

  const roomStatus =
    roomAvailable === 0
      ? 'Fully Booked'
      : roomAvailable <= 3
        ? `Only ${roomAvailable} Rooms Left`
        : `${roomAvailable} Rooms Available`

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-navy/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-navy/10">
      {/* HOTEL COVER */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-navy">
        <HotelImage
          src={hotel.coverImage}
          alt={`${hotel.name} hotel`}
          fallbackLabel={hotel.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />

        <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold tracking-[.15em] text-navy shadow-md">
          SA GROUP HOTEL
        </div>

        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-xs text-white/60">
            📍 {hotel.location}
          </p>

          <h3 className="mt-1 font-display text-2xl font-bold">
            {hotel.name}
          </h3>

          <p className="mt-2 text-sm text-white/65">
            Starting from{' '}
            <strong className="text-amber text-lg">
              Rs.{' '}
              {hotel.startingPrice.toLocaleString()}
            </strong>{' '}
            / night
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-sm leading-6 text-charcoal/60">
          {hotel.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-2xl border border-navy/10 bg-cream/50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                <LineIcon name="bed" size={22} />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wide text-charcoal/45">
                Rooms
              </span>
            </div>

            <p className="mt-2 text-2xl font-extrabold text-navy">
              {roomAvailable}
              <span className="text-sm text-charcoal/30">
                {' '}
                / {roomTotal}
              </span>
            </p>

            <p
              className={`mt-1 text-xs font-semibold ${
                roomAvailable === 0
                  ? 'text-red-500'
                  : roomAvailable <= 3
                    ? 'text-orange-500'
                    : 'text-green-600'
              }`}
            >
              {roomStatus}
            </p>
          </div>

          <div className="rounded-2xl border border-navy/10 bg-cream/50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                <LineIcon name="car" size={22} />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wide text-charcoal/45">
                Parking
              </span>
            </div>

            <p className="mt-2 text-2xl font-extrabold text-navy">
              {parkingAvailable}
              <span className="text-sm text-charcoal/30">
                {' '}
                / {parkingTotal}
              </span>
            </p>

            <p
              className={`mt-1 text-xs font-semibold ${
                parkingAvailable === 0
                  ? 'text-red-500'
                  : 'text-green-600'
              }`}
            >
              {parkingAvailable === 0
                ? 'Parking Full'
                : 'Slots Available'}
            </p>
          </div>
        </div>

        {hotel.facilities?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {hotel.facilities.slice(0, 4).map((facility) => (
              <span
                key={facility}
                className="rounded-full border border-navy/10 bg-cream/70 px-3 py-1.5 text-[11px] font-semibold text-charcoal/60"
              >
                {facility}
              </span>
            ))}
            {hotel.facilities.length > 4 && (
              <span className="rounded-full border border-navy/10 bg-cream/70 px-3 py-1.5 text-[11px] font-semibold text-charcoal/45">
                +{hotel.facilities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* ROOM IMAGES */}
        <div className="mt-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-amber">
            Room Options
          </p>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {hotel.roomTypes
              ?.slice(0, 3)
              .map((room) => (
                <div
                  key={room.id}
                  className="overflow-hidden rounded-xl border border-navy/10 bg-white"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-navy/5">
                    {room.image ? (
                      <img
                        src={room.image}
                        alt={`${hotel.name} ${room.name}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-cream text-2xl">
                        <LineIcon name="bed" size={22} />
                      </div>
                    )}
                  </div>

                  <div className="px-2 py-2">
                    <p className="truncate text-[10px] font-bold text-navy">
                      {room.name}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <Link
            to={`/hotels/${hotel.id}`}
            className="flex-1 rounded-xl bg-navy px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90"
          >
            View Hotel
          </Link>

          <Link
            to={`/hotels/${hotel.id}?book=true`}
            className="flex-1 rounded-xl bg-amber px-4 py-3 text-center text-sm font-extrabold text-navy transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  )
}
