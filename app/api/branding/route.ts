import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

// GET /api/branding - Get branding info (logo, favicon) - public endpoint
export async function GET() {
  try {
    // Primary source: UserPreference (saved by Settings > General tab)
    // Key: 'general-settings', category: 'system-settings'
    // The value is a JSON object with logoUrl and faviconUrl fields
    const prefs = await prisma.userPreference.findMany({
      where: {
        key: 'general-settings',
        category: 'system-settings',
      },
      take: 1,
    });

    if (prefs.length > 0 && prefs[0].value) {
      const val = prefs[0].value as Record<string, unknown>;
      if (val.logoUrl || val.faviconUrl) {
        return apiSuccess({
          logoUrl: (val.logoUrl as string) || null,
          faviconUrl: (val.faviconUrl as string) || null,
        });
      }
    }

    // Fallback: Setting table (legacy)
    const settings = await prisma.setting.findMany({
      where: {
        group: 'general',
        key: { in: ['logoUrl', 'faviconUrl'] },
      },
    });

    const logoSetting = settings.find(s => s.key === 'logoUrl');
    const faviconSetting = settings.find(s => s.key === 'faviconUrl');

    return apiSuccess({
      logoUrl: (logoSetting?.value as string) || null,
      faviconUrl: (faviconSetting?.value as string) || null,
    });
  } catch (error) {
    logError('Error fetching branding', error);
    return apiError('Failed to fetch branding', 500);
  }
}
