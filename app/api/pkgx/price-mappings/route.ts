import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth}from '@/lib/api-utils';

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
    console.error('Error fetching price mappings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch price mappings' }, { status: 500 });
  }
}

// PATCH /api/pkgx/price-mappings - Bulk update price mappings
// Body: { shopPrice: "PRICING_POLICY_SYSTEM_ID", marketPrice: null, ... }
export async function PATCH(request: Request) {
  console.log('[PATCH price-mappings] START');
  const session = await requireAuth();
  console.log('[PATCH price-mappings] Session:', session ? 'OK' : 'NULL');
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    console.log('[PATCH price-mappings] Received body:', JSON.stringify(body));

    // Reverse map for easier lookup
    const fieldToPriceType: Record<string, string> = {
      'shopPrice': 'shop_price',
      'marketPrice': 'market_price',
      'partnerPrice': 'partner_price', 
      'acePrice': 'ace_price',
      'dealPrice': 'deal_price',
    };

    // Process each field in the body sequentially (not in transaction for simplicity)
    for (const [field, policySystemId] of Object.entries(body)) {
      const priceType = fieldToPriceType[field];
      if (!priceType) {
        console.log(`[PATCH price-mappings] Skipping unknown field: ${field}`);
        continue;
      }

      console.log(`[PATCH price-mappings] Processing: ${field} => ${priceType} = ${policySystemId}`);

      // Find existing mapping for this price type
      const existing = await prisma.pkgxPriceMapping.findFirst({
        where: { priceType }
      });

      const newPolicyId = (policySystemId === null || policySystemId === 'none') 
        ? null 
        : policySystemId as string;

      if (existing) {
        console.log(`[PATCH price-mappings] Updating existing: ${existing.systemId}`);
        await prisma.pkgxPriceMapping.update({
          where: { systemId: existing.systemId },
          data: { pricingPolicyId: newPolicyId }
        });
      } else if (newPolicyId) {
        // Create new mapping if doesn't exist and has a policy
        console.log(`[PATCH price-mappings] Creating new mapping for ${priceType}`);
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

    console.log('[PATCH price-mappings] Success, returning', mappings.length, 'mappings');
    return NextResponse.json({ success: true, data: mappings });
  } catch (error) {
    console.error('Error updating price mappings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update price mappings' }, { status: 500 });
  }
}
