// Check PkgxProduct table (not cache)
import { prisma } from "../lib/prisma";

async function main() {
  console.log("=== PkgxProduct Table ===");
  
  const count = await prisma.pkgxProduct.count();
  console.log("Total products:", count);
  
  if (count > 0) {
    // Get first product
    const first = await prisma.pkgxProduct.findFirst({
      orderBy: { id: 'desc' },
    });
    console.log("\n=== First Product ===");
    console.log("id:", first?.id);
    console.log("name:", first?.name);
    console.log("acePrice:", first?.acePrice);
    console.log("shopPrice:", first?.shopPrice);
    console.log("partnerPrice:", first?.partnerPrice);
    
    // Find X96
    const x96 = await prisma.pkgxProduct.findFirst({
      where: {
        OR: [
          { name: { contains: "X96" } },
          { id: 8040 },
        ]
      }
    });
    if (x96) {
      console.log("\n=== X96 in PkgxProduct table ===");
      console.log("id:", x96.id);
      console.log("name:", x96.name);
      console.log("acePrice:", x96.acePrice);
      console.log("shopPrice:", x96.shopPrice);
    } else {
      console.log("\nX96 not found in PkgxProduct table");
    }
    
    // Count products with acePrice
    const withAce = await prisma.pkgxProduct.count({
      where: {
        acePrice: { gt: 0 }
      }
    });
    console.log("\n=== acePrice Stats ===");
    console.log("Products with acePrice > 0:", withAce);
    console.log("Products with acePrice = 0 or null:", count - withAce);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
