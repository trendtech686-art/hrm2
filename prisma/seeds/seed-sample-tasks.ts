/**
 * Seed Sample Tasks
 * Creates sample tasks assigned to employees for testing.
 * 
 * Run: npx tsx prisma/seeds/seed-sample-tasks.ts
 */

import { config } from 'dotenv';
config();

import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Seeding Sample Tasks...\n');

  // Find all active employees
  const employees = await prisma.employee.findMany({
    where: { isDeleted: false },
    select: { systemId: true, fullName: true, id: true },
    take: 10,
  });

  if (employees.length === 0) {
    console.log('❌ No employees found. Please seed employees first.');
    return;
  }

  console.log(`📋 Found ${employees.length} employees:`);
  employees.forEach(e => console.log(`   - ${e.fullName} (${e.systemId})`));

  // Use first employee as default creator/assignee
  const creator = employees[0];

  // Find the next available task number based on businessId (CVNB prefix)
  const lastTask = await prisma.task.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  let counter = 1;
  if (lastTask?.id) {
    const num = parseInt(lastTask.id.replace('CVNB', ''), 10);
    if (!isNaN(num)) counter = num + 1;
  }

  const pad = (n: number) => String(n).padStart(6, '0');

  const now = new Date();
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d;
  };

  const sampleTasks = [
    {
      title: 'Kiểm tra hàng tồn kho tháng 3',
      description: 'Kiểm tra số lượng hàng tồn kho thực tế so với hệ thống, báo cáo chênh lệch.',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      dueDate: day(3),
      tags: ['kho', 'kiểm kê'],
      type: 'Kiểm kê',
      assigneeIndex: 0,
    },
    {
      title: 'Cập nhật bảng giá sản phẩm mới',
      description: 'Cập nhật giá bán lẻ và giá sỉ cho 50 sản phẩm mới nhập về.',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      dueDate: day(2),
      startDate: day(-1),
      tags: ['sản phẩm', 'giá'],
      type: 'Cập nhật',
      progress: 40,
      assigneeIndex: 0,
    },
    {
      title: 'Liên hệ nhà cung cấp ABC về đơn hàng trễ',
      description: 'Đơn hàng PO-2026-0312 đã trễ 5 ngày. Liên hệ để xác nhận thời gian giao hàng mới.',
      status: 'TODO' as const,
      priority: 'URGENT' as const,
      dueDate: day(1),
      tags: ['nhà cung cấp', 'khẩn cấp'],
      type: 'Liên hệ',
      assigneeIndex: 0,
    },
    {
      title: 'Sắp xếp kệ hàng khu vực A',
      description: 'Sắp xếp lại kệ hàng theo danh mục mới, dán nhãn vị trí.',
      status: 'TODO' as const,
      priority: 'LOW' as const,
      dueDate: day(7),
      tags: ['kho', 'sắp xếp'],
      type: 'Vận hành',
      assigneeIndex: 0,
    },
    {
      title: 'Đối soát công nợ khách hàng quý 1',
      description: 'Tổng hợp và đối soát công nợ tất cả khách hàng từ tháng 1-3/2026.',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      dueDate: day(5),
      startDate: day(-3),
      tags: ['tài chính', 'công nợ'],
      type: 'Báo cáo',
      progress: 60,
      assigneeIndex: Math.min(1, employees.length - 1),
    },
    {
      title: 'Chuẩn bị hàng cho đợt khuyến mãi tháng 4',
      description: 'Kiểm tra tồn kho và chuẩn bị packaging cho 20 SKU khuyến mãi.',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      dueDate: day(10),
      tags: ['khuyến mãi', 'kho'],
      type: 'Chuẩn bị',
      assigneeIndex: 0,
    },
    {
      title: 'Báo cáo doanh số tuần 12',
      description: 'Tổng hợp doanh số bán hàng tuần 12 theo chi nhánh và nhân viên.',
      status: 'DONE' as const,
      priority: 'MEDIUM' as const,
      dueDate: day(-2),
      startDate: day(-4),
      completedAt: day(-1),
      tags: ['báo cáo', 'doanh số'],
      type: 'Báo cáo',
      progress: 100,
      assigneeIndex: Math.min(1, employees.length - 1),
    },
    {
      title: 'Xử lý phiếu bảo hành #BH-0089',
      description: 'Kiểm tra sản phẩm lỗi và liên hệ hãng để xử lý bảo hành cho khách Nguyễn Văn A.',
      status: 'REVIEW' as const,
      priority: 'HIGH' as const,
      dueDate: day(1),
      startDate: day(-2),
      tags: ['bảo hành', 'khách hàng'],
      type: 'Bảo hành',
      progress: 80,
      assigneeIndex: 0,
    },
    {
      title: 'Nhập hàng lô mới từ NCC XYZ',
      description: 'Tiếp nhận và kiểm đếm lô hàng 200 sản phẩm, nhập kho và cập nhật hệ thống.',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      dueDate: day(2),
      tags: ['kho', 'nhập hàng'],
      type: 'Nhập kho',
      assigneeIndex: 0,
    },
    {
      title: 'Vệ sinh tổng kho cuối tháng',
      description: 'Tổ chức vệ sinh khu vực kho, kiểm tra điều kiện bảo quản.',
      status: 'TODO' as const,
      priority: 'LOW' as const,
      dueDate: day(6),
      tags: ['kho', 'vệ sinh'],
      type: 'Vận hành',
      assigneeIndex: 0,
    },
  ];

  console.log('\n📝 Creating tasks...');

  for (const task of sampleTasks) {
    const idx = counter++;
    const systemId = crypto.randomUUID();
    const id = `CVNB${pad(idx)}`;
    const assignee = employees[task.assigneeIndex];

    await prisma.task.upsert({
      where: { id },
      update: {
        assignees: [{
          systemId: crypto.randomUUID(),
          employeeSystemId: assignee.systemId,
          employeeName: assignee.fullName,
          role: 'assignee',
          assignedAt: new Date().toISOString(),
          assignedBy: creator.fullName,
        }],
      },
      create: {
        systemId,
        id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        startDate: task.startDate ?? null,
        completedAt: task.completedAt ?? null,
        tags: task.tags,
        type: task.type,
        progress: task.progress ?? 0,
        creatorId: creator.systemId,
        assigneeId: assignee.systemId,
        assigneeName: assignee.fullName,
        assignerName: creator.fullName,
        assignerId: creator.systemId,
        createdBy: creator.systemId,
        updatedBy: creator.systemId,
        assignees: [{
          systemId: crypto.randomUUID(),
          employeeSystemId: assignee.systemId,
          employeeName: assignee.fullName,
          role: 'assignee',
          assignedAt: new Date().toISOString(),
          assignedBy: creator.fullName,
        }],
      },
    });

    const statusEmoji = { TODO: '📋', IN_PROGRESS: '🔄', REVIEW: '👀', DONE: '✅', CANCELLED: '❌' }[task.status] || '📋';
    console.log(`   ${statusEmoji} ${id} - ${task.title} → ${assignee.fullName}`);
  }

  console.log(`\n✅ Created ${sampleTasks.length} sample tasks successfully!`);
  console.log(`   ID range: CVNB${pad(counter - sampleTasks.length)} → CVNB${pad(counter - 1)}`);
}

// Only run when executed directly, NOT when imported
import { pathToFileURL } from 'url';
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  main()
    .catch(e => {
      console.error('❌ Error seeding tasks:', e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
