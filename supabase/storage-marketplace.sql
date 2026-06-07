-- Supabase Storage buckets for Business Marketplace
-- Run in Supabase Dashboard → SQL Editor after marketplace.sql

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'business-media',
    'business-media',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
  ),
  (
    'business-documents',
    'business-documents',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  )
on conflict (id) do nothing;

-- Public read for media bucket
create policy "Public read business media"
  on storage.objects for select
  using (bucket_id = 'business-media');

-- Owners upload via authenticated API (service role); optional owner JWT policy:
create policy "Authenticated upload business media"
  on storage.objects for insert
  with check (bucket_id = 'business-media' and auth.role() = 'authenticated');

create policy "Service role full business media"
  on storage.objects for all
  using (bucket_id in ('business-media', 'business-documents'))
  with check (bucket_id in ('business-media', 'business-documents'));
