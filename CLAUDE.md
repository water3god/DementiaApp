# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

Next.js 16.3, React 19.2, TypeScript, Tailwind CSS v4, Supabase. Two roles: caretakers (email sign-up, manage patients at `/caretaker_view`) and patients (username login, created by a caretaker, home at `/home`). The database schema and RLS policies live in `supabase/schema.sql`. There is no test setup.

## Commands

- `npm run dev` — dev server at `http://localhost:3000` (also regenerates the `AGENTS.md` block and `.next/types`)
- `npm run build` — production build (also type-checks)
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — type-check only

There is no test runner configured.

## Architecture notes

- **App Router only** — routes live in `app/`. `app/layout.tsx` is the root layout; it loads Geist fonts via `next/font/google` and exposes them as the CSS variables `--font-geist-sans` / `--font-geist-mono`.
- **Typed route helpers**: layouts/pages use the global `LayoutProps<"/">` / `PageProps<...>` types generated into `.next/types` by `next dev`/`next build`. If these types are missing, run the dev server or a build once.
- **Tailwind v4** is configured CSS-first: there is no `tailwind.config.*`. Theme tokens are declared with `@theme inline` in `app/globals.css`. PostCSS uses `@tailwindcss/postcss`.
- **Data flow**: reads live in `lib/data/*` (server, RLS-scoped); writes are server actions in `app/actions/*` returning `ActionResult` from `lib/formData.ts`. Patient account management uses the admin client (`lib/supabase/admin.ts`, needs `SUPABASE_SECRET_KEY`).
- **Photos**: private `photos` storage bucket, objects under `<patientId>/`. Rows store `photo_path`; reads sign URLs via `lib/photos.ts`.
- **Import alias**: `@/*` resolves to the repo root (e.g. `@/app/...`).
- Next.js docs matching the installed version are in `node_modules/next/dist/docs/` (`01-app`, `02-pages`, `03-architecture`) — consult them before using Next APIs, since this version differs from older conventions.
