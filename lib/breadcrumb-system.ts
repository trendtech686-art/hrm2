/**
 * Breadcrumb System v2.0
 * 
 * Simple pathname-based breadcrumbs for Next.js
 * No Prisma/store dependencies - works everywhere
 * 
 * @see breadcrumb-generator.ts for implementation
 */

// Re-export main functions
export {
  getBreadcrumbsFromPath,
  useBreadcrumbs,
  type BreadcrumbItem,
  // Legacy compatibility
  generateDetailBreadcrumb,
  generateFormBreadcrumb,
  getEntityDisplayInfo,
  registerBreadcrumbStore,
  clearBreadcrumbStores,
  getRegisteredStores,
} from './breadcrumb-generator';

/**
 * Generate breadcrumb items from pathname (alias for backward compatibility)
 * 
 * @param pathname - Current route pathname  
 * @param context - Optional entity data (name, id)
 * @returns Array of BreadcrumbItem
 */
export function generateBreadcrumb(
  pathname: string,
  context?: { name?: string; id?: string }
): Array<{ label: string; href: string; isCurrent?: boolean }> {
  const { getBreadcrumbsFromPath } = require('./breadcrumb-generator');
  return getBreadcrumbsFromPath(pathname, context);
}

/**
 * Generate page title from pathname (legacy compatibility)
 * 
 * @param pathname - Current route pathname
 * @param context - Optional entity data (name, id)
 * @returns Object with title and subtitle
 */
export function generatePageTitle(
  pathname: string,
  context?: { name?: string; id?: string }
): { title: string; subtitle?: string } {
  const breadcrumbs = generateBreadcrumb(pathname, context);
  const currentCrumb = breadcrumbs.find(b => b.isCurrent) || breadcrumbs[breadcrumbs.length - 1];
  
  return {
    title: currentCrumb?.label || 'Trang',
    subtitle: context?.name || undefined
  };
}
