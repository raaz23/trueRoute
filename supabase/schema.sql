-- TrueRoute production schema — run in Supabase SQL Editor
-- Project: trueroute-production

create extension if not exists "uuid-ossp";

-- Users (extends auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  nationality text,
  languages_spoken text[],
  role text default 'tourist',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  country text default 'Nepal',
  description text,
  latitude decimal(10,8) not null,
  longitude decimal(11,8) not null,
  altitude text,
  best_time text,
  is_active boolean default true,
  hero_image_url text,
  created_at timestamptz default now()
);

create table if not exists public.places (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id) on delete cascade,
  name text not null,
  slug text unique not null,
  category text,
  description text,
  history text,
  latitude decimal(10,8) not null,
  longitude decimal(11,8) not null,
  entry_fee_local integer,
  entry_fee_tourist integer,
  best_time text,
  how_to_get_there text,
  highlights text[],
  approved boolean default false,
  created_by uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.prices (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id),
  category text not null,
  service_name text not null,
  route_from text,
  route_to text,
  tourist_price_min integer,
  tourist_price_max integer,
  fair_price_min integer not null,
  fair_price_max integer not null,
  currency text default 'NPR',
  local_tip text,
  verified boolean default false,
  last_verified_at timestamptz,
  submitted_by uuid references users(id),
  approved_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists public.chat_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete set null,
  session_id text not null unique,
  messages jsonb not null default '[]',
  user_location text,
  city_context text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gps_tracking (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  session_id text not null,
  latitude decimal(10,8) not null,
  longitude decimal(11,8) not null,
  accuracy decimal(10,2),
  speed decimal(5,2),
  city_detected text,
  is_danger_zone boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.translations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete set null,
  session_id text,
  source_text text not null,
  source_language text not null,
  target_language text not null,
  translated_text text not null,
  translation_method text,
  created_at timestamptz default now()
);

create table if not exists public.weather_alerts (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id),
  alert_type text,
  severity text,
  title text not null,
  description text not null,
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.danger_zones (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id),
  zone_name text not null,
  reason text not null,
  latitude decimal(10,8) not null,
  longitude decimal(11,8) not null,
  radius_meters integer not null,
  severity text,
  is_active boolean default true,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete set null,
  place_id uuid references places(id) on delete set null,
  feedback_type text,
  rating integer check (rating >= 1 and rating <= 5),
  title text,
  message text not null,
  category_tags text[],
  screenshot_url text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  country text,
  referral_source text,
  created_at timestamptz default now()
);

create table if not exists public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete set null,
  session_id text not null,
  action_type text not null,
  details jsonb,
  user_location text,
  created_at timestamptz default now()
);

-- RLS
alter table users enable row level security;
alter table places enable row level security;
alter table prices enable row level security;
alter table chat_conversations enable row level security;
alter table gps_tracking enable row level security;
alter table feedback enable row level security;
alter table translations enable row level security;
alter table activity_log enable row level security;

create policy "Users view own profile" on users for select using (auth.uid() = id);
create policy "Anyone view approved places" on places for select using (approved = true);
create policy "Anyone view verified prices" on prices for select using (verified = true);
create policy "Anyone view active danger zones" on danger_zones for select using (is_active = true);
create policy "Anyone view active weather alerts" on weather_alerts for select using (is_active = true);

create policy "Insert chat" on chat_conversations for insert with check (true);
create policy "Select own chat" on chat_conversations for select using (true);
create policy "Update own chat" on chat_conversations for update using (true);

create policy "Insert gps" on gps_tracking for insert with check (true);
create policy "Insert feedback" on feedback for insert with check (true);
create policy "Insert translations" on translations for insert with check (true);
create policy "Insert activity" on activity_log for insert with check (true);

-- Indexes
create index if not exists idx_places_city on places(city_id);
create index if not exists idx_places_slug on places(slug);
create index if not exists idx_prices_city on prices(city_id);
create index if not exists idx_gps_session on gps_tracking(session_id);
create index if not exists idx_chat_session on chat_conversations(session_id);

-- Seed cities
insert into cities (name, country, latitude, longitude, altitude, best_time, is_active) values
('Kathmandu', 'Nepal', 27.7172, 85.3240, '1,400m', 'Oct - Apr', true),
('Pokhara', 'Nepal', 28.2096, 83.9856, '822m', 'Sep - Nov', true),
('Chitwan', 'Nepal', 27.5291, 84.3542, '415m', 'Oct - Mar', true),
('Lumbini', 'Nepal', 27.4833, 83.2833, '95m', 'Nov - Feb', true),
('Nagarkot', 'Nepal', 27.7172, 85.5200, '2,195m', 'Oct - Dec', true),
('Mustang', 'Nepal', 28.9900, 83.8700, '3,840m', 'Mar - Nov', true)
on conflict do nothing;

-- Sample danger zone (Thamel late night caution — example)
insert into danger_zones (zone_name, reason, latitude, longitude, radius_meters, severity, is_active)
select 'Thamel late-night caution', 'Pickpocket reports after midnight — stay on lit main streets',
  27.7154, 85.3123, 400, 'caution', true
where not exists (select 1 from danger_zones limit 1);
