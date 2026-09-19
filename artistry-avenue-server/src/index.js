import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import "./db/index.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import wishlistRoutes from "./routes/wishlist.js";
import orderRoutes from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

// Basic protection against brute-force on auth endpoints.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 });
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, service: "artistry-avenue-api" }));

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

// centralized error handler so unexpected errors return clean JSON
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong on our end." });
});

app.listen(PORT, () => {
  console.log(`Artistry Avenue API running on http://localhost:${PORT}`);
});
