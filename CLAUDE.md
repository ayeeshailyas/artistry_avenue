# Artistry Avenue — Project Instructions

Use this file as project context for AI coding assistants. Keep documentation aligned with the implementation when behavior, routes, configuration, or design tokens change.

## Project overview

Artistry Avenue is a stationery storefront with a React frontend and a real Express/SQLite backend. Catalog, account, wishlist, and order data are backed by the API. There is no payment gateway: checkout supports Cash on Delivery (`cod`) and WhatsApp (`whatsapp`) only.

## Repository structure

```text
artistry-avenue/
  public/                   Logo, hero artwork, and local stationery product images
  src/components/           Shared navigation, product cards, cart drawer, transitions, etc.
  src/pages/                Home, shop, product, cart, wishlist, checkout, account, and content pages
  src/context/              Auth, cart, wishlist, and toast state
  src/lib/api.js            Frontend API client; route all backend calls through it
  src/lib/format.js         Pakistani Rupee formatting helper

artistry-avenue-server/
  src/db/index.js           SQLite schema and database initialization
  src/db/seed.js            Categories and product catalog
  src/middleware/auth.js    JWT authentication middleware
  src/routes/               Auth, product, wishlist, and order endpoints
  src/index.js              Express application entry point
```

## Stack and design

- Frontend: React 19, Vite, React Router 7, Tailwind CSS, Framer Motion, and lucide-react.
- Backend: Node.js, Express 5, better-sqlite3, bcryptjs, jsonwebtoken, zod, express-rate-limit, cors, and morgan. SQL is prepared directly with better-sqlite3; there is no ORM.
- Brand colors are defined in `artistry-avenue/tailwind.config.js`: paper, blush, wine, plum, gold, hairline, and stone. Keep using these tokens rather than adding arbitrary colors.
- Typography is Playfair Display (`font-display`) and Outfit (`font-body`), loaded in `src/index.css`.
- Keep the storefront's spacious, paper-toned layout, small corner radii, pill CTAs, and restrained transitions. Pages use the shared `PageTransition` component.
- Product and category photographs are local assets in `artistry-avenue/public/stationery/`; use these paths when updating catalog seed data rather than assuming remote stock photos.

## Business rules

1. Checkout payment methods are exactly `whatsapp` and `cod`; the SQLite check constraint and Zod validation in the order route must stay in sync if an authorized change adds another method.
2. Create and persist an order before opening WhatsApp. WhatsApp is a prefilled customer message, not payment processing.
3. Stock is validated and decremented as part of order creation for either payment method.
4. Wishlist data is account-backed. Guests who try to save a product should be sent through the sign-in flow; do not silently discard the action.
5. Cart data remains client-side in local storage, using separate keys for guests and signed-in users, until checkout creates a server-side order.
6. Use `whatsAppLink()` from `src/components/WhatsAppButton.jsx` for WhatsApp links. Read the number from `VITE_WHATSAPP_NUMBER`; do not hardcode `wa.me` URLs elsewhere.
7. Format prices with `formatPrice()` from `src/lib/format.js`. Prices are integer Pakistani Rupees.

## API and persistence conventions

The frontend API client is `artistry-avenue/src/lib/api.js`. Keep fetch calls there so API configuration, errors, and authorization headers have one implementation. Current API groups are:

- Auth: register, login, current user (`GET /api/auth/me`), and profile update (`PATCH /api/auth/me`).
- Catalog: `GET /api/categories`, `GET /api/products` (category/search/sort filters), product detail, and related products.
- Wishlist: list/add/remove; all require authentication.
- Orders: create, list the signed-in user's history, and retrieve an order. Guest order creation is supported; requests may include an auth token when present.
- Health: `GET /api/health`.

Validate new write-route input with Zod, use prepared SQL statements, and return readable `{ error: "..." }` JSON errors with suitable HTTP status codes. Update both frontend and server contracts when endpoint payloads change.

## Configuration and local development

Frontend environment:

```text
VITE_API_URL=http://localhost:4000/api
VITE_WHATSAPP_NUMBER=<set privately in local .env / Vercel>
```

Server environment:

```text
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=<strong random secret>
DB_PATH=./data/artistry_avenue.db
```

The frontend uses `http://localhost:4000/api` directly in Vite development mode. Production uses `VITE_API_URL` when set and otherwise falls back to `https://artistryavenue-production.up.railway.app/api`. The server defaults to port 4000 and a database file under `artistry-avenue-server/data/`. Use a private strong JWT secret and set the deployed storefront origin in `CLIENT_ORIGIN`. The frontend's `vercel.json` only provides SPA route rewrites; it does not host the API.

Run the backend with `cd artistry-avenue-server && npm install && npm run seed && npm run dev`. Run the storefront separately with `cd artistry-avenue && npm install && npm run dev`. Edit catalog entries in `src/db/seed.js` and rerun the seed command to apply them.
