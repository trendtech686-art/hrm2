import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function resetHRData() {
  console.log('🗑️  Bắt đầu xóa dữ liệu...\n');
  
  try {
    // 1. Xóa đơn hàng và các bản ghi liên quan
    console.log('📦 Xóa đơn hàng...');
    const deletedOrderPayments = await prisma.orderPayment.deleteMany({});
    console.log(`  ✅ Đã xóa ${deletedOrderPayments.count} order payments`);
    
    const deletedOrderItems = await prisma.orderLineItem.deleteMany({});
    console.log(`  ✅ Đã xóa ${deletedOrderItems.count} order items`);
    
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`  ✅ Đã xóa ${deletedOrders.count} đơn hàng\n`);
    
    // 2. Xóa dữ liệu chấm công
    console.log('⏰ Xóa dữ liệu chấm công...');
    const deletedAttendance = await prisma.attendanceRecord.deleteMany({});
    console.log(`  ✅ Đã xóa ${deletedAttendance.count} bản ghi chấm công\n`);
    
    // 3. Xóa dữ liệu nghỉ phép
    console.log('🏖️  Xóa dữ liệu nghỉ phép...');
    const deletedLeaveRequests = await prisma.leave.deleteMany({});
    console.log(`  ✅ Đã xóa ${deletedLeaveRequests.count} đơn nghỉ phép\n`);
    
    // 4. Xóa bảng lương
    console.log('💰 Xóa bảng lương...');
    const deletedPayrollItems = await prisma.payrollItem.deleteMany({});
    console.log(`  ✅ Đã xóa ${deletedPayrollItems.count} payroll items`);
    
    const deletedPayrolls = await prisma.payroll.deleteMany({});
    console.log(`  ✅ Đã xóa ${deletedPayrolls.count} bảng lương\n`);
    
    // 5. Xóa nhân viên (trừ admin)
    console.log('👥 Xóa nhân viên...');
    
    const deletedEmployees = await prisma.employee.deleteMany({
      where: {
        workEmail: {
          notIn: ['admin@company.com']
        }
      }
    });
    console.log(`  ✅ Đã xóa ${deletedEmployees.count} nhân viên\n`);
    
    // 6. Tạo lại 2 nhân viên mới
    console.log('✨ Tạo nhân viên mới...\n');
    
    // Lấy branch mặc định
    const defaultBranch = await prisma.branch.findFirst({
      where: { isDefault: true }
    });
    
    if (!defaultBranch) {
      throw new Error('Không tìm thấy chi nhánh mặc định');
    }
    
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await prisma.employee.findUnique({
      where: { workEmail: 'admin@company.com' }
    });
    
    if (!existingAdmin) {
      // Tạo admin
      const admin = await prisma.employee.create({
        data: {
          systemId: 'EMP000001',
          id: 'NV001',
          workEmail: 'admin@company.com',
          fullName: 'Admin System',
          phone: '0900000001',
          employmentStatus: 'ACTIVE',
          role: 'Admin',
          branchId: defaultBranch.systemId,
        }
      });
      console.log(`  ✅ Tạo Admin: ${admin.fullName} (${admin.workEmail})`);
    } else {
      console.log(`  ℹ️  Admin đã tồn tại: ${existingAdmin.workEmail}`);
    }
    
    // Tạo user
    const user = await prisma.employee.create({
      data: {
        systemId: 'EMP000002',
        id: 'NV002',
        workEmail: 'user@company.com',
        fullName: 'Nhân Viên Demo',
        phone: '0900000002',
        employmentStatus: 'ACTIVE',
        role: 'Nhân viên',
        branchId: defaultBranch.systemId,
      }
    });
    console.log(`  ✅ Tạo User: ${user.fullName} (${user.workEmail})\n`);
    
    console.log('🎉 Hoàn thành! Dữ liệu đã được reset.');
    console.log('\n📋 Tài khoản đăng nhập:');
    console.log('  👤 Admin: admin@company.com');
    console.log('  👤 User: user@company.com');
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetHRData().catch(console.error);
