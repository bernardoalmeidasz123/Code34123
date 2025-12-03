import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../services/prisma.js";
import { signToken } from "../middleware/auth.js";

export const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: "USER" },
  });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

router.post("/forgot", async (req, res) => {
  // Stub endpoint; integrate email provider later.
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  res.json({ message: "If the account exists, password reset instructions were sent." });
});

export default router;
