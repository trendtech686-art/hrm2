import 'dotenv/config';
import { prisma } from './lib/prisma';

async function deletePkgxProducts() {
  try {
    console.log('🗑️ Đang xóa tất cả sản phẩm đã import từ PKGX...\n');
    
    // Count first
    const count = await prisma.product.count({
      where: {
        pkgxId: { not: null },
        isDeleted: false,
      },
    });
    
    console.log(`📦 Tìm thấy ${count} sản phẩm PKGX`);
    
    if (count === 0) {
      console.log('✅ Không có sản phẩm PKGX nào để xóa');
      return;
    }
    
    // Delete related records first
    console.log('\n🔄 Đang xóa dữ liệu liên quan...');
    
    // Get product systemIds
    const products = await prisma.product.findMany({
      where: {
        pkgxId: { not: null },
        isDeleted: false,
      },
      select: { systemId: true },
    });
    
    const productIds = products.map(p => p.systemId);
    
    // Delete prices
    const pricesDeleted = await prisma.productPrice.deleteMany({
      where: { productId: { in: productIds } },
    });
    console.log(`  ✓ Xóa ${pricesDeleted.count} bản ghi giá`);
    
    // Delete inventory
    const inventoryDeleted = await prisma.productInventory.deleteMany({
      where: { productId: { in: productIds } },
    });
    console.log(`  ✓ Xóa ${inventoryDeleted.count} bản ghi tồn kho`);
    
    // Delete product categories
    const categoriesDeleted = await prisma.productCategory.deleteMany({
      where: { productId: { in: productIds } },
    });
    console.log(`  ✓ Xóa ${categoriesDeleted.count} bản ghi danh mục`);
    
    // Delete products
    const productsDeleted = await prisma.product.deleteMany({
      where: {
        pkgxId: { not: null },
        isDeleted: false,
      },
    });
    
    console.log(`\n✅ Đã xóa thành công ${productsDeleted.count} sản phẩm PKGX!`);
    console.log('📝 Giờ anh có thể import lại với mappings mới');
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deletePkgxProducts();
