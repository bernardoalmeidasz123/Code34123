import express from "express";
import { prisma } from "../services/prisma.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ users });
});

router.get("/purchases", async (_req, res) => {
  const purchases = await prisma.languagePurchase.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ purchases });
});

router.post("/language/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["PENDING", "CONFIRMED", "FAILED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const updated = await prisma.languagePurchase.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json({ purchase: updated });
});
