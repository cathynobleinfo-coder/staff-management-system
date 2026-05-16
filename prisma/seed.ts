import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.extension.deleteMany();
  await prisma.salaryRecord.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();
  await prisma.brc.deleteMany();
  await prisma.district.deleteMany();

  console.log('Seeding districts...');
  const tvm = await prisma.district.create({
    data: { name: 'Thiruvananthapuram' }
  });

  const klm = await prisma.district.create({
    data: { name: 'Kollam' }
  });

  console.log('Seeding BRCs...');
  const brcNorth = await prisma.brc.create({
    data: { name: 'BRC Trivandrum North', districtId: tvm.id }
  });

  const brcSouth = await prisma.brc.create({
    data: { name: 'BRC Trivandrum South', districtId: tvm.id }
  });

  const brcAttingal = await prisma.brc.create({
    data: { name: 'BRC Attingal', districtId: tvm.id }
  });

  console.log('Seeding Staff...');
  await prisma.staff.createMany({
    data: [
      { empId: 'EMP001', name: 'Anila', category: 'DEPUTATION', status: 'ACTIVE', brcId: brcNorth.id, districtId: tvm.id },
      { empId: 'EMP002', name: 'Achu', category: 'CONTRACT', status: 'ACTIVE', brcId: brcNorth.id, districtId: tvm.id },
      { empId: 'EMP003', name: 'Amal', category: 'DAILY', status: 'INACTIVE', brcId: brcSouth.id, districtId: tvm.id },
      { empId: 'EMP004', name: 'Sreejith', category: 'SERVICE', status: 'ACTIVE', brcId: brcAttingal.id, districtId: tvm.id },
    ]
  });

  console.log('Seeding Users...');
  // Password hash for 'password123' (simplified for prototyping, usually you'd use bcrypt)
  // For local prototype without bcrypt, we can just store plain text or simple hash, 
  // but let's just mock simple string match since it's a prototype.
  const passwordHash = 'password123'; 

  await prisma.user.createMany({
    data: [
      { username: 'stateadmin', passwordHash, role: 'STATE' },
      { username: 'district_tvm', passwordHash, role: 'DISTRICT', districtId: tvm.id },
      { username: 'brc_north', passwordHash, role: 'BRC', brcId: brcNorth.id, districtId: tvm.id },
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
