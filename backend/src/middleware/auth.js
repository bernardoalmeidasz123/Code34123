import jwt from "jsonwebtoken";
import { prisma } from "../services/prisma.js";

const secret = process.env.JWT_SECRET || "dev-secret-change";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing token" });
  const [, token] = header.split(" ");
  try {
    const payload = jwt.verify(token, secret);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, secret, {
    expiresIn: "7d",
  });
}
