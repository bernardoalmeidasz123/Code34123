import express from "express";
import { v4 as uuid } from "uuid";
import { prisma } from "../services/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const router = express.Router();

router.post("/create", requireAuth, async (req, res) => {
  const { language, amountCents } = req.body;
  if (!language || !amountCents) return res.status(400).json({ message: "Missing fields" });
  const pixKey = process.env.PIX_KEY || "SUA_CHAVE_PIX_AQUI";
  const txid = uuid();
  const purchase = await prisma.languagePurchase.create({
    data: {
      userId: req.user.id,
      language: language.toUpperCase(),
      status: "PENDING",
      pixKey,
      pixQrCode: txid, // usamos campo existente para guardar o txid
      amountCents,
    },
  });
  res.json({ purchase: { ...purchase, txid, pixKey } });
});

router.post("/webhook", async (req, res) => {
  const { txid, status } = req.body;
  if (!txid) return res.status(400).json({ message: "Missing txid" });
  const purchase = await prisma.languagePurchase.findFirst({ where: { pixQrCode: txid } });
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
