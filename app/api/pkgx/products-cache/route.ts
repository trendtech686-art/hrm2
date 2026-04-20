/**
 * PKGX Products Cache API Route
 * GET - Fetch cached PKGX products (large data, separate from settings)
 * PUT - Update cached PKGX products
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { apiHandler } from '@/lib/api-handler';

const SETTINGS_KEY = 'settings';
const SETTINGS_GROUP = 'pkgx';

export const GET = apiHandler(async () => {
  const setting = await prisma.setting.findFirst({
    where: {
      key: SETTINGS_KEY,
      group: SETTINGS_GROUP,
    },
    select: { value: true },
  });
  
  const data = (setting?.value || {}) as Record<string, unknown>;
  const pkgxProducts = data.pkgxProducts || [];
  const lastFetch = data.pkgxProductsLastFetch || null;
  
  return apiSuccess({ 
    products: pkgxProducts, 
    lastFetch,
    count: Array.isArray(pkgxProducts) ? pkgxProducts.length : 0,
  });
});

export const PUT = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { products } = body;

  if (!Array.isArray(products)) {
    return apiError('Products array is required', 400);
  }

  // Use raw SQL to update only the pkgxProducts field without loading entire JSON
  await prisma.$executeRaw`
    UPDATE "Setting"
    SET value = jsonb_set(
      jsonb_set(
        COALESCE(value, '{}'::jsonb),
        '{pkgxProducts}',
        ${JSON.stringify(products)}::jsonb
      ),
      '{pkgxProductsLastFetch}',
      ${JSON.stringify(new Date().toISOString())}::jsonb
    )
    WHERE key = ${SETTINGS_KEY} AND "group" = ${SETTINGS_GROUP}
  `;

  return apiSuccess({ count: products.length });
});
