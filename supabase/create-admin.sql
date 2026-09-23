-- First create the admin user in Supabase:
-- Authentication > Users > Add user
-- Then replace YOUR_AUTH_USER_UUID with that user's UUID.

insert into public.admin_profiles(user_id,role,display_name)
values (
  'YOUR_AUTH_USER_UUID'::uuid,
  'admin',
  'SA Group Admin'
)
on conflict (user_id) do update
set role=excluded.role,
    display_name=excluded.display_name;
