# Artistry Avenue

Artistry Avenue is a stationery e-commerce site with a React storefront and a Node.js/Express API backed by SQLite. Customers can browse the locally hosted product catalog, create an account, save a wishlist, and place orders using Cash on Delivery or WhatsApp.

## Project layout

```text
artistry-avenue/          React 19 storefront (Vite, React Router, Tailwind CSS)
  public/stationery/       Product photography served by the frontend
  src/                     Pages, components, contexts, and API client
artistry-avenue-server/   Express 5 API and SQLite database
  src/db/                  Schema and catalog seed data
  src/routes/              Authentication, products, wishlist, and orders
```

## Run locally

Use Node.js and npm. Start the API and storefront in separate terminals.

```bash
# Terminal 1: API
cd artistry-avenue-server
npm install
npm run seed
npm run dev
```

```bash
# Terminal 2: storefront
cd artistry-avenue
npm install
npm run dev
```

The storefront runs at `http://localhost:5173`; the API defaults to `http://localhost:4000` and exposes a health check at `/api/health`. The frontend API URL can be set with `VITE_API_URL` (default: `http://localhost:4000/api`). Set `VITE_WHATSAPP_NUMBER` in the local or deployment environment to configure WhatsApp order messages; it is not committed to the repository.

The server accepts `PORT`, `CLIENT_ORIGIN`, `JWT_SECRET`, and `DB_PATH`. `DB_PATH` defaults to `artistry-avenue-server/data/artistry_avenue.db`. Set a strong, private `JWT_SECRET` and configure `CLIENT_ORIGIN` for the deployed storefront before deployment. The frontend includes a Vercel rewrite for client-side routes; deploy the API separately and point `VITE_API_URL` at it.

## Store behavior

- Product and category data are served by the API. The catalog is defined in `artistry-avenue-server/src/db/seed.js`; `npm run seed` inserts or replaces those records.
- Product images are local files under `artistry-avenue/public/stationery/`, with storefront assets such as the hero and logo under `public/`.
- Accounts use bcrypt password hashes and JWT tokens. The browser stores the session token in local storage.
- Wishlists and orders are stored in SQLite per account. A guest can check out; authenticated orders are attached to the account.
- The cart is stored in browser local storage, with separate cart keys for guests and signed-in users.
- Checkout offers WhatsApp or Cash on Delivery. In both cases the order is created in the database first and stock is checked and reserved at order creation. WhatsApp then opens a prefilled message; it does not process payment.
- Currency display is Pakistani Rupees and is formatted in `artistry-avenue/src/lib/format.js`.

## Main routes

The storefront includes home, shop/category, product detail, cart, wishlist, checkout, order confirmation, login, signup, account, about, and contact pages. The API provides `/api/auth`, `/api/products`, `/api/categories`, `/api/wishlist`, `/api/orders`, and `/api/health` endpoints. See `artistry-avenue/src/lib/api.js` and `artistry-avenue-server/src/routes/` for the current request and response details.

## Deployment notes

- Configure the frontend's `VITE_API_URL` and `VITE_WHATSAPP_NUMBER` in its deployment environment.
- Configure the server's `CLIENT_ORIGIN` and `JWT_SECRET`; keep secrets out of source control.
- Persist the SQLite data directory when deploying the server. The Vercel configuration in the frontend handles SPA route rewrites only; it does not deploy the API.
