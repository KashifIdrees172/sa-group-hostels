import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  getParkingAvailability,
  getRoomAvailability,
} from '../../services/hotelService.js'
import {
  createHotelBooking,
} from '../../services/bookingService.js'

const initialForm = {
  fullName: '',
  mobile: '',
  email: '',
  checkIn: '',
  checkOut: '',
  adults: '1',
  children: '0',
  roomType: '',
  numberOfRooms: '1',
  parkingRequired: 'No',
  vehicleNumber: '',
  requests: '',
}

function Field({
  label,
  required,
  children,
  className = '',
}) {
  return (
    <label
      className={`inspection-field ${className}`}
    >
      <span>
        {label}
        {required && (
          <b aria-hidden="true"> *</b>
        )}
      </span>
      {children}
    </label>
  )
}

export default function HotelBookingForm({
  hotel,
}) {
  const [form, setForm] =
    useState(initialForm)

  const [availability, setAvailability] =
    useState({
      rooms: hotel.roomTypes,
      parking: hotel.parking,
    })

  const [checkingAvailability, setCheckingAvailability] =
    useState(false)

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState(null)

  const today = new Date()

  const minDate = new Date(
    today.getTime() -
      today.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split('T')[0]

  useEffect(() => {
    setAvailability({
      rooms: hotel.roomTypes,
      parking: hotel.parking,
    })
  }, [hotel])

  useEffect(() => {
    if (
      !form.checkIn ||
      !form.checkOut ||
      new Date(form.checkOut) <=
        new Date(form.checkIn)
    ) {
      return
    }

    let active = true

    const loadAvailability =
      async () => {
        setCheckingAvailability(true)
        setError('')

        try {
          const [roomData, parkingData] =
            await Promise.all([
              getRoomAvailability(
                hotel.id,
                form.checkIn,
                form.checkOut,
              ),
              getParkingAvailability(
                hotel.id,
                form.checkIn,
                form.checkOut,
              ),
            ])

          if (!active) return

          const mappedRooms =
            hotel.roomTypes.map((room) => {
              const live =
                roomData.find(
                  (item) =>
                    item.room_type_slug ===
                    room.id,
                )

              return {
                ...room,
                totalRooms: Number(
                  live?.total_rooms ??
                    room.totalRooms,
                ),
                availableRooms: Number(
                  live?.available_rooms ??
                    room.availableRooms,
                ),
                reservedRooms: Number(
                  live?.reserved_rooms ??
                    0,
                ),
                price: Number(
                  live?.price_per_night ??
                    room.price,
                ),
              }
            })

          setAvailability({
            rooms: mappedRooms,
            parking: {
              totalSlots: Number(
                parkingData.total_slots ??
                  hotel.parking.totalSlots,
              ),
              reservedSlots: Number(
                parkingData.reserved_slots ??
                  0,
              ),
              availableSlots: Number(
                parkingData.available_slots ??
                  hotel.parking
                    .availableSlots,
              ),
            },
          })
        } catch (availabilityError) {
          console.error(
            'Availability check failed:',
            availabilityError,
          )

          if (active) {
            setError(
              availabilityError?.message ||
                'Unable to check live availability. Please try again.',
            )
          }
        } finally {
          if (active) {
            setCheckingAvailability(false)
          }
        }
      }

    const timer =
      window.setTimeout(
        loadAvailability,
        250,
      )

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [
    form.checkIn,
    form.checkOut,
    hotel,
  ])

  const selectedRoom = useMemo(
    () =>
      availability.rooms.find(
        (room) =>
          room.id === form.roomType,
      ),
    [
      availability.rooms,
      form.roomType,
    ],
  )

  const totalAvailableRooms =
    availability.rooms.reduce(
      (sum, room) =>
        sum + room.availableRooms,
      0,
    )

  const totalRooms =
    availability.rooms.reduce(
      (sum, room) =>
        sum + room.totalRooms,
      0,
    )

  const update = (event) => {
    const { name, value } =
      event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setSuccess(null)

    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    const cleanMobile =
      form.mobile.replace(/\D/g, '')

    if (
      cleanMobile.length < 10 ||
      cleanMobile.length > 13
    ) {
      return 'Please enter a valid mobile number.'
    }

    if (
      !form.checkIn ||
      !form.checkOut
    ) {
      return 'Please select check-in and check-out dates.'
    }

    if (
      new Date(form.checkOut) <=
      new Date(form.checkIn)
    ) {
      return 'Check-out date must be after the check-in date.'
    }

    if (
      !selectedRoom ||
      selectedRoom.availableRooms <= 0
    ) {
      return 'Please select a room type that is available for the selected dates.'
    }

    if (
      Number(form.numberOfRooms) >
      selectedRoom.availableRooms
    ) {
      return `Only ${selectedRoom.availableRooms} ${selectedRoom.name} room(s) are available for these dates.`
    }

    if (
      form.parkingRequired ===
        'Yes' &&
      availability.parking
        .availableSlots <= 0
    ) {
      return 'Parking is full for the selected dates.'
    }

    return ''
  }

  const buildWhatsAppMessage = (
    bookingCode,
  ) => {
    const lines = [
      '🏨 *New Hotel Booking Request*',
      '',
      `🧾 *Booking Code:* ${bookingCode}`,
      `🏢 *Hotel:* ${hotel.name}`,
      `📍 *Location:* ${hotel.location}`,
      '',
      `👤 *Guest Name:* ${form.fullName}`,
      `📱 *Mobile:* ${form.mobile}`,
      form.email
        ? `✉️ *Email:* ${form.email}`
        : null,
      '',
      `📅 *Check-in:* ${form.checkIn}`,
      `📅 *Check-out:* ${form.checkOut}`,
      `👥 *Adults:* ${form.adults}`,
      `🧒 *Children:* ${form.children}`,
      `🛏️ *Room Type:* ${selectedRoom.name}`,
      `🔢 *Number of Rooms:* ${form.numberOfRooms}`,
      `💰 *Room Price:* Rs. ${selectedRoom.price.toLocaleString()} / night`,
      '',
      `🚗 *Parking Required:* ${form.parkingRequired}`,
      form.parkingRequired ===
          'Yes' &&
        form.vehicleNumber
        ? `🚘 *Vehicle Number:* ${form.vehicleNumber}`
        : null,
      form.requests
        ? `📝 *Special Requests:* ${form.requests}`
        : null,
      '',
      '_Booking has been submitted to the SA Group system and is awaiting confirmation._',
    ].filter(Boolean)

    return lines.join('\n')
  }

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()
    setError('')
    setSuccess(null)

    const validationError =
      validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    try {
      const booking =
        await createHotelBooking({
          hotelSlug: hotel.id,
          roomTypeSlug:
            selectedRoom.id,
          guestName:
            form.fullName.trim(),
          phone:
            form.mobile.trim(),
          email:
            form.email.trim(),
          checkIn:
            form.checkIn,
          checkOut:
            form.checkOut,
          adults:
            Number(form.adults),
          children:
            Number(form.children),
          roomsCount:
            Number(
              form.numberOfRooms,
            ),
          parkingRequired:
            form.parkingRequired ===
            'Yes',
          vehicleNumber:
            form.vehicleNumber.trim(),
          specialRequests:
            form.requests.trim(),
        })

      if (
        !booking?.booking_code
      ) {
        throw new Error(
          'Booking was saved but no booking code was returned.',
        )
      }

      setSuccess({
        bookingCode:
          booking.booking_code,
      })

      const whatsappMessage =
        buildWhatsAppMessage(
          booking.booking_code,
        )

      const whatsappNumber =
        hotel.contact?.whatsapp ||
        '923193815068'

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          whatsappMessage,
        )}`

      window.open(
        whatsappUrl,
        '_blank',
        'noopener,noreferrer',
      )

      const [
        roomData,
        parkingData,
      ] = await Promise.all([
        getRoomAvailability(
          hotel.id,
          form.checkIn,
          form.checkOut,
        ),
        getParkingAvailability(
          hotel.id,
          form.checkIn,
          form.checkOut,
        ),
      ])

      setAvailability((current) => ({
        rooms:
          current.rooms.map(
            (room) => {
              const live =
                roomData.find(
                  (item) =>
                    item.room_type_slug ===
                    room.id,
                )

              return live
                ? {
                    ...room,
                    availableRooms:
                      Number(
                        live.available_rooms,
                      ),
                    reservedRooms:
                      Number(
                        live.reserved_rooms,
                      ),
                  }
                : room
            },
          ),
        parking: {
          totalSlots: Number(
            parkingData.total_slots ??
              current.parking
                .totalSlots,
          ),
          reservedSlots: Number(
            parkingData.reserved_slots ??
              0,
          ),
          availableSlots: Number(
            parkingData.available_slots ??
              current.parking
                .availableSlots,
          ),
        },
      }))
    } catch (submitError) {
      console.error(
        'Hotel booking failed:',
        submitError,
      )

      setError(
        submitError?.message ||
          'Unable to submit the booking. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      id="hotel-booking"
      className="rounded-[2rem] border border-navy/10 bg-white shadow-xl shadow-navy/5 overflow-hidden scroll-mt-28"
    >
      <div className="bg-navy px-6 py-7 md:px-8 text-white">
        <p className="text-amber text-[11px] font-extrabold uppercase tracking-[.22em]">
          Book your stay
        </p>

        <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold">
          Request a room at{' '}
          {hotel.shortName}
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/60">
          Select your dates to check
          live room and parking
          availability. Your request
          will be saved and sent to
          the hotel team for
          confirmation.
        </p>
      </div>

      <form
        className="inspection-form"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-cream/60 border border-navy/10 p-4">
            <p className="text-xs uppercase tracking-wide text-charcoal/45 font-bold">
              Rooms available
            </p>

            <p className="mt-1 text-2xl font-extrabold text-navy">
              {checkingAvailability
                ? '...'
                : `${totalAvailableRooms} / ${totalRooms}`}
            </p>

            <p className="mt-1 text-xs text-charcoal/45">
              For selected dates
            </p>
          </div>

          <div className="rounded-2xl bg-cream/60 border border-navy/10 p-4">
            <p className="text-xs uppercase tracking-wide text-charcoal/45 font-bold">
              Parking available
            </p>

            <p className="mt-1 text-2xl font-extrabold text-navy">
              {checkingAvailability
                ? '...'
                : `${availability.parking.availableSlots} / ${availability.parking.totalSlots}`}
            </p>

            <p className="mt-1 text-xs text-charcoal/45">
              For selected dates
            </p>
          </div>
        </div>

        <div className="inspection-grid">
          <Field
            label="Full Name"
            required
          >
            <input
              name="fullName"
              value={form.fullName}
              onChange={update}
              placeholder="e.g. Muhammad Awais"
              autoComplete="name"
              required
            />
          </Field>

          <Field
            label="Mobile / WhatsApp"
            required
          >
            <input
              name="mobile"
              value={form.mobile}
              onChange={update}
              placeholder="03123456789"
              inputMode="tel"
              autoComplete="tel"
              required
            />
          </Field>

          <Field label="Email">
            <input
              name="email"
              value={form.email}
              onChange={update}
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
            />
          </Field>

          <Field
            label="Room Type"
            required
          >
            <select
              name="roomType"
              value={form.roomType}
              onChange={update}
              required
            >
              <option value="">
                Select room type
              </option>

              {availability.rooms.map(
                (room) => (
                  <option
                    key={room.id}
                    value={room.id}
                    disabled={
                      room.availableRooms ===
                      0
                    }
                  >
                    {room.name} — Rs.{' '}
                    {room.price.toLocaleString()}{' '}
                    —{' '}
                    {room.availableRooms}{' '}
                    available
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field
            label="Check-in Date"
            required
          >
            <input
              name="checkIn"
              value={form.checkIn}
              onChange={update}
              type="date"
              min={minDate}
              required
            />
          </Field>

          <Field
            label="Check-out Date"
            required
          >
            <input
              name="checkOut"
              value={form.checkOut}
              onChange={update}
              type="date"
              min={
                form.checkIn ||
                minDate
              }
              required
            />
          </Field>

          <Field
            label="Adults"
            required
          >
            <select
              name="adults"
              value={form.adults}
              onChange={update}
              required
            >
              {[1, 2, 3, 4, 5, 6].map(
                (count) => (
                  <option key={count}>
                    {count}
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field label="Children">
            <select
              name="children"
              value={form.children}
              onChange={update}
            >
              {[0, 1, 2, 3, 4].map(
                (count) => (
                  <option key={count}>
                    {count}
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field
            label="Number of Rooms"
            required
          >
            <select
              name="numberOfRooms"
              value={
                form.numberOfRooms
              }
              onChange={update}
              required
            >
              {[1, 2, 3, 4, 5].map(
                (count) => (
                  <option
                    key={count}
                    value={count}
                  >
                    {count}
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field
            label="Parking Required?"
            required
          >
            <select
              name="parkingRequired"
              value={
                form.parkingRequired
              }
              onChange={update}
              required
            >
              <option>No</option>
              <option
                disabled={
                  availability.parking
                    .availableSlots === 0
                }
              >
                Yes
              </option>
            </select>
          </Field>

          {form.parkingRequired ===
            'Yes' && (
            <Field label="Vehicle Number">
              <input
                name="vehicleNumber"
                value={
                  form.vehicleNumber
                }
                onChange={update}
                placeholder="e.g. LEA-1234"
              />
            </Field>
          )}

          <Field
            label="Special Requests"
            className="inspection-field--wide"
          >
            <textarea
              name="requests"
              value={form.requests}
              onChange={update}
              placeholder="Late check-in, extra mattress, family requirements, or any other request..."
            />
          </Field>
        </div>

        {checkingAvailability && (
          <div className="mt-5 rounded-2xl border border-navy/10 bg-cream/60 px-4 py-3 text-sm text-navy">
            Checking live availability
            for the selected dates...
          </div>
        )}

        {selectedRoom &&
          !checkingAvailability && (
          <div className="mt-5 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-navy">
            <b>
              {selectedRoom.name}:
            </b>{' '}
            {
              selectedRoom.availableRooms
            }{' '}
            room(s) available at Rs.{' '}
            {selectedRoom.price.toLocaleString()}{' '}
            per night for the
            selected dates.
          </div>
        )}

        {success && (
          <div
            className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800"
            role="status"
          >
            <b>
              Booking submitted
              successfully.
            </b>
            <p className="mt-1">
              Booking code:{' '}
              <strong>
                {success.bookingCode}
              </strong>
            </p>
            <p className="mt-1 text-green-700/75">
              Our team will contact
              you shortly to confirm
              your stay.
            </p>
          </div>
        )}

        {error && (
          <p
            className="inspection-error"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="inspection-submit-wrap">
          <button
            type="submit"
            className="inspection-submit"
            disabled={
              submitting ||
              checkingAvailability
            }
          >
            {submitting
              ? 'Submitting Booking...'
              : 'Book Hotel & Send on WhatsApp'}
          </button>

          <p>
            The system checks live
            availability and saves
            your booking before
            opening WhatsApp.
          </p>
        </div>
      </form>
    </div>
  )
}
