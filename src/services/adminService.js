import { supabase } from '../lib/supabase.js'

export async function adminLogin(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
    throw error
  }

  const isAdmin =
    await checkCurrentUserIsAdmin()

  if (!isAdmin) {
    await supabase.auth.signOut()
    throw new Error(
      'This account does not have admin access.',
    )
  }

  return data
}

export async function adminLogout() {
  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getCurrentSession() {
  const { data, error } =
    await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

export async function checkCurrentUserIsAdmin() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return false
  }

  const { data, error } = await supabase
    .from('admin_profiles')
    .select(
      'user_id, role, display_name',
    )
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return Boolean(data)
}

export async function getAdminBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      hotels (
        id,
        slug,
        name
      ),
      room_types (
        id,
        slug,
        name,
        price_per_night
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function updateBookingStatus(
  bookingId,
  status,
) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/* ============================================================
   HOTEL / ROOM / PARKING MANAGEMENT
   ============================================================ */

export async function getAdminHotels() {
  const { data, error } = await supabase
    .from('hotels')
    .select(`
      id,
      slug,
      name,
      short_name,
      location,
      address,
      starting_price,
      is_active,
      room_types (
        id,
        slug,
        name,
        price_per_night,
        total_rooms,
        max_guests,
        is_active
      ),
      parking_config (
        hotel_id,
        total_slots
      )
    `)
    .order('name')

  if (error) {
    throw error
  }

  return (data ?? []).map((hotel) => ({
    ...hotel,
    room_types: [...(hotel.room_types ?? [])].sort(
      (a, b) =>
        Number(a.price_per_night) -
        Number(b.price_per_night),
    ),
    parking_config:
      hotel.parking_config?.[0] ??
      hotel.parking_config ??
      null,
  }))
}

export async function updateHotel(
  hotelId,
  changes,
) {
  const payload = {}

  if (
    changes.starting_price !== undefined
  ) {
    payload.starting_price = Number(
      changes.starting_price,
    )
  }

  if (changes.name !== undefined) {
    payload.name = changes.name
  }

  if (changes.location !== undefined) {
    payload.location = changes.location
  }

  if (changes.address !== undefined) {
    payload.address = changes.address
  }

  if (changes.is_active !== undefined) {
    payload.is_active =
      Boolean(changes.is_active)
  }

  const { data, error } = await supabase
    .from('hotels')
    .update(payload)
    .eq('id', hotelId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateRoomType(
  roomTypeId,
  changes,
) {
  const payload = {}

  if (
    changes.price_per_night !== undefined
  ) {
    payload.price_per_night = Number(
      changes.price_per_night,
    )
  }

  if (
    changes.total_rooms !== undefined
  ) {
    payload.total_rooms = Number(
      changes.total_rooms,
    )
  }

  if (
    changes.max_guests !== undefined
  ) {
    payload.max_guests = Number(
      changes.max_guests,
    )
  }

  if (changes.name !== undefined) {
    payload.name = changes.name
  }

  if (changes.is_active !== undefined) {
    payload.is_active =
      Boolean(changes.is_active)
  }

  const { data, error } = await supabase
    .from('room_types')
    .update(payload)
    .eq('id', roomTypeId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/* ============================================================
   HOSTEL / BRANCH LOCATION MANAGEMENT
   ============================================================ */

export async function getAdminBranchLocations() {
  const { data, error } = await supabase
    .from('branches')
    .select('id, location, updated_at')

  if (error) {
    throw error
  }

  return data ?? []
}

export async function updateBranchLocation(
  branchId,
  location,
) {
  const { data, error } = await supabase
    .from('branches')
    .upsert(
      {
        id: branchId,
        location: location?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      },
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateParkingCapacity(
  hotelId,
  totalSlots,
) {
  const { data, error } = await supabase
    .from('parking_config')
    .upsert(
      {
        hotel_id: hotelId,
        total_slots:
          Number(totalSlots),
      },
      {
        onConflict: 'hotel_id',
      },
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
