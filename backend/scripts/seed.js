import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { prisma } from "../src/services/prisma.js";

dotenv.config();

const languages = ["PYTHON", "JAVASCRIPT", "CSHARP", "JAVA", "PHP", "DART"];

function buildExercises() {
  const items = [];
  for (let i = 1; i <= 34; i++) {
    items.push({
      title: `Lógica #${i}`,
      slug: `logica-${i}`,
      content: `Resolva o exercício de lógica ${i}.`,
      order: i,
      isFree: true,
    });
  }
  languages.forEach((lang) => {
    for (let i = 1; i <= 34; i++) {
      items.push({
        title: `${lang} #${i}`,
        slug: `${lang.toLowerCase()}-${i}`,
        content: `Resolva o exercício ${i} na linguagem ${lang}.`,
        order: i,
        language: lang,
        starterCode: "// seu código aqui",
        tests: { cases: [{ input: "", output: "" }] },
        isFree: false,
      });
    }
  });
  return items;
}

async function main() {
  console.log("Seeding database...");
  const items = buildExercises();

  for (const ex of items) {
    await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: {},
      create: ex,
    });
  }

  // admin with all languages unlocked
  const adminEmail = "bernardoalmeida01031981@gmail.com";
  const adminPassword = "Bs01032012";
  const hash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: hash, role: "ADMIN", name: "Admin Bernardo" },
  });

  for (const lang of languages) {
    await prisma.languagePurchase.upsert({
      where: { id: `${admin.id}-${lang}` },
      update: {},
      create: {
        id: `${admin.id}-${lang}`,
        userId: admin.id,
        language: lang,
        status: "CONFIRMED",
        pixKey: process.env.PIX_KEY || "DEFINE_PIX_KEY",
        pixQrCode: "ADMIN-GRANT",
        amountCents: 0,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
