'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { WebsiteSeoData } from '@/lib/types/prisma-extended';

// ═══════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ═══════════════════════════════════════════════════════════════

export const formatCurrency = (value?: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '-';
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const formatDateTime = (dateStr?: string | null): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ═══════════════════════════════════════════════════════════════
// STATUS HELPERS
// ═══════════════════════════════════════════════════════════════

export type ProductStatus =
  | 'active'
  | 'inactive'
  | 'discontinued'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DISCONTINUED';

export const getStatusBadgeVariant = (
  status?: ProductStatus
): 'success' | 'secondary' | 'destructive' => {
  const normalized = status?.toString().toLowerCase();
  switch (normalized) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'secondary';
    case 'discontinued':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const getStatusLabel = (status?: ProductStatus): string => {
  const normalized = status?.toString().toLowerCase();
  switch (normalized) {
    case 'active':
      return 'Đang bán';
    case 'inactive':
      return 'Ngừng bán';
    case 'discontinued':
      return 'Ngừng SX';
    default:
      return 'Không rõ';
  }
};

// ═══════════════════════════════════════════════════════════════
// SEO SCORE HELPERS
// ═══════════════════════════════════════════════════════════════

export const calculateSeoScore = (seo: WebsiteSeoData | undefined): number => {
  if (!seo) return 0;

  let score = 0;
  if (seo.seoTitle && seo.seoTitle.length >= 30) score += 25;
  if (seo.metaDescription && seo.metaDescription.length >= 100) score += 25;
  if (seo.seoKeywords) score += 15;
  if (seo.shortDescription) score += 15;
  if (seo.longDescription && seo.longDescription.length >= 200) score += 20;

  return score;
};

export const getSeoStatusBadge = (score: number): React.ReactNode => {
  if (score >= 80) {
    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 hover:bg-green-100"
      >
        <CheckCircle className="h-3 w-3 mr-1" /> {score}%
      </Badge>
    );
  }
  if (score >= 50) {
    return (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      >
        <AlertTriangle className="h-3 w-3 mr-1" /> {score}%
      </Badge>
    );
  }
  if (score > 0) {
    return (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 hover:bg-red-100"
      >
        <XCircle className="h-3 w-3 mr-1" /> {score}%
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      —
    </Badge>
  );
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT TYPE CONFIG
// ═══════════════════════════════════════════════════════════════

import { ShoppingCart, Wrench, FileDigit, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NormalizedProductType = 'physical' | 'service' | 'digital' | 'combo';
export type ProductType = NormalizedProductType | Uppercase<NormalizedProductType>;

export interface ProductTypeConfig {
  label: string;
  icon: LucideIcon;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const productTypeConfig: Record<NormalizedProductType, ProductTypeConfig> = {
  physical: { label: 'Hàng hóa', icon: ShoppingCart, variant: 'secondary' },
  service: { label: 'Dịch vụ', icon: Wrench, variant: 'secondary' },
  digital: { label: 'Sản phẩm số', icon: FileDigit, variant: 'secondary' },
  combo: { label: 'Combo', icon: Layers, variant: 'secondary' },
};

export const getProductTypeConfig = (type?: string): ProductTypeConfig => {
  const normalized = (type || 'physical').toString().toLowerCase() as NormalizedProductType;
  return productTypeConfig[normalized] || productTypeConfig.physical;
};
