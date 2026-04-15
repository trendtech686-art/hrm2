import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

// GET /api/branding - Get branding info (logo, favicon) - public endpoint
export async function GET() {
  try {
    // Fetch logoUrl and faviconUrl from settings
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
