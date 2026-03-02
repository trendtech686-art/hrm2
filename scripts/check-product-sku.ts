import { prisma } from "../lib/prisma";

async function main() {
  const p = await prisma.product.findFirst({
    where: { pkgxId: 8027 },
    select: { 
      systemId: true, 
      id: true, 
      name: true,
      pkgxId: true,
    }
  });
  
  console.log("Product in DB:", JSON.stringify(p, null, 2));
  
  await prisma.$disconnect();
}

main();
