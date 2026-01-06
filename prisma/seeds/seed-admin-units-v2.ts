/**
 * Seed Administrative Units via Prisma
 * v2 - With validation to skip wards with invalid province/district IDs
 * 
 * Run: npx tsx prisma/seeds/seed-admin-units-v2.ts
 */

import { config } from 'dotenv';
config(); // Load .env FIRST

import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Import data
import { PROVINCES_DATA } from '../../features/settings/provinces/provinces-data';
import { DISTRICTS_DATA } from '../../features/settings/provinces/districts-data';
import { WARDS_2LEVEL_DATA } from '../../features/settings/provinces/wards-2level-data';
import { WARDS_3LEVEL_DATA } from '../../features/settings/provinces/wards-3level-data';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BATCH_SIZE = 500;

// Build lookup maps for validation
const validProvinceIds = new Set(PROVINCES_DATA.map(p => String(p.id)));
const validDistrictIds = new Set(DISTRICTS_DATA.map(d => d.id));

async function clearExistingData() {
  
  // Delete in reverse order due to foreign keys
  await prisma.ward.deleteMany({});
  await prisma.district.deleteMany({});
  await prisma.province.deleteMany({});
  
}

async function seedProvinces() {
  
  const provinces = PROVINCES_DATA.map(p => ({
    systemId: String(p.systemId),
    id: String(p.id),
    name: p.name,
    createdBy: 'SYSTEM',
  }));

  await prisma.province.createMany({
    data: provinces,
    skipDuplicates: true,
  });

}

async function seedDistricts() {
  
  // Filter districts to only include those with valid provinceIds
  const districts = DISTRICTS_DATA
    .filter(d => validProvinceIds.has(String(d.provinceId)))
    .map(d => ({
      systemId: String(d.systemId),
      id: typeof d.id === 'number' ? d.id : parseInt(String(d.id), 10),
      name: d.name,
      provinceId: String(d.provinceId),
      createdBy: 'SYSTEM',
    }));

  const skipped = DISTRICTS_DATA.length - districts.length;
  if (skipped > 0) {
    // Some districts were filtered out due to invalid provinceId
  }

  let inserted = 0;
  for (let i = 0; i < districts.length; i += BATCH_SIZE) {
    const batch = districts.slice(i, i + BATCH_SIZE);
    await prisma.district.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += batch.length;
    process.stdout.write(`\r   Processing: ${inserted}/${districts.length}`);
  }

  
  // Update validDistrictIds with actually inserted districts
  validDistrictIds.clear();
  districts.forEach(d => validDistrictIds.add(d.id));
}

async function seedWards() {
  
  // Filter wards 2-level - only need valid provinceId
  const wards2 = WARDS_2LEVEL_DATA
    .filter(w => validProvinceIds.has(String(w.provinceId)))
    .map(w => ({
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

  const skipped2 = WARDS_2LEVEL_DATA.length - wards2.length;
  if (skipped2 > 0) {
    // Some 2-level wards were filtered out
  }

  // Filter wards 3-level - need both valid provinceId AND districtId
  const wards3 = WARDS_3LEVEL_DATA
    .filter(w => {
      const hasValidProvince = validProvinceIds.has(String(w.provinceId));
      const hasValidDistrict = validDistrictIds.has(w.districtId);
      return hasValidProvince && hasValidDistrict;
    })
    .map(w => ({
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

  const skipped3 = WARDS_3LEVEL_DATA.length - wards3.length;
  if (skipped3 > 0) {
    // Some 3-level wards were filtered out
  }

  const allWards = [...wards2, ...wards3];

  let inserted = 0;
  let errors = 0;
  
  for (let i = 0; i < allWards.length; i += BATCH_SIZE) {
    const batch = allWards.slice(i, i + BATCH_SIZE);
    try {
      await prisma.ward.createMany({
        data: batch,
        skipDuplicates: true,
      });
      inserted += batch.length;
    } catch (_error) {
      // If batch fails, try one by one
      for (const ward of batch) {
        try {
          await prisma.ward.create({ data: ward });
          inserted++;
        } catch {
          errors++;
        }
      }
    }
    process.stdout.write(`\r   Processing: ${inserted}/${allWards.length} (errors: ${errors})`);
  }

}

async function main() {
  
  const startTime = Date.now();

  try {
    await clearExistingData();
    await seedProvinces();
    await seedDistricts();
    await seedWards();

    const _duration = ((Date.now() - startTime) / 1000).toFixed(2);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
