import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminLogout,
  getAdminBookings,
  getAdminHotels,
  updateBookingStatus,
  updateHotel,
  updateParkingCapacity,
  updateRoomType,
} from '../../services/adminService.js'
import Logo from '../../components/common/Logo.jsx'

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'checked_in',
  'checked_out',
  'cancelled',
]

const statusLabel = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
}

function StatusBadge({ status }) {
  const styles = {
    pending:
      'bg-amber/15 text-amber-700 border-amber/25',
    confirmed:
      'bg-blue-50 text-blue-700 border-blue-200',
    checked_in:
      'bg-green-50 text-green-700 border-green-200',
    checked_out:
      'bg-slate-100 text-slate-700 border-slate-200',
    cancelled:
      'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        styles[status] ||
        styles.pending
      }`}
    >
      {statusLabel[status] ||
        status}
    </span>
  )
}

function StatCard({
  label,
  value,
  hint,
}) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-charcoal/50">
        {label}
      </p>

      <p className="mt-2 text-3xl font-display font-extrabold text-navy">
        {value}
      </p>

      {hint && (
        <p className="mt-1 text-[11px] text-charcoal/40">
          {hint}
        </p>
      )}
    </div>
  )
}

function NumberField({
  label,
  value,
  min = 0,
  step = 1,
  onChange,
  prefix,
  suffix,
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wide text-charcoal/45 mb-2">
        {label}
      </span>

      <div className="flex items-center rounded-xl border border-navy/15 bg-white focus-within:border-amber focus-within:ring-4 focus-within:ring-amber/10 transition">
        {prefix && (
          <span className="pl-3 text-sm font-semibold text-charcoal/40">
            {prefix}
          </span>
        )}

        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={onChange}
          className="w-full bg-transparent px-3 py-3 text-sm font-semibold text-navy outline-none"
        />

        {suffix && (
          <span className="pr-3 text-xs font-semibold text-charcoal/40">
            {suffix}
          </span>
        )}
      </div>
    </label>
  )
}

function InventoryModule({
  hotels,
  onReload,
}) {
  const [drafts, setDrafts] =
    useState({})
  const [savingKey, setSavingKey] =
    useState('')
  const [message, setMessage] =
    useState('')
  const [error, setError] =
    useState('')

  useEffect(() => {
    const next = {}

    hotels.forEach((hotel) => {
      next[`hotel-${hotel.id}`] = {
        startingPrice:
          Number(
            hotel.starting_price ??
              0,
          ),
        parking:
          Number(
            hotel.parking_config
              ?.total_slots ?? 0,
          ),
      }

      hotel.room_types?.forEach(
        (room) => {
          next[`room-${room.id}`] = {
            price:
              Number(
                room.price_per_night ??
                  0,
              ),
            totalRooms:
              Number(
                room.total_rooms ??
                  0,
              ),
          }
        },
      )
    })

    setDrafts(next)
  }, [hotels])

  const setDraftValue = (
    key,
    field,
    value,
  ) => {
    setDrafts((current) => ({
      ...current,
      [key]: {
        ...(current[key] || {}),
        [field]: value,
      },
    }))

    setMessage('')
    setError('')
  }

  const saveRoom = async (
    room,
  ) => {
    const key = `room-${room.id}`
    const draft = drafts[key]

    if (!draft) return

    const totalRooms = Number(
      draft.totalRooms,
    )
    const price = Number(
      draft.price,
    )

    if (
      Number.isNaN(totalRooms) ||
      totalRooms < 0
    ) {
      setError(
        'Total rooms must be 0 or greater.',
      )
      return
    }

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      setError(
        'Room price must be 0 or greater.',
      )
      return
    }

    setSavingKey(key)
    setMessage('')
    setError('')

    try {
      await updateRoomType(
        room.id,
        {
          price_per_night: price,
          total_rooms: totalRooms,
        },
      )

      setMessage(
        `${room.name} updated successfully.`,
      )

      await onReload()
    } catch (saveError) {
      console.error(
        'Room update failed:',
        saveError,
      )
      setError(
        saveError?.message ||
          'Unable to update room type.',
      )
    } finally {
      setSavingKey('')
    }
  }

  const saveHotelSettings =
    async (hotel) => {
      const key =
        `hotel-${hotel.id}`
      const draft =
        drafts[key]

      if (!draft) return

      const startingPrice =
        Number(
          draft.startingPrice,
        )
      const parking =
        Number(
          draft.parking,
        )

      if (
        Number.isNaN(
          startingPrice,
        ) ||
        startingPrice < 0
      ) {
        setError(
          'Starting price must be 0 or greater.',
        )
        return
      }

      if (
        Number.isNaN(parking) ||
        parking < 0
      ) {
        setError(
          'Parking capacity must be 0 or greater.',
        )
        return
      }

      setSavingKey(key)
      setMessage('')
      setError('')

      try {
        await Promise.all([
          updateHotel(
            hotel.id,
            {
              starting_price:
                startingPrice,
            },
          ),
          updateParkingCapacity(
            hotel.id,
            parking,
          ),
        ])

        setMessage(
          `${hotel.name} hotel settings updated successfully.`,
        )

        await onReload()
      } catch (saveError) {
        console.error(
          'Hotel settings update failed:',
          saveError,
        )
        setError(
          saveError?.message ||
            'Unable to update hotel settings.',
        )
      } finally {
        setSavingKey('')
      }
    }

  if (hotels.length === 0) {
    return (
      <div className="rounded-3xl border border-navy/10 bg-white p-10 text-center shadow-sm">
        <div className="text-5xl">
          🏨
        </div>

        <h3 className="mt-4 text-xl font-display font-bold text-navy">
          No hotels found
        </h3>

        <p className="mt-2 text-sm text-charcoal/50">
          Add hotel records in
          Supabase before managing
          inventory.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(message || error) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
        >
          {error || message}
        </div>
      )}

      {hotels.map((hotel) => {
        const hotelKey =
          `hotel-${hotel.id}`
        const hotelDraft =
          drafts[hotelKey] || {
            startingPrice:
              hotel.starting_price ??
              0,
            parking:
              hotel.parking_config
                ?.total_slots ?? 0,
          }

        const totalRoomInventory =
          (
            hotel.room_types ?? []
          ).reduce(
            (sum, room) =>
              sum +
              Number(
                room.total_rooms ??
                  0,
              ),
            0,
          )

        return (
          <section
            key={hotel.id}
            className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm"
          >
            <div className="bg-navy px-5 sm:px-6 py-5 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[.2em] font-extrabold text-amber">
                  Hotel Inventory
                </p>

                <h3 className="mt-1 text-xl font-display font-bold">
                  {hotel.name}
                </h3>

                <p className="mt-1 text-xs text-white/50">
                  {hotel.location}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                <div className="rounded-xl bg-white/10 px-4 py-2">
                  <b>
                    {
                      totalRoomInventory
                    }
                  </b>{' '}
                  <span className="text-white/55">
                    rooms
                  </span>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-2">
                  <b>
                    {
                      hotelDraft.parking
                    }
                  </b>{' '}
                  <span className="text-white/55">
                    parking
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-amber/25 bg-amber/10 p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h4 className="font-display font-bold text-navy">
                      Hotel-level
                      settings
                    </h4>

                    <p className="mt-1 text-xs text-charcoal/45">
                      Update the
                      advertised
                      starting price
                      and total
                      parking
                      capacity.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      saveHotelSettings(
                        hotel,
                      )
                    }
                    disabled={
                      savingKey ===
                      hotelKey
                    }
                    className="rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber hover:text-navy disabled:opacity-60"
                  >
                    {savingKey ===
                    hotelKey
                      ? 'Saving...'
                      : 'Save Hotel Settings'}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  <NumberField
                    label="Starting Price"
                    value={
                      hotelDraft.startingPrice
                    }
                    min={0}
                    step={100}
                    prefix="Rs."
                    suffix="/ night"
                    onChange={(event) =>
                      setDraftValue(
                        hotelKey,
                        'startingPrice',
                        event.target.value,
                      )
                    }
                  />

                  <NumberField
                    label="Parking Capacity"
                    value={
                      hotelDraft.parking
                    }
                    min={0}
                    step={1}
                    suffix="slots"
                    onChange={(event) =>
                      setDraftValue(
                        hotelKey,
                        'parking',
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-6">
                <div>
                  <h4 className="font-display text-lg font-bold text-navy">
                    Room types
                  </h4>

                  <p className="mt-1 text-xs text-charcoal/45">
                    Change each room
                    type's price and
                    total inventory.
                    Available rooms
                    are calculated
                    automatically
                    from bookings.
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 mt-5">
                  {(
                    hotel.room_types ??
                    []
                  ).map((room) => {
                    const roomKey =
                      `room-${room.id}`
                    const roomDraft =
                      drafts[roomKey] ||
                      {
                        price:
                          room.price_per_night ??
                          0,
                        totalRooms:
                          room.total_rooms ??
                          0,
                      }

                    return (
                      <article
                        key={
                          room.id
                        }
                        className="rounded-2xl border border-navy/10 bg-[#f9fbfd] p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide font-bold text-amber">
                              Room Type
                            </p>

                            <h5 className="mt-1 font-display text-lg font-bold text-navy">
                              {
                                room.name
                              }
                            </h5>

                            <p className="mt-1 text-xs text-charcoal/45">
                              Max{' '}
                              {
                                room.max_guests
                              }{' '}
                              guests
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              room.is_active
                                ? 'bg-green-50 text-green-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {room.is_active
                              ? 'Active'
                              : 'Inactive'}
                          </span>
                        </div>

                        <div className="space-y-4 mt-5">
                          <NumberField
                            label="Price per Night"
                            value={
                              roomDraft.price
                            }
                            min={
                              0
                            }
                            step={
                              100
                            }
                            prefix="Rs."
                            onChange={(
                              event,
                            ) =>
                              setDraftValue(
                                roomKey,
                                'price',
                                event
                                  .target
                                  .value,
                              )
                            }
                          />

                          <NumberField
                            label="Total Rooms"
                            value={
                              roomDraft.totalRooms
                            }
                            min={
                              0
                            }
                            step={
                              1
                            }
                            suffix="rooms"
                            onChange={(
                              event,
                            ) =>
                              setDraftValue(
                                roomKey,
                                'totalRooms',
                                event
                                  .target
                                  .value,
                              )
                            }
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            saveRoom(
                              room,
                            )
                          }
                          disabled={
                            savingKey ===
                            roomKey
                          }
                          className="mt-5 w-full rounded-xl border border-navy bg-white px-4 py-2.5 text-sm font-bold text-navy transition hover:bg-navy hover:text-white disabled:opacity-60"
                        >
                          {savingKey ===
                          roomKey
                            ? 'Saving...'
                            : 'Save Room Type'}
                        </button>
                      </article>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] =
    useState('bookings')

  const [bookings, setBookings] =
    useState([])

  const [hotels, setHotels] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [updatingId, setUpdatingId] =
    useState('')

  const [error, setError] =
    useState('')

  const loadDashboardData =
    async (
      showRefresh = false,
    ) => {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      try {
        const [
          bookingData,
          hotelData,
        ] = await Promise.all([
          getAdminBookings(),
          getAdminHotels(),
        ])

        setBookings(
          bookingData,
        )
        setHotels(hotelData)
      } catch (loadError) {
        console.error(
          'Unable to load admin dashboard:',
          loadError,
        )

        setError(
          loadError?.message ||
            'Unable to load dashboard data from Supabase.',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const stats = useMemo(() => {
    const count = (status) =>
      bookings.filter(
        (booking) =>
          booking.status === status,
      ).length

    const totalRooms =
      hotels.reduce(
        (hotelSum, hotel) =>
          hotelSum +
          (
            hotel.room_types ?? []
          ).reduce(
            (roomSum, room) =>
              roomSum +
              Number(
                room.total_rooms ??
                  0,
              ),
            0,
          ),
        0,
      )

    const totalParking =
      hotels.reduce(
        (sum, hotel) =>
          sum +
          Number(
            hotel.parking_config
              ?.total_slots ?? 0,
          ),
        0,
      )

    return {
      total: bookings.length,
      pending:
        count('pending'),
      confirmed:
        count('confirmed'),
      checkedIn:
        count('checked_in'),
      totalRooms,
      totalParking,
    }
  }, [bookings, hotels])

  const handleStatusChange =
    async (
      bookingId,
      nextStatus,
    ) => {
      setUpdatingId(
        bookingId,
      )
      setError('')

      try {
        const updated =
          await updateBookingStatus(
            bookingId,
            nextStatus,
          )

        setBookings(
          (current) =>
            current.map(
              (booking) =>
                booking.id ===
                bookingId
                  ? {
                      ...booking,
                      status:
                        updated.status,
                    }
                  : booking,
            ),
        )
      } catch (updateError) {
        console.error(
          'Booking update failed:',
          updateError,
        )

        setError(
          updateError?.message ||
            'Could not update the booking status.',
        )
      } finally {
        setUpdatingId('')
      }
    }

  const handleLogout =
    async () => {
      try {
        await adminLogout()
      } catch (logoutError) {
        console.error(
          'Logout failed:',
          logoutError,
        )
      } finally {
        navigate(
          '/admin/login',
          {
            replace: true,
          },
        )
      }
    }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo
              size={56}
              animated={false}
            />

            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-amber">
                Administration
              </p>

              <h1 className="font-display text-xl font-bold text-navy">
                SA Group Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                loadDashboardData(
                  true,
                )
              }
              disabled={
                refreshing
              }
              className="rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-amber hover:shadow-sm disabled:opacity-60"
            >
              {refreshing
                ? 'Refreshing...'
                : 'Refresh'}
            </button>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber hover:text-navy"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-amber">
            Overview
          </p>

          <h2 className="mt-1 text-3xl font-display font-extrabold text-navy">
            Hotel Administration
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/55">
            Manage bookings,
            room pricing, room
            inventory and parking
            capacity from one
            dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <StatCard
            label="Total Bookings"
            value={stats.total}
          />

          <StatCard
            label="Pending"
            value={
              stats.pending
            }
          />

          <StatCard
            label="Total Rooms"
            value={
              stats.totalRooms
            }
            hint="Across all hotels"
          />

          <StatCard
            label="Parking Slots"
            value={
              stats.totalParking
            }
            hint="Total capacity"
          />
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-navy/10 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() =>
              setActiveTab(
                'bookings',
              )
            }
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              activeTab ===
              'bookings'
                ? 'bg-navy text-white shadow-sm'
                : 'text-navy hover:bg-cream'
            }`}
          >
            Bookings
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                'inventory',
              )
            }
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              activeTab ===
              'inventory'
                ? 'bg-navy text-white shadow-sm'
                : 'text-navy hover:bg-cream'
            }`}
          >
            Rooms & Parking
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-11 h-11 mx-auto rounded-full border-4 border-navy/15 border-t-amber animate-spin" />

            <p className="mt-4 text-sm text-charcoal/50">
              Loading dashboard...
            </p>
          </div>
        ) : activeTab ===
          'inventory' ? (
          <div className="mt-6">
            <InventoryModule
              hotels={hotels}
              onReload={() =>
                loadDashboardData(
                  true,
                )
              }
            />
          </div>
        ) : (
          <section className="mt-6 rounded-3xl border border-navy/10 bg-white shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-5 border-b border-navy/10 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-navy">
                  Hotel Bookings
                </h3>

                <p className="mt-1 text-xs text-charcoal/45">
                  Latest booking
                  requests appear
                  first.
                </p>
              </div>

              <span className="rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-navy">
                {
                  bookings.length
                }{' '}
                records
              </span>
            </div>

            {bookings.length ===
            0 ? (
              <div className="py-20 px-6 text-center">
                <div className="text-5xl">
                  🛎️
                </div>

                <h4 className="mt-4 font-display text-xl font-bold text-navy">
                  No bookings yet
                </h4>

                <p className="mt-2 text-sm text-charcoal/50">
                  New hotel
                  bookings will
                  appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left">
                    <thead className="bg-cream/60">
                      <tr className="text-xs uppercase tracking-wide text-charcoal/50">
                        <th className="px-5 py-4">
                          Booking
                        </th>
                        <th className="px-5 py-4">
                          Guest
                        </th>
                        <th className="px-5 py-4">
                          Hotel /
                          Room
                        </th>
                        <th className="px-5 py-4">
                          Stay
                        </th>
                        <th className="px-5 py-4">
                          Parking
                        </th>
                        <th className="px-5 py-4">
                          Status
                        </th>
                        <th className="px-5 py-4">
                          Update
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-navy/8">
                      {bookings.map(
                        (
                          booking,
                        ) => (
                          <tr
                            key={
                              booking.id
                            }
                            className="align-top hover:bg-cream/25 transition"
                          >
                            <td className="px-5 py-5">
                              <p className="font-bold text-navy">
                                {
                                  booking.booking_code
                                }
                              </p>

                              <p className="text-xs text-charcoal/45 mt-1">
                                {new Date(
                                  booking.created_at,
                                ).toLocaleString()}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="font-semibold text-navy">
                                {
                                  booking.guest_name
                                }
                              </p>

                              <p className="text-xs text-charcoal/55 mt-1">
                                {
                                  booking.phone
                                }
                              </p>

                              {booking.email && (
                                <p className="text-xs text-charcoal/45 mt-1">
                                  {
                                    booking.email
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-5 py-5">
                              <p className="font-semibold text-navy">
                                {booking
                                  .hotels
                                  ?.name ||
                                  'Hotel'}
                              </p>

                              <p className="text-xs text-charcoal/50 mt-1">
                                {booking
                                  .room_types
                                  ?.name ||
                                  'Room'}{' '}
                                ·{' '}
                                {
                                  booking.rooms_count
                                }{' '}
                                room(s)
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="text-sm font-semibold text-navy">
                                {
                                  booking.check_in
                                }
                              </p>

                              <p className="text-xs text-charcoal/45 mt-1">
                                to{' '}
                                {
                                  booking.check_out
                                }
                              </p>

                              <p className="text-xs text-charcoal/45 mt-1">
                                {
                                  booking.adults
                                }{' '}
                                adult(s),{' '}
                                {
                                  booking.children
                                }{' '}
                                child(ren)
                              </p>
                            </td>

                            <td className="px-5 py-5 text-sm">
                              {booking.parking_required ? (
                                <>
                                  <span className="font-semibold text-green-700">
                                    Required
                                  </span>

                                  {booking.vehicle_number && (
                                    <p className="text-xs text-charcoal/45 mt-1">
                                      {
                                        booking.vehicle_number
                                      }
                                    </p>
                                  )}
                                </>
                              ) : (
                                <span className="text-charcoal/40">
                                  Not
                                  required
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-5">
                              <StatusBadge
                                status={
                                  booking.status
                                }
                              />
                            </td>

                            <td className="px-5 py-5">
                              <select
                                value={
                                  booking.status
                                }
                                disabled={
                                  updatingId ===
                                  booking.id
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleStatusChange(
                                    booking.id,
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className="rounded-lg border border-navy/15 bg-white px-3 py-2 text-xs font-semibold text-navy outline-none focus:border-amber disabled:opacity-60"
                              >
                                {STATUS_OPTIONS.map(
                                  (
                                    status,
                                  ) => (
                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {
                                        statusLabel[
                                          status
                                        ]
                                      }
                                    </option>
                                  ),
                                )}
                              </select>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden divide-y divide-navy/10">
                  {bookings.map(
                    (
                      booking,
                    ) => (
                      <article
                        key={
                          booking.id
                        }
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-navy">
                              {
                                booking.booking_code
                              }
                            </p>

                            <p className="text-xs text-charcoal/45 mt-1">
                              {
                                booking
                                  .hotels
                                  ?.name
                              }
                            </p>
                          </div>

                          <StatusBadge
                            status={
                              booking.status
                            }
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-5 text-sm">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">
                              Guest
                            </p>

                            <p className="mt-1 font-semibold text-navy">
                              {
                                booking.guest_name
                              }
                            </p>

                            <p className="text-xs text-charcoal/55">
                              {
                                booking.phone
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">
                              Room
                            </p>

                            <p className="mt-1 font-semibold text-navy">
                              {
                                booking
                                  .room_types
                                  ?.name
                              }
                            </p>

                            <p className="text-xs text-charcoal/55">
                              {
                                booking.rooms_count
                              }{' '}
                              room(s)
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">
                              Stay
                            </p>

                            <p className="mt-1 text-navy">
                              {
                                booking.check_in
                              }{' '}
                              →{' '}
                              {
                                booking.check_out
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">
                              Parking
                            </p>

                            <p className="mt-1 text-navy">
                              {booking.parking_required
                                ? booking.vehicle_number ||
                                  'Required'
                                : 'Not required'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="block text-xs font-semibold text-charcoal/45 mb-2">
                            Update
                            status
                          </label>

                          <select
                            value={
                              booking.status
                            }
                            disabled={
                              updatingId ===
                              booking.id
                            }
                            onChange={(
                              event,
                            ) =>
                              handleStatusChange(
                                booking.id,
                                event
                                  .target
                                  .value,
                              )
                            }
                            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm font-semibold text-navy outline-none focus:border-amber disabled:opacity-60"
                          >
                            {STATUS_OPTIONS.map(
                              (
                                status,
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {
                                    statusLabel[
                                      status
                                    ]
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
