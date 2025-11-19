import type { SystemId, BusinessId } from '../lib/id-types.ts';

export interface WikiArticle {
  systemId: SystemId;
  id: BusinessId;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}
