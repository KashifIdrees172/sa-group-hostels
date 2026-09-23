# SA Group Backend Setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Then run `supabase/seed.sql`.
4. In the React/Vite project run:

   npm install @supabase/supabase-js

5. Copy `.env.example` to `.env` and add your Project URL and Anon/Public key.
6. Restart Vite after editing `.env`.
7. Copy the included `src/lib` and `src/services` files into your project.

## Admin

Create the first admin in:

Authentication > Users > Add user

Copy the user's UUID, edit `supabase/create-admin.sql`, replace
`YOUR_AUTH_USER_UUID`, and run that SQL.

## What this backend already supports

- Hotels stored in database
- Room types and prices
- Total room inventory
- Date-based room availability
- Parking capacity
- Date-based parking availability
- Booking creation
- Booking status
- Supabase Auth admin login foundation
- Row Level Security
- Admin-only booking/room/parking management

## Important

Public users cannot directly edit hotel data or read all bookings.

A public booking is created through the safe `create_hotel_booking` database function.

Availability uses booking date overlap, not a manually decremented number.
