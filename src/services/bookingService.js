import { supabase } from '../lib/supabase.js'

export async function createHotelBooking({
  hotelSlug,
  roomTypeSlug,
  guestName,
  phone,
  email = '',
  checkIn,
  checkOut,
  adults = 1,
  children = 0,
  roomsCount = 1,
  parkingRequired = false,
  vehicleNumber = '',
  specialRequests = '',
}) {
  const { data, error } = await supabase.rpc(
    'create_hotel_booking',
    {
      p_hotel_slug: hotelSlug,
      p_room_type_slug: roomTypeSlug,
      p_guest_name: guestName,
      p_phone: phone,
      p_email: email,
      p_check_in: checkIn,
      p_check_out: checkOut,
      p_adults: Number(adults),
      p_children: Number(children),
      p_rooms_count: Number(roomsCount),
      p_parking_required:
        Boolean(parkingRequired),
      p_vehicle_number: vehicleNumber,
      p_special_requests:
        specialRequests,
    },
  )

  if (error) throw error
  return data?.[0] ?? null
}
