import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      slug: "faire-la-sesive",
      title: "Faire la lessive",
      markdown:
        "Je me none **SORO MOISE** je prevoit *faire la lessive* ".trim(),
    },
    {
      slug: "epargner-de-l_argent",
      title: "Epargner de l'argent",
      markdown:
        "je (**SORO**) doit éparger de l'argent pour mieux *investire*".trim(),
    },
    {
      slug: "achetter-des-chaussures",
      title: "Achetter des chaussures",
      markdown:
        "Il me faut achetter des **chaussures** le *mois prochain*".trim(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
