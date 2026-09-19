import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "../db/index.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password should be at least 6 characters."),
  phone: z.string().trim().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone };
}

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { name, email, password, phone } = parsed.data;

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    id: `u_${randomUUID()}`,
    name,
    email: email.toLowerCase(),
    password_hash: passwordHash,
    phone: phone || null,
  };

  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, phone) VALUES (@id, @name, @email, @password_hash, @phone)"
  ).run(user);

  const token = signToken(user);
  res.status(201).json({ token, user: publicUser({ ...user, phone: user.phone }) });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "That email and password don't match our records." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "That email and password don't match our records." });
  }

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  if (!user) return res.status(404).json({ error: "Account not found." });
  res.json({ user: publicUser(user) });
});

router.patch("/me", requireAuth, (req, res) => {
  const patch = z
    .object({ name: z.string().trim().min(2).optional(), phone: z.string().trim().optional() })
    .safeParse(req.body);
  if (!patch.success) {
    return res.status(400).json({ error: patch.error.issues[0].message });
  }
  const fields = patch.data;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  if (!user) return res.status(404).json({ error: "Account not found." });

  const updated = { ...user, ...fields };
  db.prepare("UPDATE users SET name = @name, phone = @phone WHERE id = @id").run(updated);
  res.json({ user: publicUser(updated) });
});

export default router;
