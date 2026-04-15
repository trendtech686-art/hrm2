import { config } from 'dotenv';
config();

async function main() {
  const { prisma } = await import('../lib/prisma');
  
  // Check raw DB data shape
  const rawMappings = await prisma.pkgxCategoryMapping.findMany({ 
    where: { isActive: true }, 
    include: { pkgxCategory: true },
    take: 2 
  });
  console.log('=== RAW DB MAPPING SHAPE ===');
  console.log(JSON.stringify(rawMappings, null, 2));

  // Simulate the consolidated API response
  const allMappings = await prisma.pkgxCategoryMapping.findMany({ 
    where: { isActive: true }, 
    take: 5 
  });
  
  // Simulate fetchPkgxMappingsOnly transformation
  const transformed = allMappings.map(m => ({
    systemId: m.systemId,
    id: m.systemId,
    hrmCategoryId: m.hrmCategoryId,
    hrmCategorySystemId: m.hrmCategoryId,
    hrmCategoryName: m.hrmCategoryName,
    pkgxCategoryId: m.pkgxCategoryId,
    pkgxCatId: m.pkgxCategoryId,
    pkgxCategoryName: m.pkgxCategoryName,
  }));
  
  console.log('\n=== TRANSFORMED MAPPINGS ===');
  console.log(JSON.stringify(transformed.slice(0, 2), null, 2));

  // Now check what category data the page passes
  const cat = await prisma.category.findFirst({ 
    where: { systemId: allMappings[0].hrmCategoryId } 
  });
  console.log('\n=== CATEGORY FOR FIRST MAPPING ===');
  console.log(`hrmCategoryId in mapping: "${allMappings[0].hrmCategoryId}"`);
  console.log(`Category.systemId: "${cat?.systemId}"`);
  console.log(`Category.id: "${cat?.id}"`);
  console.log(`Category.name: "${cat?.name}"`);
  console.log(`Match: ${allMappings[0].hrmCategoryId === cat?.systemId}`);
  
  // Total
  const total = await prisma.pkgxCategoryMapping.count({ where: { isActive: true } });
  console.log(`\nTotal active mappings: ${total}`);
  
  process.exit(0);
}

main().catch(console.error);
