export interface WikiArticle {
  systemId: string;
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}
