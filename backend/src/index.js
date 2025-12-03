import dotenv from "dotenv";
import { app } from "./app.js";
import { prisma } from "./services/prisma.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
