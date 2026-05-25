import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial state admin user...");
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: 'password', // Using plain text since auth.ts checks plain text
      role: 'STATE',
    },
  });

  console.log("Seed completed. Admin user created:");
  console.log({ username: admin.username, password: admin.passwordHash, role: admin.role });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
