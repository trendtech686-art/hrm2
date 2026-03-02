// Debug PKGX API response to check ace_price field
import { config } from "dotenv";
config();

async function main() {
  const apiUrl = "https://phukiengiaxuong.com.vn/admin/api_product_hrm.php";
  const apiKey = "a91f2c47e5d8b6f03a7c4e9d12f0b8a6";

  console.log("=== Calling PKGX API ===");
  console.log("URL:", `${apiUrl}?action=get_products&page=1&limit=10`);
  
  // Call API the same way as api-service.ts does
  const response = await fetch(`${apiUrl}?action=get_products&page=1&limit=10`, {
    method: "GET",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  });

  console.log("Status:", response.status);
  
  const text = await response.text();
  console.log("\n=== Raw Response (first 500 chars) ===");
  console.log(text.substring(0, 500));
  
  try {
    const data = JSON.parse(text);
    console.log("\n=== Parsed Response ===");
    console.log("Error:", data.error);
    console.log("Message:", data.message);
    
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      const first = data.data[0];
      console.log("\n=== First Product ===");
      console.log("goods_id:", first.goods_id);
      console.log("goods_name:", first.goods_name);
      console.log("\nAll price fields:");
      console.log("  shop_price:", first.shop_price, `(type: ${typeof first.shop_price})`);
      console.log("  market_price:", first.market_price, `(type: ${typeof first.market_price})`);
      console.log("  partner_price:", first.partner_price, `(type: ${typeof first.partner_price})`);
      console.log("  ace_price:", first.ace_price, `(type: ${typeof first.ace_price})`);
      console.log("  deal_price:", first.deal_price, `(type: ${typeof first.deal_price})`);
      console.log("\nAll keys in product:", Object.keys(first));
      
      // Find X96 product
      const x96 = data.data.find((p: any) => 
        p.goods_name?.includes("X96") || p.goods_id === 8040
      );
      if (x96) {
        console.log("\n=== X96 Product ===");
        console.log("goods_id:", x96.goods_id);
        console.log("goods_name:", x96.goods_name);
        console.log("ace_price:", x96.ace_price);
      }
    } else {
      console.log("\nNo products in response!");
      console.log("Full response:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("Failed to parse JSON:", e);
  }
}

main().catch(console.error);
