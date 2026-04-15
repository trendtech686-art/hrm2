/**
 * Migration script: Move recurring tasks & templates from SettingsData JSON to dedicated tables
 * 
 * Run with: npx tsx scripts/migrate-tasks-to-tables.ts
 */
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

let connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not defined');
connectionString = connectionString.replace(/^["']|["']$/g, '');

const pool = new Pool({ connectionString, max: 5 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function mapPriority(priority: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  const map: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
    'Thấp': 'LOW', 'low': 'LOW', 'LOW': 'LOW',
    'Trung bình': 'MEDIUM', 'medium': 'MEDIUM', 'MEDIUM': 'MEDIUM',
    'Cao': 'HIGH', 'high': 'HIGH', 'HIGH': 'HIGH',
    'Khẩn cấp': 'URGENT', 'urgent': 'URGENT', 'URGENT': 'URGENT',
  };
  return map[priority] || 'MEDIUM';
}

async function migrateRecurringTasks() {
  console.log('--- Migrating recurring tasks ---');
  
  const settings = await prisma.settingsData.findFirst({
    where: { type: 'recurring-tasks' },
  });

  if (!settings?.metadata) {
    console.log('No recurring tasks data found in SettingsData');
    return 0;
  }

  const items = ((settings.metadata as Record<string, unknown>)?.items as Array<Record<string, unknown>>) || [];
  console.log(`Found ${items.length} recurring tasks to migrate`);

  let migrated = 0;
  for (const item of items) {
    const systemId = item.systemId as string;
    
    // Skip if already migrated
    const existing = await prisma.recurringTask.findUnique({ where: { systemId } });
    if (existing) {
      console.log(`  Skipping ${systemId} (already exists)`);
      continue;
    }

    // Build recurrence pattern from either format
    const recurrencePattern = item.recurrencePattern || {
      frequency: item.frequency || 'weekly',
      interval: item.interval || 1,
      daysOfWeek: item.daysOfWeek,
      dayOfMonth: item.dayOfMonth,
      monthOfYear: item.monthOfYear,
    };

    await prisma.recurringTask.create({
      data: {
        systemId,
        id: (item.id as string) || systemId,
        title: (item.title as string) || 'Untitled',
        description: item.description as string | null,
        assigneeSystemId: item.assigneeSystemId as string | null,
        assignees: (item.assignees as object) ?? undefined,
        assignerId: item.assignerId as string | null,
        assignerName: item.assignerName as string | null,
        priority: mapPriority((item.priority as string) || 'medium'),
        estimatedHours: item.estimatedHours ? Number(item.estimatedHours) : null,
        recurrencePattern: recurrencePattern as object,
        startDate: item.startDate ? new Date(item.startDate as string) : new Date(),
        durationDays: (item.durationDays as number) || 1,
        createDaysBefore: (item.createDaysBefore as number) || 0,
        isActive: item.isActive !== false,
        isPaused: item.isPaused === true,
        createdTaskIds: (item.createdTaskIds as string[]) ?? undefined,
        lastCreatedDate: item.lastCreatedDate ? new Date(item.lastCreatedDate as string) : null,
        nextOccurrenceDate: item.nextOccurrenceDate || item.nextRunDate
          ? new Date((item.nextOccurrenceDate || item.nextRunDate) as string)
          : null,
        occurrenceCount: (item.occurrenceCount as number) || 0,
        createdBy: item.createdBy as string | null,
        createdAt: item.createdAt ? new Date(item.createdAt as string) : new Date(),
        templateId: item.templateId as string | null,
      },
    });

    migrated++;
    console.log(`  Migrated: ${systemId} - ${item.title}`);
  }

  return migrated;
}

async function migrateTemplates() {
  console.log('\n--- Migrating task templates ---');
  
  const settings = await prisma.settingsData.findFirst({
    where: { type: 'task-templates' },
  });

  if (!settings?.metadata) {
    console.log('No template data found in SettingsData');
    return 0;
  }

  const items = ((settings.metadata as Record<string, unknown>)?.items as Array<Record<string, unknown>>) || [];
  console.log(`Found ${items.length} templates to migrate`);

  let migrated = 0;
  for (const item of items) {
    const systemId = item.systemId as string;
    
    // Skip if already migrated
    const existing = await prisma.taskTemplate.findUnique({ where: { systemId } });
    if (existing) {
      console.log(`  Skipping ${systemId} (already exists)`);
      continue;
    }

    await prisma.taskTemplate.create({
      data: {
        systemId,
        id: (item.id as string) || systemId,
        name: (item.name as string) || 'Untitled',
        description: item.description as string | null,
        category: item.category as string | null,
        title: item.title as string | null,
        taskDescription: item.taskDescription as string | null,
        priority: mapPriority((item.priority as string) || 'medium'),
        estimatedHours: item.estimatedHours ? Number(item.estimatedHours) : null,
        assigneeRoles: (item.assigneeRoles as object) ?? undefined,
        subtasks: (item.subtasks as object) ?? undefined,
        checklistItems: item.checklistItems || item.checklist ? (item.checklistItems || item.checklist) as object : undefined,
        customFields: ((item.customFields || item.customFieldValues) as object) ?? undefined,
        usageCount: (item.usageCount as number) || 0,
        isActive: item.isActive !== false,
        createdBy: item.createdBy as string | null,
        createdAt: item.createdAt ? new Date(item.createdAt as string) : new Date(),
      },
    });

    migrated++;
    console.log(`  Migrated: ${systemId} - ${item.name}`);
  }

  return migrated;
}

async function main() {
  console.log('=== Task Data Migration: SettingsData → Dedicated Tables ===\n');
  
  const recurringCount = await migrateRecurringTasks();
  const templateCount = await migrateTemplates();
  
  console.log(`\n=== Migration Complete ===`);
  console.log(`Recurring tasks migrated: ${recurringCount}`);
  console.log(`Templates migrated: ${templateCount}`);
  console.log('\nNote: The old SettingsData rows are preserved as backup.');
  console.log('You can safely remove them after verifying the new tables work correctly.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
