-- First create the admin user in Supabase:
-- Authentication > Users > Add user
-- Then replace YOUR_AUTH_USER_UUID with that user's UUID.

insert into public.admin_profiles(user_id,role,display_name)
values (
  'd7494a47-dbcc-40d1-a268-7d4126107f94'::uuid,
  'admin',
  'SA Group Admin'
)
on conflict (user_id) do update
set role=excluded.role,
    display_name=excluded.display_name;
