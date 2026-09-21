# Superior Concrete Works — website

Next.js 16 + Supabase. Public store (products, cart, checkout, quote form, gallery) and an owner admin at `/admin`.
Prices are in TTD only. Orders and quote requests are saved to the database, then sent on to the business on WhatsApp by the customer (nothing is sent automatically, nothing is charged online).

## 1. Put it on GitHub, then Vercel

```bash
cd superior-concrete-works
git init
git add .
git commit -m "Superior Concrete Works website"
git branch -M main
git remote add origin https://github.com/YOUR-USER/superior-concrete-works.git
git push -u origin main
```

In Vercel: **Add New → Project → import the repo**. Framework is detected automatically. Before deploying, add these environment variables:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://seehwxwutjekixifrspo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_bRi5XgguV6LimaVnEqByeQ_-Ob2Pvg5` (public key, safe in the browser) |
| `NEXT_PUBLIC_SITE_URL` | your real address, e.g. `https://superiorconcreteworks.com` (no trailing slash) |
| `NEXT_PUBLIC_SHOW_DEMO_PRICE_BADGE` | `true` until real prices are in, then `false` |

Deploy. When you have a domain, add it in Vercel (Settings → Domains) and update `NEXT_PUBLIC_SITE_URL`, then redeploy.

## 2. Give the owner an admin login

1. Supabase dashboard → **Authentication → Users → Add user** (email + password).
2. Open the site at `/admin` and sign in. It will say the account is not an admin yet and show one line of SQL.
3. Paste that line into **Supabase → SQL Editor → Run**. Refresh `/admin`.

In the admin the owner can add and edit products (with photo upload), set prices, see orders and quote requests, change their status, reply on WhatsApp, and manage the gallery. Changes show on the public site within about a minute.

## 3. Before going public

- **Demo prices.** The 6 starter products are flagged as demo with sample prices. In `/admin/products` set the real price (leave it blank for "Request a quote"), untick "Demo listing", or delete the product. Then set `NEXT_PUBLIC_SHOW_DEMO_PRICE_BADGE=false`.
- **Photos.** Product tiles use drawn placeholders until a photo is uploaded. The baluster studio image is marked "illustrative".
- **Privacy Policy and Terms** (`/privacy`, `/terms`) are plain factual drafts of what this site does. Have the business owner (or a lawyer) review them.
- **Google Search Console.** Submit `/sitemap.xml` once the domain is live.

## 4. Hero video (optional)

Add `public/hero/hero.mp4` and `public/hero/hero-poster.jpg` (see `public/hero/README.txt`) and redeploy. Without them the hero shows the drawn balustrade backdrop.

## 5. Scroll animation (mold opens, baluster revealed)

The frames live in `public/scrub/desk` (full frame) and `public/scrub/mob` (centre crop for phones). To use a different video:

```bash
bash scripts/extract-frames.sh path/to/new-video.mp4   # needs ffmpeg
```

If the frame count is not 108, change `FRAME_COUNT` at the top of `src/components/MoldScrub.tsx`. Keep the subject in the middle third of the video so it works on phones.

## Where things are

- `src/lib/config.ts` — business details, categories, currency note (one place to edit phone, links, copy).
- `supabase/schema.sql` — the whole database (already applied to the project above).
- `src/app/globals.css` — the design system (colour, type, spacing, buttons).
- `src/components/` — sections and UI. `src/app/` — pages. `src/app/admin/` — owner area.

Local development: `npm install`, copy `.env.example` to `.env.local`, then `npm run dev`.

## Security notes

- The database is protected by Row Level Security. The public can read visible products and the gallery, submit quote requests, and place orders through one database function that reads prices from the products table (never from the browser). Only admin users can read orders and quote requests or edit anything.
- Supabase will list two advisories for `place_order` and `is_admin` being callable by the public. Both are intended: the first is the checkout, the second returns only whether the current visitor is an admin.
