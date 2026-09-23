import { supabase } from '../lib/supabase.js'
import localHotels from '../data/hotels.js'

const getLocalHotel = (slug) =>
  localHotels.find((hotel) => hotel.id === slug)

const toDateString = (date) => {
  const copy = new Date(date)
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset())
  return copy.toISOString().split('T')[0]
}

export function getDefaultAvailabilityDates() {
  const today = new Date()
  const tomorrow = new Date(today)

  tomorrow.setDate(tomorrow.getDate() + 1)

  return {
    checkIn: toDateString(today),
    checkOut: toDateString(tomorrow),
  }
}

export async function getRoomAvailability(
  hotelSlug,
  checkIn,
  checkOut,
) {
  const { data, error } = await supabase.rpc(
    'get_room_availability',
    {
      p_hotel_slug: hotelSlug,
      p_check_in: checkIn,
      p_check_out: checkOut,
    },
  )

  if (error) throw error

  return data ?? []
}

export async function getParkingAvailability(
  hotelSlug,
  checkIn,
  checkOut,
) {
  const { data, error } = await supabase.rpc(
    'get_parking_availability',
    {
      p_hotel_slug: hotelSlug,
      p_check_in: checkIn,
      p_check_out: checkOut,
    },
  )

  if (error) throw error

  return data?.[0] ?? {
    total_slots: 0,
    reserved_slots: 0,
    available_slots: 0,
  }
}

function mapHotel(
  dbHotel,
  roomAvailability = [],
  parkingAvailability = null,
) {
  const localHotel = getLocalHotel(dbHotel.slug)

  const roomTypes = (dbHotel.room_types ?? [])
    .filter((room) => room.is_active !== false)
    .map((room) => {
      const availability = roomAvailability.find(
        (item) => item.room_type_slug === room.slug,
      )

      // IMPORTANT:
      // Supabase stores room data, but images are local Vite assets.
      // Match the database room slug with the local room object.
      const localRoom = localHotel?.roomTypes?.find(
        (item) => item.id === room.slug,
      )

      return {
        id: room.slug,
        databaseId: room.id,
        name: room.name,

        price: Number(
          room.price_per_night ?? localRoom?.price ?? 0,
        ),

        totalRooms: Number(
          room.total_rooms ?? localRoom?.totalRooms ?? 0,
        ),

        availableRooms: Number(
          availability?.available_rooms ??
            room.total_rooms ??
            localRoom?.availableRooms ??
            0,
        ),

        reservedRooms: Number(
          availability?.reserved_rooms ?? 0,
        ),

        maxGuests: Number(
          room.max_guests ?? localRoom?.maxGuests ?? 1,
        ),

        description:
          room.description ||
          localRoom?.description ||
          '',

        // Restore local room image after Supabase mapping.
        image:
          localRoom?.image ||
          localHotel?.coverImage ||
          null,
      }
    })
    .sort((a, b) => a.price - b.price)

  const totalRooms = roomTypes.reduce(
    (sum, room) => sum + room.totalRooms,
    0,
  )

  const availableRooms = roomTypes.reduce(
    (sum, room) => sum + room.availableRooms,
    0,
  )

  const configuredParking =
    dbHotel.parking_config?.[0]?.total_slots ??
    dbHotel.parking_config?.total_slots ??
    localHotel?.parking?.totalSlots ??
    0

  const totalParking = Number(
    parkingAvailability?.total_slots ??
      configuredParking ??
      0,
  )

  const availableParking = Number(
    parkingAvailability?.available_slots ??
      totalParking,
  )

  return {
    id: dbHotel.slug,
    databaseId: dbHotel.id,

    name:
      dbHotel.name ||
      localHotel?.name ||
      dbHotel.slug,

    shortName:
      dbHotel.short_name ||
      localHotel?.shortName ||
      dbHotel.name,

    location:
      dbHotel.location ||
      localHotel?.location ||
      '',

    address:
      dbHotel.address ||
      localHotel?.address ||
      '',

    description:
      dbHotel.description ||
      localHotel?.description ||
      '',

    // Restore hotel cover from local Vite assets.
    coverImage:
      localHotel?.coverImage ||
      null,

    startingPrice: Number(
      dbHotel.starting_price ??
        localHotel?.startingPrice ??
        roomTypes[0]?.price ??
        0,
    ),

    rooms: {
      total: totalRooms,
      available: availableRooms,
    },

    parking: {
      totalSlots: totalParking,
      availableSlots: availableParking,
      reservedSlots: Number(
        parkingAvailability?.reserved_slots ?? 0,
      ),
    },

    roomTypes,

    facilities:
      localHotel?.facilities ?? [],

    contact: {
      phone:
        dbHotel.phone ||
        localHotel?.contact?.phone ||
        '03193815068',

      whatsapp:
        dbHotel.whatsapp ||
        localHotel?.contact?.whatsapp ||
        '923193815068',
    },
  }
}

async function getBaseHotelsQuery() {
  const { data, error } = await supabase
    .from('hotels')
    .select(`
      id,
      slug,
      name,
      short_name,
      location,
      address,
      description,
      starting_price,
      phone,
      whatsapp,
      is_active,
      room_types (
        id,
        slug,
        name,
        price_per_night,
        total_rooms,
        max_guests,
        description,
        is_active
      ),
      parking_config (
        total_slots
      )
    `)
    .eq('is_active', true)
    .order('name')

  if (error) throw error

  return data ?? []
}

export async function getHotels(
  checkIn,
  checkOut,
) {
  const defaults = getDefaultAvailabilityDates()

  const from =
    checkIn || defaults.checkIn

  const to =
    checkOut || defaults.checkOut

  const databaseHotels =
    await getBaseHotelsQuery()

  return Promise.all(
    databaseHotels.map(async (hotel) => {
      const [rooms, parking] =
        await Promise.all([
          getRoomAvailability(
            hotel.slug,
            from,
            to,
          ),

          getParkingAvailability(
            hotel.slug,
            from,
            to,
          ),
        ])

      return mapHotel(
        hotel,
        rooms,
        parking,
      )
    }),
  )
}

export async function getHotelBySlug(
  slug,
  checkIn,
  checkOut,
) {
  const defaults = getDefaultAvailabilityDates()

  const from =
    checkIn || defaults.checkIn

  const to =
    checkOut || defaults.checkOut

  const { data, error } = await supabase
    .from('hotels')
    .select(`
      id,
      slug,
      name,
      short_name,
      location,
      address,
      description,
      starting_price,
      phone,
      whatsapp,
      is_active,
      room_types (
        id,
        slug,
        name,
        price_per_night,
        total_rooms,
        max_guests,
        description,
        is_active
      ),
      parking_config (
        total_slots
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error

  const [rooms, parking] =
    await Promise.all([
      getRoomAvailability(
        slug,
        from,
        to,
      ),

      getParkingAvailability(
        slug,
        from,
        to,
      ),
    ])

  return mapHotel(
    data,
    rooms,
    parking,
  )
}

export function getLocalHotelFallback(slug) {
  return getLocalHotel(slug)
}
