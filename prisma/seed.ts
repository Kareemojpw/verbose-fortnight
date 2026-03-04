import { PrismaClient } from '@prisma/client';
import domains from '../lib/domains.json';

const prisma = new PrismaClient();

async function main() {
  for (const name of domains) {
    await prisma.domain.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true }
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
