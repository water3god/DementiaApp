-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Every row belongs to one user; RLS makes each user see only their own rows.

create table public.contacts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  full_name text not null,
  relationship text not null,
  contact_group text not null check (contact_group in ('family', 'friends', 'care')),
  about text not null default '',
  schedule text not null default '',
  phone text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create table public.tasks (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.places (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  description text not null default '',
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  created_at timestamptz not null default now()
);

create index contacts_user_id_idx on public.contacts (user_id);
create index tasks_user_id_idx on public.tasks (user_id);
create index places_user_id_idx on public.places (user_id);

-- New tables aren't exposed to the Data API automatically; grant signed-in
-- users access (RLS below still limits them to their own rows). No anon access.
grant select, insert, update, delete on public.contacts, public.tasks, public.places to authenticated;
revoke all on public.contacts, public.tasks, public.places from anon;

alter table public.contacts enable row level security;
alter table public.tasks enable row level security;
alter table public.places enable row level security;

create policy "Users read own contacts" on public.contacts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users add own contacts" on public.contacts for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own contacts" on public.contacts for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete own contacts" on public.contacts for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users read own tasks" on public.tasks for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users add own tasks" on public.tasks for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own tasks" on public.tasks for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete own tasks" on public.tasks for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users read own places" on public.places for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users add own places" on public.places for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own places" on public.places for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete own places" on public.places for delete to authenticated
  using ((select auth.uid()) = user_id);
