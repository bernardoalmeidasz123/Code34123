import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as authRouter } from "./routes/auth.js";
import { router as exerciseRouter } from "./routes/exercises.js";
import { router as purchaseRouter } from "./routes/purchases.js";
import { router as adminRouter } from "./routes/admin.js";
import { router as healthRouter } from "./routes/health.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/exercises", exerciseRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/admin", adminRouter);

// basic 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

export { app };
