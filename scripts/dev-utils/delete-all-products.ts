import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function deleteAllProducts() {
  console.log('🗑️  Bắt đầu xóa tất cả sản phẩm...\n');
  
  try {
    // 1. Xóa OrderLineItem (order items sử dụng products)
    const deletedOrderItems = await prisma.orderLineItem.deleteMany({});
    console.log(`✅ Đã xóa ${deletedOrderItems.count} order line items`);
    
    // 2. Xóa PurchaseOrderItem
    const deletedPurchaseItems = await prisma.purchaseOrderItem.deleteMany({});
    console.log(`✅ Đã xóa ${deletedPurchaseItems.count} purchase order items`);
    
    // 3. Xóa ProductPrice
    const deletedPrices = await prisma.productPrice.deleteMany({});
    console.log(`✅ Đã xóa ${deletedPrices.count} bản ghi giá sản phẩm`);
    
    // 4. Xóa ProductInventory
    const deletedInventory = await prisma.productInventory.deleteMany({});
    console.log(`✅ Đã xóa ${deletedInventory.count} bản ghi tồn kho`);
    
    // 5. Xóa ProductCategory (junction table)
    const deletedCategories = await prisma.productCategory.deleteMany({});
    console.log(`✅ Đã xóa ${deletedCategories.count} liên kết danh mục`);
    
    // 6. Xóa Inventory records
    const deletedInventoryRecords = await prisma.inventory.deleteMany({});
    console.log(`✅ Đã xóa ${deletedInventoryRecords.count} bản ghi inventory`);
    
    // 7. Cuối cùng xóa Products
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`✅ Đã xóa ${deletedProducts.count} sản phẩm\n`);
    
    console.log('🎉 Hoàn thành! Tất cả sản phẩm đã được xóa.');
    
  } catch (error) {
    console.error('❌ Lỗi khi xóa sản phẩm:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllProducts().catch(console.error);
