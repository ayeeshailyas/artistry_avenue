import { Router } from "express";
import { db } from "../db/index.js";

const router = Router();

function parseProduct(row) {
  return {
    ...row,
    compareAt: row.compare_at,
    colors: JSON.parse(row.colors),
    details: JSON.parse(row.details),
    images: JSON.parse(row.images),
  };
}

router.get("/categories", (req, res) => {
  const rows = db.prepare("SELECT * FROM categories").all();
  res.json({ categories: rows });
});

router.get("/products", (req, res) => {
  const { category, search, sort } = req.query;
  let sql = "SELECT * FROM products";
  const clauses = [];
  const params = {};

  if (category && category !== "all") {
    clauses.push("category = @category");
    params.category = category;
  }
  if (search) {
    clauses.push("LOWER(name) LIKE @search");
    params.search = `%${String(search).toLowerCase()}%`;
  }
  if (clauses.length) sql += " WHERE " + clauses.join(" AND ");

  if (sort === "price-asc") sql += " ORDER BY price ASC";
  else if (sort === "price-desc") sql += " ORDER BY price DESC";
  else if (sort === "rating") sql += " ORDER BY rating DESC";

  const rows = db.prepare(sql).all(params);
  res.json({ products: rows.map(parseProduct) });
});

router.get("/products/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Product not found." });
  res.json({ product: parseProduct(row) });
});

router.get("/products/:id/related", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Product not found." });
  const related = db
    .prepare("SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4")
    .all(row.category, row.id);
  res.json({ products: related.map(parseProduct) });
});

export default router;
