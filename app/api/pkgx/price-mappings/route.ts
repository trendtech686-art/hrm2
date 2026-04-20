import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth}from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/pkgx/price-mappings - Get all price mappings
export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const mappings = await prisma.pkgxPriceMapping.findMany({
      where: { isActive: true },
      orderBy: { priceType: 'asc' },
    });

    // Get pricing policies from PricingPolicy table (NOT SettingsData)
    const policyIds = mappings.map(m => m.pricingPolicyId).filter(Boolean) as string[];
    const policies = policyIds.length > 0 
      ? await prisma.pricingPolicy.findMany({
          where: { 
            systemId: { in: policyIds },
            isActive: true
          },
          select: { systemId: true, name: true }
        })
      : [];
    
    const validPolicyIds = new Set(policies.map(p => p.systemId));

    // Enrich mappings with policy info, set pricingPolicyId to null if policy doesn't exist
    const enrichedMappings = mappings.map(m => {
      const isValid = m.pricingPolicyId && validPolicyIds.has(m.pricingPolicyId);
      return {
        ...m,
        // If policy doesn't exist, treat as unmapped
        pricingPolicyId: isValid ? m.pricingPolicyId : null,
        pricingPolicy: isValid ? policies.find(p => p.systemId === m.pricingPolicyId) : null
      };
    });

    return NextResponse.json({ success: true, data: enrichedMappings });
  } catch (error) {
    logError('Error fetching price mappings', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch price mappings' }, { status: 500 });
  }
}

// PATCH /api/pkgx/price-mappings - Bulk update price mappings
// Body: { shopPrice: "PRICING_POLICY_SYSTEM_ID", marketPrice: null, ... }
export async function PATCH(request: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    // Reverse map for easier lookup
    const fieldToPriceType: Record<string, string> = {
      'shopPrice': 'shop_price',
      'partnerPrice': 'partner_price', 
      'price5Vat': 'price_5vat',
      'price12Novat': 'price_12novat',
      'price5Novat': 'price_5novat',
    };

    // Process each field in the body sequentially (not in transaction for simplicity)
    for (const [field, policySystemId] of Object.entries(body)) {
      const priceType = fieldToPriceType[field];
      if (!priceType) {
        continue;
      }


      // Find existing mapping for this price type
      const existing = await prisma.pkgxPriceMapping.findFirst({
        where: { priceType }
      });

      const newPolicyId = (policySystemId === null || policySystemId === 'none') 
        ? null 
        : policySystemId as string;

      if (existing) {
        await prisma.pkgxPriceMapping.update({
          where: { systemId: existing.systemId },
          data: { pricingPolicyId: newPolicyId }
        });
      } else if (newPolicyId) {
        // Create new mapping if doesn't exist and has a policy
        await prisma.pkgxPriceMapping.create({
          data: {
            priceType,
            pricingPolicyId: newPolicyId,
            isActive: true,
          }
        });
      }
    }

    // Return updated mappings
    const mappings = await prisma.pkgxPriceMapping.findMany({
      where: { isActive: true },
      orderBy: { priceType: 'asc' },
    });

    // Activity log for price mapping changes
    const priceTypeLabels: Record<string, string> = {
      shopPrice: 'Giá bán',
      partnerPrice: 'Giá đại lý',
      price5Vat: 'Giá 5% VAT',
      price12Novat: 'Giá 12% Không VAT',
      price5Novat: 'Giá 5% Không VAT',
    }
    const changedFields = Object.keys(body)
      .filter(f => fieldToPriceType[f])
      .map(f => priceTypeLabels[f] || f)
    if (changedFields.length > 0) {
      createActivityLog({
        entityType: 'pkgx_settings',
        entityId: 'pkgx-price-mappings',
        action: `Cập nhật mapping giá PKGX: ${changedFields.join(', ')}`,
        actionType: 'update',
        createdBy: session.user?.id ?? '',
      }).catch(e => logError('price-mapping activity log failed', e))
    }

    return NextResponse.json({ success: true, data: mappings });
  } catch (error) {
    logError('Error updating price mappings', error);
    return NextResponse.json({ success: false, error: 'Failed to update price mappings' }, { status: 500 });
  }
}
