import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  console.log("=== Testing PkgxPriceMapping Table ===\n");
  
  // 1. Check existing mappings
  const mappings = await prisma.pkgxPriceMapping.findMany();
  console.log(`Found ${mappings.length} existing mappings:`);
  mappings.forEach(m => {
    console.log(`  - ${m.priceType} => ${m.pricingPolicyId}`);
  });
  
  // 2. Check available PricingPolicy
  console.log("\n=== Available PricingPolicy ===");
  const policies = await prisma.pricingPolicy.findMany({
    select: { systemId: true, name: true }
  });
  console.log(`Found ${policies.length} pricing policies:`);
  policies.forEach(p => {
    console.log(`  - ${p.systemId}: ${p.name}`);
  });
  
  // 3. Verify which mappings are valid (point to existing policies)
  console.log("\n=== Mapping Validity Check ===");
  const policyIds = new Set(policies.map(p => p.systemId));
  for (const m of mappings) {
    const isValid = policyIds.has(m.pricingPolicyId);
    console.log(`  ${m.priceType} => ${m.pricingPolicyId}: ${isValid ? '✅ VALID' : '❌ INVALID (policy not found)'}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
