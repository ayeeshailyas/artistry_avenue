# Artistry Avenue storefront

React 19 storefront for the Artistry Avenue stationery shop. It uses Vite, React Router, Tailwind CSS, Framer Motion, and the companion Express API in `../artistry-avenue-server` for catalog, account, wishlist, and order data.

## Development

```bash
npm install
npm run dev
```

The development server is available at `http://localhost:5173`. Start the API separately from `../artistry-avenue-server` (see the repository root README). Available scripts are `dev`, `build`, `preview`, and `lint`.

## Environment

Create a `.env` file in this directory when overriding defaults:

```text
VITE_API_URL=http://localhost:4000/api
VITE_WHATSAPP_NUMBER=
```

`VITE_API_URL` defaults to the local API URL shown above. Set `VITE_WHATSAPP_NUMBER` to the business number in international format with digits only (for example, Pakistan's `03...` number should be entered starting with `92`, without the leading `0`). Configure it in Vercel's Project Settings under Environment Variables for production and redeploy. It is included in the built storefront because WhatsApp links are generated in the browser, so it is not suitable for keeping the number secret from site visitors. Do not put server secrets in frontend environment variables.

## Source and assets

- `src/pages/` contains the storefront routes; `src/components/` contains shared UI.
- `src/context/` manages auth, cart, wishlist, and toast state.
- `src/lib/api.js` is the API client; `src/lib/format.js` formats prices in Pakistani Rupees.
- `public/stationery/` holds locally served product photography. Brand imagery is also in `public/`.

Checkout saves the order through the API before offering WhatsApp messaging. The supported payment methods are WhatsApp and Cash on Delivery; this frontend does not process online payments.
