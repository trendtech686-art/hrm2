import type { SystemId, BusinessId } from '../../lib/id-types';

export type WikiArticle = {
  systemId: SystemId; // Unique system ID for routing
  id: BusinessId; // Display ID (e.g., "WIKI001")
  title: string;
  content: string; // Markdown content
  category: string;
  tags?: string[];
  createdAt: string; // YYYY-MM-DD
  updatedAt: string; // YYYY-MM-DD
  createdBy?: SystemId;
  updatedBy?: SystemId;
  author: string; // Employee Name
};
