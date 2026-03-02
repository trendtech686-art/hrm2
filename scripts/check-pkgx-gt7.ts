// Check PKGX API response for X96 product
import { config } from "dotenv";
config();

async function main() {
  const apiUrl = "https://phukiengiaxuong.com.vn/admin/api_product_hrm.php";
  const apiKey = process.env.PKGX_API_KEY || "a91f2c47e5d8b6f03a7c4e9d12f0b8a6";

  // Call API to get all products
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      function: "get_products",
      key: apiKey,
    }),
  });

  const data = await response.json();

  if (!data.data || !Array.isArray(data.data)) {
    console.log("No data from API");
    return;
  }

  // Find X96 product (the one user showed in screenshot)
  const x96 = data.data.find(
    (p: Record<string, unknown>) => 
      (p.goods_name as string)?.includes("X96") || 
      (p.name as string)?.includes("X96") ||
      p.goods_id === 8040 || 
      p.id === 8040 || 
      p.id === "8040"
  );

  if (x96) {
    console.log("=== X96 Product from PKGX API ===");
    console.log("ID:", x96.goods_id || x96.id);
    console.log("Name:", x96.goods_name || x96.name);
    console.log("\nPrice fields:");
    console.log("  shop_price:", x96.shop_price);
    console.log("  market_price:", x96.market_price);
    console.log("  partner_price:", x96.partner_price);
    console.log("  ace_price:", x96.ace_price);
    console.log("  deal_price:", x96.deal_price);
    console.log("\nFull object keys:", Object.keys(x96));
  } else {
    console.log("X96 product not found!");
  }
  
  // Also show first product to see all fields
  if (data.data.length > 0) {
    console.log("\n=== First Product (for field reference) ===");
    const first = data.data[0];
    console.log("All fields:", Object.keys(first));
    console.log("ace_price value:", first.ace_price);
    console.log("Full object:", JSON.stringify(first, null, 2));
  }
}

main().catch(console.error);
