/**
 * API: Generate Next IDs
 * 
 * POST /api/id/generate
 * Body: { entityType: string, customBusinessId?: string }
 * 
 * Returns: { systemId, businessId, counter }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateNextIds, type EntityType, ID_CONFIG } from '@/lib/id-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityType, customBusinessId } = body as { 
      entityType: string; 
      customBusinessId?: string;
    };
    
    // Validate entityType
    if (!entityType || !ID_CONFIG[entityType as EntityType]) {
      return NextResponse.json(
        { error: `Invalid entityType: ${entityType}` },
        { status: 400 }
      );
    }
    
    const ids = await generateNextIds(entityType as EntityType, customBusinessId);
    
    return NextResponse.json(ids);
  } catch (error) {
    console.error('[API /api/id/generate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate IDs', details: String(error) },
      { status: 500 }
    );
  }
}
