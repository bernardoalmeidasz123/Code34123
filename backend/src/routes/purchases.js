import express from "express";
import { v4 as uuid } from "uuid";
import { prisma } from "../services/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const router = express.Router();

router.post("/create", requireAuth, async (req, res) => {
  const { language, amountCents } = req.body;
  if (!language || !amountCents) return res.status(400).json({ message: "Missing fields" });
  const pixKey = process.env.PIX_KEY || "032984620791";
  const purchase = await prisma.languagePurchase.create({
    data: {
      userId: req.user.id,
      language: language.toUpperCase(),
      status: "PENDING",
      pixKey,
      pixQrCode: `PIX|KEY=${pixKey}|TXID=${uuid()}`,
      amountCents,
    },
  });
  res.json({ purchase });
});

router.post("/webhook", async (req, res) => {
  // Stub: integrate with provider webhook to validate transaction status and txid
  const { txid, status } = req.body;
  if (!txid) return res.status(400).json({ message: "Missing txid" });
  const purchase = await prisma.languagePurchase.findFirst({ where: { pixQrCode: { contains: txid } } });
  if (!purchase) return res.status(404).json({ message: "Purchase not found" });
  const updated = await prisma.languagePurchase.update({
    where: { id: purchase.id },
    data: { status: status === "CONFIRMED" ? "CONFIRMED" : "FAILED" },
  });
  res.json({ ok: true, purchase: updated });
});

router.get("/mine", requireAuth, async (req, res) => {
  const purchases = await prisma.languagePurchase.findMany({ where: { userId: req.user.id } });
  res.json({ purchases });
});
