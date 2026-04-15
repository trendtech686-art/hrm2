// Generic seed runner — pass seed file as CLI arg
// Usage: npx tsx scripts/run-seed.ts prisma/seeds/seed-dev.ts

const seedFile = process.argv[2];
if (!seedFile) {
  console.error('Usage: npx tsx scripts/run-seed.ts <seed-file>');
  process.exit(1);
}

const mod = await import(`../${seedFile}`);
// Try common export names
const seedFn = mod.default || mod.seedAllSettings || mod.seedAdminUnits
  || mod.seedEmployeeSettings || mod.seedCustomerSettings || mod.seedSalesSettings
  || mod.seedDevSettings;

if (typeof seedFn === 'function') {
  await seedFn();
}
console.log('Done!');
process.exit(0);
