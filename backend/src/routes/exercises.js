import express from "express";
import { prisma } from "../services/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const router = express.Router();

router.get("/free", async (_req, res) => {
  const exercises = await prisma.exercise.findMany({
    where: { isFree: true },
    orderBy: { order: "asc" },
  });
  res.json({ exercises });
});

router.get("/language/:code", requireAuth, async (req, res) => {
  const code = req.params.code.toUpperCase();
  const hasPurchase = await prisma.languagePurchase.findFirst({
    where: { userId: req.user.id, language: code, status: "CONFIRMED" },
  });
  if (!hasPurchase) return res.status(402).json({ message: "Language locked" });
  const exercises = await prisma.exercise.findMany({
    where: { language: code },
    orderBy: { order: "asc" },
  });
  res.json({ exercises });
});

router.get("/progress/:code", requireAuth, async (req, res) => {
  const code = req.params.code.toUpperCase();
  const runs = await prisma.exerciseRun.findMany({
    where: { userId: req.user.id, exercise: { language: code } },
  });
  const passed = runs.filter((r) => r.status === "PASSED").length;
  res.json({ passed, total: 34, xp: runs.reduce((a, r) => a + (r.xpAwarded || 0), 0) });
});

router.post("/:id/submit", requireAuth, async (req, res) => {
  const { code, output, passed } = req.body;
  const exerciseId = req.params.id;
  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return res.status(404).json({ message: "Exercise not found" });

  const xpAwarded = passed ? 10 : 0;
  const run = await prisma.exerciseRun.create({
    data: {
      userId: req.user.id,
      exerciseId,
      code: code || "",
      output: output || "",
      status: passed ? "PASSED" : "FAILED",
      xpAwarded,
    },
  });
  res.json({ run, certificate: passed ? await maybeIssueCertificate(req.user.id, exercise.language) : null });
});

async function maybeIssueCertificate(userId, language) {
  if (!language) return null;
  const total = await prisma.exercise.count({ where: { language } });
  const passed = await prisma.exerciseRun.count({
    where: { userId, status: "PASSED", exercise: { language } },
  });
  if (passed >= total && total > 0) {
    return { message: "Certificate ready", language };
  }
  return null;
}
