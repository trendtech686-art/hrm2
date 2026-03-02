/**
 * Wiki Data Fetchers
 * Server-side data fetching with caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache';

export interface WikiArticle {
  systemId: string;
  id: string;
  title: string;
  slug?: string | null;
  content: string;
  category?: string | null;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string | null;
  author?: {
    systemId: string;
    fullName: string | null;
  } | null;
}

export interface WikiCategory {
  name: string;
  count: number;
}

export interface WikiParams {
  search?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

// Request-level cache for wiki articles
export const getWikiArticles = cache(async (params: WikiParams = {}) => {
  return fetchWikiArticlesWithCache(params);
});

// Time-based cache for wiki articles list
import type { Prisma } from '@/generated/prisma/client';

const fetchWikiArticlesWithCache = unstable_cache(
  async (params: WikiParams) => {
    const { search, category, tags, isPublished = true, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.WikiWhereInput = { isPublished, isDeleted: false };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const [items, total] = await Promise.all([
      prisma.wiki.findMany({
        where,
        select: {
          systemId: true,
          id: true,
          title: true,
          slug: true,
          content: true,
          category: true,
          tags: true,
          isPublished: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          author: { select: { systemId: true, fullName: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.wiki.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  [CACHE_TAGS.WIKI],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.WIKI] }
);

// Get wiki categories
export const getWikiCategories = cache(async () => {
  return fetchWikiCategoriesWithCache();
});

const fetchWikiCategoriesWithCache = unstable_cache(
  async () => {
    // Get distinct categories from wiki articles
    const articles = await prisma.wiki.findMany({
      where: { isDeleted: false, category: { not: null } },
      select: { category: true },
    });
    
    // Count articles per category
    const categoryCount = new Map<string, number>();
    for (const article of articles) {
      if (article.category) {
        categoryCount.set(article.category, (categoryCount.get(article.category) || 0) + 1);
      }
    }
    
    return Array.from(categoryCount.entries()).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => a.name.localeCompare(b.name));
  },
  [CACHE_TAGS.WIKI],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.WIKI] }
);

// Get single wiki article by slug
export const getWikiArticleBySlug = cache(async (slug: string) => {
  return fetchWikiArticleBySlugWithCache(slug);
});

const fetchWikiArticleBySlugWithCache = unstable_cache(
  async (slug: string) => {
    return prisma.wiki.findUnique({
      where: { slug },
      select: {
        systemId: true,
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true,
        tags: true,
        isPublished: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: { select: { systemId: true, fullName: true } },
      },
    });
  },
  [CACHE_TAGS.WIKI],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.WIKI] }
);
