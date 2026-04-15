import { config } from 'dotenv';
config();

import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // All status-type logs - these are ALL blocked by current UI filter
  const statusLogs = await prisma.activityLog.findMany({
    where: { entityType: 'order', actionType: 'status' },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { action: true, actionType: true, entityId: true }
  });
  console.log('=== Status-type logs (ALL hidden by UI filter) ===');
  for (const r of statusLogs) {
    console.log(`  ${r.entityId} | ${r.action}`);
  }

  // All non-status logs for ORDER007719
  const otherLogs = await prisma.activityLog.findMany({
    where: { entityId: 'ORDER007719', actionType: { not: 'status' } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { action: true, actionType: true }
  });
  console.log('\n=== ORDER007719 non-status logs (shown in UI) ===');
  for (const r of otherLogs) {
    console.log(`  [${r.actionType}] ${r.action}`);
  }

  await prisma.$disconnect();
}

main();
