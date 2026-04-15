import { prisma } from '../lib/prisma';

async function main() {
  // Check province levels for major cities
  const provinces = await prisma.province.findMany({
    where: { name: { contains: 'Hà Nội' } },
    select: { id: true, name: true, level: true },
  });
  console.log('=== Provinces matching "Hà Nội" ===');
  console.log(JSON.stringify(provinces, null, 2));

  // Check all 2-level provinces
  const provinces2 = await prisma.province.findMany({
    where: { level: '2-level' },
    select: { id: true, name: true },
    take: 10,
  });
  console.log('\n=== First 10 2-level provinces ===');
  console.log(JSON.stringify(provinces2, null, 2));

  // Check ward count for a 2-level province
  if (provinces.length > 0) {
    const prov2 = provinces.find(p => p.level === '2-level');
    if (prov2) {
      const wardCount = await prisma.ward.count({
        where: { provinceId: prov2.id, level: '2-level' },
      });
      console.log(`\n=== Ward count for ${prov2.name} (2-level, id=${prov2.id}) === ${wardCount}`);
    }
    const prov3 = provinces.find(p => p.level === '3-level');
    if (prov3) {
      const wardCount = await prisma.ward.count({
        where: { provinceId: prov3.id, level: '3-level' },
      });
      console.log(`\n=== Ward count for ${prov3.name} (3-level, id=${prov3.id}) === ${wardCount}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
