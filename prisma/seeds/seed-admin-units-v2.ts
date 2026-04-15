/**
 * Seed Administrative Units v2
 * - 2-level: 34 provinces (new), ~3,321 wards
 * - 3-level: 63 provinces (old), ~624 districts, ~10,035 wards
 * 
 * Run: npx tsx prisma/seeds/seed-admin-units-v2.ts
 */

import { config } from 'dotenv';
config();

import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Chỉ import 2 file gốc
import { WARDS_2LEVEL_DATA } from '../../features/settings/provinces/wards-2level-data';
import { WARDS_3LEVEL_DATA } from '../../features/settings/provinces/wards-3level-data';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BATCH_SIZE = 500;

// Extract unique provinces from 2-level wards
function extractProvinces2Level() {
  const provinceMap = new Map<string, { id: string; name: string }>();
  for (const ward of WARDS_2LEVEL_DATA) {
    if (!provinceMap.has(ward.provinceId)) {
      provinceMap.set(ward.provinceId, {
        id: ward.provinceId,
        name: ward.provinceName,
      });
    }
  }
  return Array.from(provinceMap.values());
}

// Extract unique provinces from 3-level wards
function extractProvinces3Level() {
  const provinceMap = new Map<string, { id: string; name: string }>();
  for (const ward of WARDS_3LEVEL_DATA) {
    if (!provinceMap.has(ward.provinceId)) {
      provinceMap.set(ward.provinceId, {
        id: ward.provinceId,
        name: ward.provinceName,
      });
    }
  }
  return Array.from(provinceMap.values());
}

// Extract unique districts from 3-level wards
function extractDistricts3Level() {
  const districtMap = new Map<number, { id: number; name: string; provinceId: string }>();
  for (const ward of WARDS_3LEVEL_DATA) {
    if (!districtMap.has(ward.districtId)) {
      districtMap.set(ward.districtId, {
        id: ward.districtId,
        name: ward.districtName,
        provinceId: ward.provinceId,
      });
    }
  }
  return Array.from(districtMap.values());
}

// ========================================
// 2-LEVEL (34 provinces new)
// ========================================

async function seedProvinces2Level() {
  console.log('📍 [2-level] Seeding provinces...');
  
  const provincesData = extractProvinces2Level();
  const provinces = provincesData.map(p => ({
    systemId: crypto.randomUUID(),
    id: String(p.id),
    name: p.name,
    level: '2-level',
    createdBy: 'SYSTEM',
  }));

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { id_level: { id: province.id, level: province.level } },
      update: { name: province.name },
      create: province,
    });
  }
  
  console.log(`✅ [2-level] Seeded ${provinces.length} provinces`);
  return provinces.length;
}

async function seedWards2Level() {
  console.log('📍 [2-level] Seeding wards...');
  
  // Get valid province IDs
  const existingProvinces = await prisma.province.findMany({ 
    where: { level: '2-level' },
    select: { id: true } 
  });
  const provinceIds = new Set(existingProvinces.map(p => p.id));
  
  const wards = WARDS_2LEVEL_DATA.map(w => ({
    systemId: crypto.randomUUID(),
    id: String(w.id),
    name: w.name,
    provinceId: String(w.provinceId),
    provinceName: w.provinceName,
    districtId: null,
    districtName: null,
    level: '2-level',
    createdBy: 'SYSTEM',
  }));
  
  // Filter valid wards
  const validWards = wards.filter(w => provinceIds.has(w.provinceId));
  const skipped = wards.length - validWards.length;
  
  if (skipped > 0) {
    console.log(`   ⚠️ Skipping ${skipped} wards with invalid provinceId`);
  }

  let inserted = 0;
  for (let i = 0; i < validWards.length; i += BATCH_SIZE) {
    const batch = validWards.slice(i, i + BATCH_SIZE);
    await prisma.ward.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += batch.length;
    process.stdout.write(`\r   Processing: ${inserted}/${validWards.length}`);
  }
  
  console.log(`\n✅ [2-level] Seeded ${validWards.length} wards`);
  return validWards.length;
}

// ========================================
// 3-LEVEL (63 provinces old)
// ========================================

async function seedProvinces3Level() {
  console.log('📍 [3-level] Seeding provinces...');
  
  const provincesData = extractProvinces3Level();
  const provinces = provincesData.map(p => ({
    systemId: crypto.randomUUID(),
    id: String(p.id),
    name: p.name,
    level: '3-level',
    createdBy: 'SYSTEM',
  }));

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { id_level: { id: province.id, level: province.level } },
      update: { name: province.name },
      create: province,
    });
  }
  
  console.log(`✅ [3-level] Seeded ${provinces.length} provinces`);
  return provinces.length;
}

async function seedDistricts3Level() {
  console.log('📍 [3-level] Seeding districts...');
  
  const districtsData = extractDistricts3Level();
  const districts = districtsData.map(d => ({
    systemId: crypto.randomUUID(),
    id: d.id,
    name: d.name,
    provinceId: String(d.provinceId),
    level: '3-level',
    createdBy: 'SYSTEM',
  }));

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
  
  console.log(`\n✅ [3-level] Seeded ${districts.length} districts`);
  return districts.length;
}

async function seedWards3Level() {
  console.log('📍 [3-level] Seeding wards...');
  
  // Get valid province IDs
  const existingProvinces = await prisma.province.findMany({ 
    where: { level: '3-level' },
    select: { id: true } 
  });
  const provinceIds = new Set(existingProvinces.map(p => p.id));
  
  const wards = WARDS_3LEVEL_DATA.map(w => ({
    systemId: crypto.randomUUID(),
    id: String(w.id),
    name: w.name,
    provinceId: String(w.provinceId),
    provinceName: w.provinceName,
    districtId: typeof w.districtId === 'number' ? w.districtId : null,
    districtName: w.districtName || null,
    level: '3-level',
    createdBy: 'SYSTEM',
  }));
  
  // Filter valid wards
  const validWards = wards.filter(w => provinceIds.has(w.provinceId));
  const skipped = wards.length - validWards.length;
  
  if (skipped > 0) {
    console.log(`   ⚠️ Skipping ${skipped} wards with invalid provinceId`);
  }

  let inserted = 0;
  for (let i = 0; i < validWards.length; i += BATCH_SIZE) {
    const batch = validWards.slice(i, i + BATCH_SIZE);
    await prisma.ward.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += batch.length;
    process.stdout.write(`\r   Processing: ${inserted}/${validWards.length}`);
  }
  
  console.log(`\n✅ [3-level] Seeded ${validWards.length} wards`);
  return validWards.length;
}

// ========================================
// MAIN (exported for use in master seed)
// ========================================

export async function seedAdminUnits() {
  const startTime = Date.now();

  try {
    console.log('🚀 Starting Administrative Units seed (2-level + 3-level)\n');
    
    // Seed 2-level
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2-LEVEL (34 provinces new)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const prov2 = await seedProvinces2Level();
    const ward2 = await seedWards2Level();
    
    console.log('');
    
    // Seed 3-level
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3-LEVEL (63 provinces old)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const prov3 = await seedProvinces3Level();
    const dist3 = await seedDistricts3Level();
    const ward3 = await seedWards3Level();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ADMIN UNITS SEED COMPLETED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`2-level: ${prov2} provinces, ${ward2} wards`);
    console.log(`3-level: ${prov3} provinces, ${dist3} districts, ${ward3} wards`);
    console.log(`Duration: ${duration}s`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Run if executed directly (ESM compatible)
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedAdminUnits()
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}
