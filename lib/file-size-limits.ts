import { prisma } from '@/lib/prisma'
import { cache, CACHE_TTL } from '@/lib/cache'

export interface FileSizeLimits {
  imageMb: number
  documentMb: number
  generalMb: number
}

const DEFAULT_FILE_SIZE_LIMITS: FileSizeLimits = {
  imageMb: 10,
  documentMb: 50,
  generalMb: 20,
}

const CACHE_KEY = 'settings:media:file_size_limits'

export async function getFileSizeLimits(): Promise<FileSizeLimits> {
  const cached = cache.get(CACHE_KEY) as FileSizeLimits | undefined
  if (cached) return cached

  try {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'file_size_limits', group: 'media' } },
    })

    if (setting?.value) {
      const limits = { ...DEFAULT_FILE_SIZE_LIMITS, ...(setting.value as object) }
      cache.set(CACHE_KEY, limits, CACHE_TTL.LONG * 1000)
      return limits
    }
  } catch {
    // Fallback to defaults on error
  }

  return DEFAULT_FILE_SIZE_LIMITS
}

export function getMaxFileSizeBytes(limits: FileSizeLimits) {
  return {
    IMAGE: limits.imageMb * 1024 * 1024,
    DOCUMENT: limits.documentMb * 1024 * 1024,
    GENERAL: limits.generalMb * 1024 * 1024,
    image: limits.imageMb * 1024 * 1024,
    document: limits.documentMb * 1024 * 1024,
    default: limits.generalMb * 1024 * 1024,
  }
}
