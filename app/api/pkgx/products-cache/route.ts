/**
 * PKGX Products Cache API Route
 * GET - Fetch cached PKGX products (large data, separate from settings)
 * PUT - Update cached PKGX products
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

const SETTINGS_KEY = 'settings';
const SETTINGS_GROUP = 'pkgx';

export async function GET() {
  try {
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
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        products: pkgxProducts, 
        lastFetch,
        count: Array.isArray(pkgxProducts) ? pkgxProducts.length : 0,
      } 
    });
  } catch (error) {
    logError('[API] Error fetching PKGX products cache', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products cache' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa đăng nhập', 401)

  try {
    const body = await request.json();
    const { products } = body;

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { success: false, error: 'Products array is required' },
        { status: 400 }
      );
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

    return NextResponse.json({ 
      success: true, 
      data: { count: products.length } 
    });
  } catch (error) {
    logError('[API] Error updating PKGX products cache', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update products cache' },
      { status: 500 }
    );
  }
}
