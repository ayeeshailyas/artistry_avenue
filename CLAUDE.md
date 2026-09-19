# Artistry Avenue — Project System Prompt

Paste this file into your project root as `CLAUDE.md` (Claude Code),
`.cursorrules` (Cursor), or your tool's equivalent "system prompt" /
"project instructions" file. It gives any AI assistant working on this
codebase the context it needs to make consistent, correct changes.

---

## What this project is

Artistry Avenue is a full-stack e-commerce site for a light-themed, luxury
stationery brand ("sparkle stationery" — journals, fine writing, cards,
desk objects). It is a **real** application, not a prototype:

- Real backend with a database, not mock/localStorage data.
- Real authentication (bcrypt password hashing + JWT), not fake sessions.
- Real orders persisted server-side, not simulated checkouts.
- **No payment gateway.** Checkout is Cash on Delivery or WhatsApp
  ordering only. Do not add Stripe/PayPal/etc. unless explicitly asked.

## Repo structure

```
artistry-avenue/          React frontend (Vite + Tailwind + Framer Motion)
  src/
    components/           Shared UI: Navbar, Footer, CartDrawer, ProductCard,
                           WhatsAppButton, ProtectedRoute, PageTransition
    pages/                One file per route (Home, Shop, ProductDetail,
                           Cart, Wishlist, Checkout, OrderConfirmation,
                           Login, Signup, Account, About, Contact, NotFound)
    context/               AuthContext, CartContext, WishlistContext, ToastContext
    lib/
      api.js               Single fetch client — ALL backend calls go through this
      format.js             formatPrice() — the only place currency is formatted
  .env                     VITE_API_URL, VITE_WHATSAPP_NUMBER

artistry-avenue-server/   Node.js/Express backend
  src/
    db/
      index.js             SQLite schema (better-sqlite3)
      seed.js               Product/category seed data — edit THIS to change catalog
    middleware/auth.js       JWT sign/verify, requireAuth, optionalAuth
    routes/                 auth.js, products.js, wishlist.js, orders.js
    index.js                 Express app entry point
  .env                     PORT, CLIENT_ORIGIN, JWT_SECRET, CURRENCY, DB_PATH
```

## Tech stack

- **Frontend:** React 19, Vite, React Router v6, Tailwind CSS, Framer
  Motion (page/element transitions), lucide-react (icons).
- **Backend:** Node.js, Express 5, better-sqlite3 (SQLite), bcryptjs, jsonwebtoken,
  zod (request validation), express-rate-limit, cors, morgan.
- **No ORM.** Raw SQL via prepared statements in `better-sqlite3`. Keep it
  that way unless asked to migrate to Postgres/Prisma/etc.

## Design system (do not deviate without being asked)

- **Palette:** `paper` (#FBF6F1, background), `wine` (#5C1420, primary —
  taken from the brand logo), `gold` (#B08A4E, accent), `plum` (#2B1B1D,
  text), `blush`/`paper-dim` (secondary panels), `hairline` (#E4D6CC,
  borders/dividers).
- **Type:** `font-display` = Fraunces (serif, headlines), `font-body` =
  Jost (sans, body/UI). Both loaded via Google Fonts in `index.css`.
- **Signature motif:** the dashed "seal ring" (`.seal-ring` class) echoing
  the brand's wax-seal logo — used for empty states, not decoration.
- **Motion:** page transitions via `<PageTransition>` wrapper
  (fade + rise, `ease: [0.22, 1, 0.36, 1]`). Hover states are subtle
  (scale ~1.03–1.06, 300–700ms). Don't add motion for its own sake.
- **Layout:** generous whitespace, `rounded-soft` (4px) on images/cards —
  not the rounded-xl SaaS look. Pill buttons (`rounded-pill`) for CTAs.

## Key business rules — read before touching checkout/auth/wishlist

1. **Checkout has exactly two payment methods:** `"whatsapp"` and `"cod"`.
   The `orders.payment_method` DB constraint and the zod schema in
   `routes/orders.js` both enforce this — update both together if this
   ever changes, and only if explicitly requested.
2. **WhatsApp checkout flow:** order is saved to the DB first (so there's
   always a record), *then* `wa.me` opens with a pre-filled message built
   from the saved order. Never open WhatsApp before the order is saved.
3. **Wishlist requires a signed-in account** — it's stored server-side per
   user (`wishlist` table), not per browser. Guests attempting to
   wishlist are redirected to `/login`. Don't silently no-op this.
4. **Cart is intentionally client-side** (localStorage, scoped by user id
   in `CartContext`) until the moment of checkout, when it becomes a real
   order via `POST /api/orders`. This is standard practice, not a mock —
   don't "fix" it by moving cart state server-side unless asked.
5. **Stock is decremented at order creation** for both payment methods
   (no separate payment-confirmation step exists since there's no
   gateway). `routes/orders.js` validates stock before committing.
6. **WhatsApp number** is read from `VITE_WHATSAPP_NUMBER` via the single
   helper `whatsAppLink()` in `components/WhatsAppButton.jsx`. Never
   hardcode a `wa.me/...` URL elsewhere — import the helper instead.

## API contract (frontend must only talk to the backend through `src/lib/api.js`)

```
POST   /api/auth/register        { name, email, password, phone? }
POST   /api/auth/login           { email, password }
GET    /api/auth/me              (auth)
PATCH  /api/auth/me              (auth) { name?, phone? }

GET    /api/categories
GET    /api/products             ?category=&search=&sort=(price-asc|price-desc|rating)
GET    /api/products/:id
GET    /api/products/:id/related

GET    /api/wishlist             (auth)
POST   /api/wishlist/:productId  (auth)
DELETE /api/wishlist/:productId  (auth)

POST   /api/orders               { items[], fullName, email, phone, address,
                                    city, postalCode?, notes?, paymentMethod }
GET    /api/orders               (auth) — current user's order history
GET    /api/orders/:id           (auth if order has an owner)
```

`(auth)` = requires `Authorization: Bearer <jwt>`. The `api.js` client
attaches this automatically from `localStorage` when `auth: true` is
passed to a request and a token exists — it does not hard-require login,
so guest checkout still works for `/api/orders`.

## Conventions to follow

- Currency is Pakistani Rupees. Always format via `formatPrice()` from
  `lib/format.js` — never inline `Rs ${...}` or `$`.
- Prices are stored/passed as plain integers (rupees, not paisa/cents).
- All new pages get wrapped in `<PageTransition>` and use the existing
  Tailwind token names (`wine`, `plum`, `stone`, `hairline`, etc.) —
  don't introduce new ad hoc colors.
- New backend routes: validate input with `zod`, use prepared statements,
  return `{ error: "human-readable message" }` on failure with an
  appropriate status code (the global error handler in `index.js` expects this shape).
- Don't add a payment gateway, a second cart backend, or a generic
  "mock" fallback for auth/orders/wishlist — this project deliberately
  has none of those; keep it that way unless the user asks.

## Environment variables

**`artistry-avenue/.env`**
```
VITE_API_URL=http://localhost:4000/api
VITE_WHATSAPP_NUMBER=923001234567   # digits only, international format
```

**`artistry-avenue-server/.env`**
```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=<long random string>     # openssl rand -hex 32
CURRENCY=pkr
DB_PATH=./data/artistry_avenue.db
```

## Running the project

```bash
# Backend
cd artistry-avenue-server && npm install && npm run seed && npm run dev

# Frontend (separate terminal)
cd artistry-avenue && npm install && npm run dev
```
