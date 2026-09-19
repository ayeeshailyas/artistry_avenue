# Artistry Avenue — Sparkle Stationery

A full-stack e-commerce site for the Artistry Avenue stationery brand: a
React frontend and a real Node.js/Express + SQLite backend. No mock data,
no payment gateway — checkout is Cash on Delivery or WhatsApp, both backed
by real orders saved in a database.

## Structure

```
artistry-avenue/          → React frontend (Vite, Tailwind, Framer Motion)
artistry-avenue-server/   → Node.js/Express backend (SQLite, JWT auth)
```

## Quick start

You need two terminals — one for the backend, one for the frontend.

### 1. Backend

```bash
cd artistry-avenue-server
npm install
cp .env.example .env       # edit JWT_SECRET before going live
npm run seed                # creates the SQLite database and loads products
npm run dev                  # starts the API on http://localhost:4000
```

### 2. Frontend

```bash
cd artistry-avenue
npm install
cp .env.example .env        # points at the backend + your WhatsApp number
npm run dev                  # starts the site on http://localhost:5173
```

Open http://localhost:5173 — the site talks to the real backend for
products, accounts, wishlist and orders.

## Before you launch

- **`artistry-avenue-server/.env`** — set a strong random `JWT_SECRET`
  (e.g. `openssl rand -hex 32`), and update `CLIENT_ORIGIN` to your real
  frontend URL.
- **`artistry-avenue/.env`** — set `VITE_API_URL` to your deployed backend,
  and `VITE_WHATSAPP_NUMBER` to the studio's real WhatsApp Business number
  (international format, digits only, e.g. `923001234567`).
- **Product photos** — the catalog currently uses stock photography from
  Unsplash as placeholders. Swap the `images` arrays in
  `artistry-avenue-server/src/db/seed.js` for your own product photos, then
  re-run `npm run seed`.
- **Logo & socials** — the logo lives at `artistry-avenue/public/logo.png`.
  Footer social links are placeholders (`#`) — point them at your real
  Instagram/Facebook pages.

## How ordering works

There's no payment gateway. At checkout, a customer chooses:

- **Order via WhatsApp** (default/recommended) — the order is saved to the
  database first (so you have a record), then WhatsApp opens in a new tab
  with the order pre-filled as a message. The customer just hits send, and
  you confirm payment/availability with them directly.
- **Cash on Delivery** — the order is saved with `payment_method: "cod"`
  and stock is reserved immediately. Payment happens in person on delivery.

Every order is stored in the `orders` / `order_items` tables regardless of
which path is chosen, and appears in the signed-in customer's **Account →
Order History**.

## Tech notes

- **Auth**: real bcrypt password hashing + JWT sessions (7-day expiry),
  not stored in plaintext or localStorage.
- **Database**: SQLite via `better-sqlite3` — a single file at
  `artistry-avenue-server/data/artistry_avenue.db`. Fine for a small-to-
  medium store; swap for Postgres/MySQL later if you outgrow it (the SQL
  is close to standard and lives entirely in `src/db` and `src/routes`).
- **Wishlist**: persisted server-side per account, not per browser.
- **Cart**: kept client-side (localStorage) until checkout, which is
  standard practice for e-commerce — it becomes a real, saved order only
  once the customer checks out.
