/**
 * Seed script for Administrative Units (Provinces, Districts, Wards)
 * 
 * Run with: npx prisma db seed -- --only=administrative-units
 * Or manually: npx tsx prisma/seeds/seed-administrative-units.ts
 * 
 * This imports data from the static .ts files into PostgreSQL.
 * After successful import, the static files can be removed.
 */

import { prisma } from '../../lib/prisma';

// Import data from static files using relative paths
import { PROVINCES_DATA } from '../../features/settings/provinces/provinces-data';
import { DISTRICTS_DATA } from '../../features/settings/provinces/districts-data';
import { WARDS_2LEVEL_DATA } from '../../features/settings/provinces/wards-2level-data';
import { WARDS_3LEVEL_DATA } from '../../features/settings/provinces/wards-3level-data';

const BATCH_SIZE = 500; // Insert in batches for performance

async function seedProvinces() {
  
  const provinces = PROVINCES_DATA.map(p => ({
    systemId: String(p.systemId),
    id: String(p.id),
    name: p.name,
    createdBy: 'SYSTEM',
  }));

  // Upsert to handle re-runs
  for (const province of provinces) {
    await prisma.province.upsert({
      where: { systemId: province.systemId },
      update: { name: province.name },
      create: province,
    });
  }

}

async function seedDistricts() {
  
  const districts = DISTRICTS_DATA.map(d => ({
    systemId: String(d.systemId),
    id: typeof d.id === 'number' ? d.id : parseInt(String(d.id), 10),
    name: d.name,
    provinceId: String(d.provinceId),
    createdBy: 'SYSTEM',
  }));

  // Batch insert
  let inserted = 0;
  for (let i = 0; i < districts.length; i += BATCH_SIZE) {
    const batch = districts.slice(i, i + BATCH_SIZE);
    
    // Use createMany with skipDuplicates for efficiency
    await prisma.district.createMany({
      data: batch,
      skipDuplicates: true,
    });
    
    inserted += batch.length;
    process.stdout.write(`\r   Processing: ${inserted}/${districts.length}`);
  }

}

async function seedWards() {
  
  // Combine 2-level and 3-level wards
  const wards2 = WARDS_2LEVEL_DATA.map(w => ({
    systemId: String(w.systemId),
    id: String(w.id),
    name: w.name,
    provinceId: String(w.provinceId),
    provinceName: w.provinceName,
    districtId: null as number | null,
    districtName: null as string | null,
    level: '2-level',
    createdBy: 'SYSTEM',
  }));

  const wards3 = WARDS_3LEVEL_DATA.map(w => ({
    systemId: String(w.systemId),
    id: String(w.id),
    name: w.name,
    provinceId: String(w.provinceId),
    provinceName: w.provinceName,
    districtId: w.districtId,
    districtName: w.districtName,
    level: '3-level',
    createdBy: 'SYSTEM',
  }));

  const allWards = [...wards2, ...wards3];

  // Batch insert for performance
  let inserted = 0;
  for (let i = 0; i < allWards.length; i += BATCH_SIZE) {
    const batch = allWards.slice(i, i + BATCH_SIZE);
    
    await prisma.ward.createMany({
      data: batch,
      skipDuplicates: true,
    });
    
    inserted += batch.length;
    process.stdout.write(`\r   Processing: ${inserted}/${allWards.length}`);
  }

}

async function main() {
  
  const startTime = Date.now();

  try {
    await seedProvinces();
    await seedDistricts();
    await seedWards();

    const _duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Print summary
    const [_provinceCount, _districtCount, _wardCount] = await Promise.all([
      prisma.province.count(),
      prisma.district.count(),
      prisma.ward.count(),
    ]);


  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main();
