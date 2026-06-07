-- TrueRoute Business Marketplace — run after schema.sql in Supabase SQL Editor
-- Mirrors prisma/schema.prisma marketplace models for production PostgreSQL

-- ─── Enums as check constraints (Postgres text enums) ─────────────────────

create table if not exists public.businesses (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  qr_code text unique not null,
  account_type text not null default 'BUSINESS',
  category text not null,
  status text not null default 'PENDING',
  subscription_plan text not null default 'FREE',
  name text not null,
  tagline text,
  description text,
  established_year integer,
  email text not null,
  phone text,
  whatsapp text,
  website text,
  social_facebook text,
  social_instagram text,
  social_twitter text,
  social_youtube text,
  business_hours jsonb,
  languages jsonb,
  city_id uuid references cities(id),
  latitude decimal(10,8),
  longitude decimal(11,8),
  address text,
  nearby_landmarks text,
  cover_image_url text,
  logo_url text,
  amenities jsonb,
  certifications jsonb,
  awards jsonb,
  usps jsonb,
  trust_score decimal(5,2) default 0,
  emergency_trust_score decimal(5,2) default 100,
  profile_views integer default 0,
  qr_scans integer default 0,
  lead_count integer default 0,
  owner_id uuid references users(id),
  featured boolean default false,
  verified_at timestamptz,
  rejection_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.business_branches (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  address text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  phone text,
  is_primary boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.business_media (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  album text not null default 'INTERIOR',
  url text not null,
  thumbnail_url text,
  caption text,
  is_video boolean default false,
  video_provider text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.business_services (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  price_min integer,
  price_max integer,
  currency text default 'NPR',
  includes jsonb,
  excludes jsonb,
  hidden_fee_warning text,
  fair_price_note text,
  sort_order integer default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.business_packages (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  price integer not null,
  currency text default 'NPR',
  duration text,
  includes jsonb,
  excludes jsonb,
  seasonal boolean default false,
  valid_from timestamptz,
  valid_until timestamptz,
  published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.business_offers (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  title text not null,
  code text,
  description text,
  discount_pct integer,
  discount_amount integer,
  valid_from timestamptz,
  valid_until timestamptz,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.business_blog_posts (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  slug text not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  seo_title text,
  seo_description text,
  published boolean default false,
  published_at timestamptz,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(business_id, slug)
);

create table if not exists public.business_events (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  ticket_price integer,
  ticket_url text,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.business_reviews (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  user_id uuid references users(id),
  author_name text,
  nationality text,
  overall_rating integer not null check (overall_rating between 1 and 5),
  service_quality integer,
  fair_pricing integer,
  cleanliness integer,
  safety integer,
  authenticity integer,
  staff_behavior integer,
  text text,
  photo_urls jsonb,
  video_url text,
  review_fingerprint text,
  approved boolean default false,
  business_reply text,
  replied_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.business_reports (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  user_id uuid references users(id),
  report_type text not null,
  title text,
  description text not null,
  evidence_urls jsonb,
  amount_paid integer,
  expected_price integer,
  status text default 'pending',
  business_reply text,
  replied_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.business_inquiries (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  inquiry_type text default 'GENERAL',
  name text not null,
  email text,
  phone text,
  message text not null,
  preferred_date text,
  guest_count integer,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.business_qa (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  question text not null,
  asker_name text,
  answer text,
  answered_at timestamptz,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.business_badges (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  badge_type text not null,
  granted_at timestamptz default now(),
  expires_at timestamptz,
  note text,
  unique(business_id, badge_type)
);

create table if not exists public.business_documents (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  doc_type text not null,
  file_url text not null,
  file_name text,
  verified boolean default false,
  verified_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.admin_region_assignments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  city_id uuid references cities(id) on delete cascade not null,
  role text default 'SUB_ADMIN',
  created_at timestamptz default now(),
  unique(user_id, city_id)
);

create table if not exists public.business_analytics_events (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_businesses_slug on businesses(slug);
create index if not exists idx_businesses_status on businesses(status);
create index if not exists idx_businesses_city on businesses(city_id);
create index if not exists idx_businesses_category on businesses(category);
create index if not exists idx_business_reviews_business on business_reviews(business_id);
create index if not exists idx_business_reports_status on business_reports(status);

-- RLS
alter table businesses enable row level security;
alter table business_media enable row level security;
alter table business_services enable row level security;
alter table business_reviews enable row level security;
alter table business_documents enable row level security;

create policy "Public view approved businesses" on businesses
  for select using (status = 'APPROVED');

create policy "Public view business media" on business_media
  for select using (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'APPROVED')
  );

create policy "Public view published services" on business_services
  for select using (
    published = true and exists (
      select 1 from businesses b where b.id = business_id and b.status = 'APPROVED'
    )
  );

create policy "Public view approved reviews" on business_reviews
  for select using (approved = true);

create policy "Anyone insert review" on business_reviews for insert with check (true);
create policy "Anyone insert report" on business_reports for insert with check (true);
create policy "Anyone insert inquiry" on business_inquiries for insert with check (true);

-- Owner policies use service role from API routes; anon cannot mutate business data
