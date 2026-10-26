# Pocket Nurse

Contacts, daily tasks and familiar places for people living with dementia, managed by their caretakers.

Caretakers sign up with an email and create patient accounts. Patients log in with a username and see a simplified home screen.

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in its SQL Editor.
2. Copy `.env.example` to `.env.local` and fill in the keys.
3. `npm install`
4. `npm run dev`, then open <http://localhost:3000>.

`supabase/seed.sql` optionally fills one patient with sample data.

## Stack

Next.js (App Router), Supabase (Auth + Postgres with RLS), Tailwind CSS v4, shadcn/ui on Base UI, Leaflet.
