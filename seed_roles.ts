import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding District and BRC users...");

  // Create a District
  const district = await prisma.district.upsert({
    where: { name: 'Test District' },
    update: {},
    create: {
      name: 'Test District',
    },
  });

  // Create a BRC
  let brc = await prisma.brc.findFirst({ where: { name: 'Test BRC' } });
  if (!brc) {
    brc = await prisma.brc.create({
      data: {
        name: 'Test BRC',
        districtId: district.id,
      },
    });
  }

  // Create District User
  const districtUser = await prisma.user.upsert({
    where: { username: 'district_admin' },
    update: {},
    create: {
      username: 'district_admin',
      passwordHash: 'password',
      role: 'DISTRICT',
      districtId: district.id,
    },
  });

  // Create BRC User
  const brcUser = await prisma.user.upsert({
    where: { username: 'brc_admin' },
    update: {},
    create: {
      username: 'brc_admin',
      passwordHash: 'password',
      role: 'BRC',
      brcId: brc.id,
    },
  });

  console.log("Seed completed. Additional users created:");
  console.log("-----------------------------------------");
  console.log(`District Login -> Username: ${districtUser.username} | Password: ${districtUser.passwordHash} | District: ${district.name}`);
  console.log(`BRC Login      -> Username: ${brcUser.username} | Password: ${brcUser.passwordHash} | BRC: ${brc.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
