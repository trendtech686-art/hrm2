// Check if cache has ace_price field
import { config } from "dotenv";
import { prisma } from "../lib/prisma";

config();

async function main() {
  // Get pkgx settings which contains cached products
  const setting = await prisma.setting.findFirst({
    where: {
      key: "settings",
      group: "pkgx",
    },
    select: { value: true },
  });
  
  const data = (setting?.value || {}) as Record<string, unknown>;
  const pkgxProducts = data.pkgxProducts as any[] || [];
  
  console.log("=== PKGX Products Cache ===");
  console.log("Total products in cache:", pkgxProducts.length);
  
  if (pkgxProducts.length > 0) {
    const first = pkgxProducts[0];
    console.log("\n=== First Product in Cache ===");
    console.log("goods_id:", first.goods_id);
    console.log("goods_name:", first.goods_name);
    console.log("\nPrice fields:");
    console.log("  shop_price:", first.shop_price);
    console.log("  ace_price:", first.ace_price);
    console.log("  partner_price:", first.partner_price);
    console.log("  deal_price:", first.deal_price);
    console.log("\nAll keys:", Object.keys(first));
    
    // Find X96
    const x96 = pkgxProducts.find((p: any) => 
      p.goods_name?.includes("X96") || p.goods_id == 8040
    );
    if (x96) {
      console.log("\n=== X96 in Cache ===");
      console.log("goods_id:", x96.goods_id);
      console.log("goods_name:", x96.goods_name);
      console.log("ace_price:", x96.ace_price);
    } else {
      console.log("\nX96 not found in cache");
    }
    
    // Count products with ace_price = 0 or missing
    const noAcePrice = pkgxProducts.filter((p: any) => !p.ace_price || p.ace_price == 0);
    console.log("\n=== ace_price Stats ===");
    console.log("Products with ace_price = 0 or missing:", noAcePrice.length);
    console.log("Products with ace_price > 0:", pkgxProducts.length - noAcePrice.length);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
