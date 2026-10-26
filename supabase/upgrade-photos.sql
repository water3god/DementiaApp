-- One-off upgrade for a database built from an older schema.sql. Adds photo
-- columns and the photos bucket, and drops the unused contacts.image_url.
-- Run once in the SQL Editor, then delete this file; fresh installs only
-- need schema.sql, which includes all of this.

alter table public.profiles add column if not exists photo_path text not null default '';
alter table public.contacts drop column if exists image_url;
alter table public.contacts add column if not exists photo_path text not null default '';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Patient and caretaker read photos" on storage.objects;
drop policy if exists "Caretaker uploads photos" on storage.objects;
drop policy if exists "Caretaker deletes photos" on storage.objects;

create policy "Patient and caretaker read photos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (storage.foldername(name))[1] in
        (select id::text from public.profiles where caretaker_id = (select auth.uid()))
    )
  );
create policy "Caretaker uploads photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] in
      (select id::text from public.profiles where caretaker_id = (select auth.uid()))
  );
create policy "Caretaker deletes photos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] in
      (select id::text from public.profiles where caretaker_id = (select auth.uid()))
  );
