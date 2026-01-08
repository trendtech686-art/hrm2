/**
 * Re-export LogEntry and LogChange types from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export { type LogChange, type LogEntry } from '@/lib/types/prisma-extended';
