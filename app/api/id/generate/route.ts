/**
 * API: Generate Next IDs
 * 
 * POST /api/id/generate
 * Body: { entityType: string, customBusinessId?: string }
 * 
 * Returns: { systemId, businessId, counter }
 */

import { generateNextIds, type EntityType, ID_CONFIG } from '@/lib/id-system'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json();
    const { entityType, customBusinessId } = body as { 
      entityType: string; 
      customBusinessId?: string;
    };
    
    // Validate entityType
    if (!entityType || !ID_CONFIG[entityType as EntityType]) {
      return apiError(`Invalid entityType: ${entityType}`, 400);
    }
    
    const ids = await generateNextIds(entityType as EntityType, customBusinessId);
    
    return apiSuccess(ids);
  } catch (error) {
    logError('[API /api/id/generate] Error', error);
    return apiError('Failed to generate IDs', 500);
  }
}
