// Re-export all website types from central prisma-extended
export type {
  WebsiteCode,
  WebsiteDefinition,
} from '@/lib/types/prisma-extended';

export {
  PREDEFINED_WEBSITES,
  getWebsiteByCode,
  getActiveWebsites,
  getWebsiteName,
  getWebsiteColor,
} from '@/lib/types/prisma-extended';
