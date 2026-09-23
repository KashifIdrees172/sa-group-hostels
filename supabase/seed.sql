insert into public.hotels
(slug,name,short_name,location,address,description,starting_price,phone,whatsapp,is_active)
values
('hotel-one','SA Hotel - Branch 1','Hotel Branch 1','Lahore','Add hotel branch 1 address here',
 'Comfortable and affordable hotel accommodation for families, travelers, and professionals.',5000,
 '03193815068','923193815068',true),
('hotel-two','SA Hotel - Branch 2','Hotel Branch 2','Lahore','Add hotel branch 2 address here',
 'Clean and convenient hotel accommodation with comfortable rooms and secure parking.',5500,
 '03193815068','923193815068',true)
on conflict (slug) do update set
 name=excluded.name,
 short_name=excluded.short_name,
 location=excluded.location,
 address=excluded.address,
 description=excluded.description,
 starting_price=excluded.starting_price,
 phone=excluded.phone,
 whatsapp=excluded.whatsapp,
 is_active=excluded.is_active;

insert into public.room_types
(hotel_id,slug,name,price_per_night,total_rooms,max_guests,description)
select h.id,x.slug,x.name,x.price,x.total_rooms,x.max_guests,x.description
from public.hotels h
cross join (
 values
 ('standard','Standard Room',5000::numeric,10,2,'Comfortable room for up to two guests.'),
 ('deluxe','Deluxe Room',7500::numeric,6,2,'Upgraded room with extra comfort.'),
 ('family','Family Room',10000::numeric,4,4,'Spacious room suitable for families.')
) as x(slug,name,price,total_rooms,max_guests,description)
where h.slug='hotel-one'
on conflict (hotel_id,slug) do update set
 name=excluded.name,
 price_per_night=excluded.price_per_night,
 total_rooms=excluded.total_rooms,
 max_guests=excluded.max_guests,
 description=excluded.description,
 is_active=true;

insert into public.room_types
(hotel_id,slug,name,price_per_night,total_rooms,max_guests,description)
select h.id,x.slug,x.name,x.price,x.total_rooms,x.max_guests,x.description
from public.hotels h
cross join (
 values
 ('standard','Standard Room',5500::numeric,12,2,'Comfortable room for up to two guests.'),
 ('deluxe','Deluxe Room',8000::numeric,8,2,'Upgraded room with extra comfort.'),
 ('family','Family Room',11000::numeric,5,4,'Spacious room suitable for families.')
) as x(slug,name,price,total_rooms,max_guests,description)
where h.slug='hotel-two'
on conflict (hotel_id,slug) do update set
 name=excluded.name,
 price_per_night=excluded.price_per_night,
 total_rooms=excluded.total_rooms,
 max_guests=excluded.max_guests,
 description=excluded.description,
 is_active=true;

insert into public.parking_config(hotel_id,total_slots)
select id,12 from public.hotels where slug='hotel-one'
on conflict (hotel_id) do update set total_slots=excluded.total_slots;

insert into public.parking_config(hotel_id,total_slots)
select id,15 from public.hotels where slug='hotel-two'
on conflict (hotel_id) do update set total_slots=excluded.total_slots;
