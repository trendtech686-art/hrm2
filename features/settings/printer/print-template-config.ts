/**
 * Print Template Config - Server-safe utilities
 * 
 * Contains shared types and synchronous template resolution
 * that can be used in both server and client contexts.
 */

import type { TemplateType, PaperSize } from '@/lib/types/prisma-extended';
import type { PrintTemplate } from './types';
import { getDefaultTemplate } from './default-templates';

// ── Types ──────────────────────────────────────────────────────────────────

export interface PrintTemplateConfigData {
  templates: Record<string, PrintTemplate>;
  defaultSizes: Record<string, string>; // TemplateType -> PaperSize
}

// ── Template Resolution ─────────────────────────────────────────────────────

/**
 * Resolve template with priority: branch-specific > default
 */
export function resolveTemplate(
  templates: Record<string, PrintTemplate>,
  type: TemplateType,
  size: PaperSize,
  branchId?: string,
): PrintTemplate {
  const key = branchId ? `${type}-${size}-${branchId}` : `${type}-${size}`;

  // Branch-specific template
  if (branchId && templates[key]) {
    return templates[key];
  }

  // Default template (no branch)
  const defaultKey = `${type}-${size}`;
  if (templates[defaultKey]) {
    return templates[defaultKey];
  }

  // Fallback to hardcoded defaults
  return {
    id: `default-${type}-${size}`,
    type,
    name: 'Mẫu mặc định',
    content: getDefaultTemplate(type),
    paperSize: size,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get default paper size for a template type
 */
export function getDefaultSizeForType(type: TemplateType): PaperSize {
  return (type === 'product-label' || type === 'customer-mark-label') ? '50x30' : 'A4';
}

// ── Client-side Query Key ─────────────────────────────────────────────────

export const printTemplateConfigKey = '/api/settings/print-template-config';
