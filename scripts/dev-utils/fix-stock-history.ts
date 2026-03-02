import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function fixStockHistory() {
  try {
    // Find all stock history entries with "Hệ thống"
    const entries = await prisma.stockHistory.findMany({
      where: {
        employeeName: 'Hệ thống',
      },
    });
    
    console.log(`Found ${entries.length} entries with "Hệ thống"`);
    
    // Get default employee (admin)
    const adminEmployee = await prisma.employee.findFirst({
      where: { systemId: 'EMP-ADMIN' },
      select: { systemId: true, fullName: true },
    });
    
    console.log(`Admin employee: ${adminEmployee?.fullName || 'NOT FOUND'}`);
    
    for (const entry of entries) {
      let employeeName = 'Hệ thống';
      let employeeId = entry.employeeId;
      
      if (entry.employeeId) {
        const employee = await prisma.employee.findUnique({
          where: { systemId: entry.employeeId },
          select: { fullName: true },
        });
        
        if (employee?.fullName) {
          employeeName = employee.fullName;
        }
      } else if (adminEmployee) {
        // If no employeeId, use admin employee as default
        employeeName = adminEmployee.fullName;
        employeeId = adminEmployee.systemId;
      }
      
      if (employeeName !== 'Hệ thống') {
        await prisma.stockHistory.update({
          where: { systemId: entry.systemId },
          data: { 
            employeeName: employeeName,
            employeeId: employeeId,
          },
        });
        console.log(`Updated entry ${entry.systemId}: "${entry.employeeName}" -> "${employeeName}"`);
      } else {
        console.log(`Skipped entry ${entry.systemId}: no employee found`);
      }
    }
    
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixStockHistory();
