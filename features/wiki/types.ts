export type WikiArticle = {
  systemId: string; // Unique system ID for routing
  id: string; // Display ID (e.g., "WIKI001")
  title: string;
  content: string; // Markdown content
  category: string;
  tags?: string[];
  createdAt: string; // YYYY-MM-DD
  updatedAt: string; // YYYY-MM-DD
  author: string; // Employee Name
};
